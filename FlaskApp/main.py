import os
import uuid
import threading
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from volatility3.framework import contexts, constants, interfaces, automagic, exceptions, plugins
from volatility3.framework.configuration import requirements
from volatility3.cli.text_renderer import QuickTextRenderer

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'dmp', 'raw', 'bin'}
ANALYSIS_STATUS = {}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/memory-dump', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_id)
        file.save(filepath)
        return jsonify({'status': 'success', 'fileId': file_id}), 201
    else:
        return jsonify({'status': 'error', 'message': 'File not allowed'}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze_file():
    data = request.get_json()
    file_id = data.get('fileId')
    plugin_name = data.get('plugin')
    
    if not file_id or not plugin_name:
        return jsonify({'status': 'error', 'message': 'fileId and plugin are required'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_id)
    if not os.path.exists(filepath):
        return jsonify({'status': 'error', 'message': 'File not found'}), 404
    
    analysis_id = str(uuid.uuid4())
    ANALYSIS_STATUS[analysis_id] = 'in_progress'
    
    thread = threading.Thread(target=run_volatility_analysis, args=(analysis_id, filepath, plugin_name))
    thread.start()
    
    return jsonify({'status': 'analysis_started', 'analysisId': analysis_id}), 202

@app.route('/api/analysis/<analysisId>/status', methods=['GET'])
def get_analysis_status(analysisId):
    status = ANALYSIS_STATUS.get(analysisId)
    if not status:
        return jsonify({'status': 'error', 'message': 'Analysis not found'}), 404
    return jsonify({'status': status})

@app.route('/api/analysis/<analysisId>/results', methods=['GET'])
def get_analysis_results(analysisId):
    result_filepath = os.path.join(app.config['RESULT_FOLDER'], analysisId + '.txt')
    if not os.path.exists(result_filepath):
        return jsonify({'status': 'error', 'message': 'Results not found'}), 404
    
    with open(result_filepath, 'r') as file:
        results = file.read()
    
    return jsonify({'status': 'success', 'results': results})

@app.route('/api/analyses', methods=['GET'])
def list_analyses():
    analyses = []
    for filename in os.listdir(app.config['RESULT_FOLDER']):
        if filename.endswith('.txt'):
            analysis_id = filename[:-4]
            analyses.append({
                'analysisId': analysis_id,
                'date': os.path.getctime(os.path.join(app.config['RESULT_FOLDER'], filename)),
                'plugin': analysis_id.split('_')[1]  # Assuming analysisId contains plugin info
            })
    return jsonify({'analyses': analyses})

def run_volatility_analysis(analysis_id, filepath, plugin_name):
    try:
        # Create a new context
        context = contexts.Context()
        
        # Load the memory file
        file_layer_name = f"memory_layer_{analysis_id}"
        context.config["automagic.LayerStacker.single_location"] = f"file://{filepath}"
        
        # Load the automagic
        automagics = automagic.available(context)
        
        # Find the plugin
        plugin_list = plugins.__path__[0]
        plugin_class = plugins.load_plugin("windows.pslist.PsList")
        
        if not plugin_class:
            raise ValueError(f"Plugin {plugin_name} not found")
        
        # Instantiate the plugin
        plugin = plugin_class(context, context.config_path, name=plugin_class.__name__)
        
        # Run automagics
        for automagic_instance in automagics:
            automagic_instance(context, plugin, progress_callback=None)
        
        # Run the plugin
        render = QuickTextRenderer()
        output = render.render(plugin.run())
        
        # Save the results
        result_filepath = os.path.join(app.config['RESULT_FOLDER'], analysis_id + '.txt')
        with open(result_filepath, 'w') as result_file:
            result_file.write(output)
        
        ANALYSIS_STATUS[analysis_id] = 'completed'
    except Exception as e:
        ANALYSIS_STATUS[analysis_id] = 'failed'
        print(f"Error during analysis: {e}")

if __name__ == '__main__':
    app.run(debug=True)