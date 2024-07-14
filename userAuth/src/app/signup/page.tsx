"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const SignupPage = () => {
    const router = useRouter();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false)

    //Async await can also be used below
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);

        axios.post("api/users/signup", user)
            .then((response) => {
                toast.success(response.data.message, { duration: 1500 });
                setTimeout(() => {
                    router.push("/login")
                    router.refresh()
                    setLoading(false);
                }, 1500);
            })
            .catch((error) => {
                toast.error(error.response.data.error, { duration: 3000 });
                setLoading(false);
            })
    }

    useEffect(() => {
        if (user.username.length && user.email.length > 0 && user.password.length) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user])

    return (
        <>
            <Navbar />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="container px-5 py-10 mx-auto flex">
                <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                    <h2 className="text-gray-900 text-2xl mb-1 font-medium text-center">Signup</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
                        <div className="relative mb-4">
                            <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
                            <input
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                placeholder='Username'
                                minLength={5}
                                required
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">E-mail</label>
                            <input
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                placeholder='E-mail'
                                required
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                placeholder='Password'
                                minLength={5}
                                required
                            />
                        </div>
                        <button className="text-white bg-indigo-700 disabled:bg-indigo-300 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-900 rounded text-lg" disabled={buttonDisabled}>{loading ? "Processing" : "Signup"}</button>
                        <p className="text-sm text-black mt-4"><strong>Already have an accout?</strong><Link href={'/login'} className='hover:text-blue-800 hover:underline'> Click here to login</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignupPage