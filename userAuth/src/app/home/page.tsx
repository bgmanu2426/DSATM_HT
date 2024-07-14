"use client";

import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { join } from "path";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const ProfilePage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState("");
    const [userVerified, setUserVerified] = useState(true);
    const [file, setFile] = useState();

    //API request to check if user is verified or not
    useEffect(() => {
        axios("api/users/getUserData")
            .then((response) => {
                setUserVerified(response.data.data.isVerified);
                setUserData(response.data.data._id);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }, []);

    const handleLogout = (e: any) => {
        e.preventDefault();
        setLoading(true);
        //API request to logout an user
        axios("api/users/logout")
            .then((response) => {
                toast.success(response.data.message, { duration: 1500 });
                setTimeout(() => {
                    router.push("/login");
                    router.refresh();
                    setLoading(false);
                }, 1500);
            })
            .catch((error) => {
                toast.error(error.response.data.error, { duration: 3000 });
                setLoading(false);
            });
    };

    const uploadDumpFile = async(e: any) => {
        e.preventDefault();
        setLoading(true);
        
        const file: File = e.target.files;

        if (!file) {
            toast.error("No files selected", { duration: 3000 });
            setLoading(false);
        }
        // API request to upload files to the flask app
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);

        const path = join(__dirname, "../../temp", file.name)
    };

    return (
        <>
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex flex-col space-y-6 items-center justify-center min-h-[70vh]">
                <h1 className="font-semibold text-2xl mb-20">Upload Dump File</h1>
                {!userVerified && (
                    <div className="md:max-w-[40vw] max-w-[40vw] w-full bg-red-700 shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5"></div>
                                <div className="ml-3 flex-1">
                                    <p className="text-lg font-medium text-center text-white">
                                        Verify User
                                    </p>
                                    <p className="mt-1 text-sm text-white text-center">
                                        Verify your account by clicking on the link sent to your
                                        registered email
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <form className="col-span-full">
                    <label
                        htmlFor="cover-photo"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Upload File
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <div className="mt-2 flex text-sm leading-6 text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Upload</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">
                                only BIN,DMP files supported
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={uploadDumpFile}
                        className="ml-[70px] m-3 rounded bg-blue-800 hover:bg-blue-500 px-3 py-1 text-white"
                    >
                        {loading ? "Processing" : "Upload"}
                    </button>
                </form>
                <button
                    onClick={handleLogout}
                    className="m-3 rounded bg-red-800 hover:bg-red-500 px-3 py-1 text-white"
                >
                    {loading ? "Processing" : "Logout"}
                </button>
            </div>
        </>
    );
};

export default ProfilePage;
