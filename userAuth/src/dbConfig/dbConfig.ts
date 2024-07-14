import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB Connected Successfully");
        })

        connection.on('error', (err: any) => {
            console.log(`MongoDB connection Error. Please make sure MongoDB is running. ${err}`);
        })
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectToDB