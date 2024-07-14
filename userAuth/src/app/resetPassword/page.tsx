"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const ResetPassword = () => {
    const router = useRouter();

    const [token, setToken] = useState("")
    const [password, setPassword] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, [])

    useEffect(() => {
        if (password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [password])

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setLoading(true);

        //API request to reset user password
        axios.post("api/users/resetPassword", { token, password })
        .then((response) => {
            toast.success(response.data.message, { duration: 1500 });
            setTimeout(() => {
                router.push("/login");
                router.refresh()
                setLoading(false);
            }, 1500);
        })
        .catch((error) => {
            toast.error(error.response.data.error, { duration: 3000 });
            setLoading(false);
        })
    }
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="container px-5 py-20 m-auto flex md:mt-28">
                <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                    <h2 className="text-gray-900 text-2xl mb-1 font-medium text-center">Reset Password</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center' >
                    <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                type="text"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter Password'
                                required
                            />
                        </div>
                        <button className="text-white bg-indigo-700 disabled:bg-indigo-300 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-900 rounded text-lg" disabled={buttonDisabled}>{loading ? "Processing" : "Change Password"}</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;