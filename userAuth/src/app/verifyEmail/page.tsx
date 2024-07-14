/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';

const VerifyEmailPage = () => {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verifyEmail", { token })
                .then((response) => {
                    toast.success(response.data.message, { duration: 1500 });
                    setVerified(true);
                })
                .catch((error) => {
                    toast.error(error.response.data.error, { duration: 3000 });
                })
        } catch (error: any) {
            setError(true);
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token])


    return (
        <>
            {error
                ?
                (
                    <div className='flex flex-col items-center justify-center py-2 min-h-screen'>
                        <h2 className='text-2xl'>400 | Error</h2>
                    </div>
                )
                :
                (<>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                    <h1 className="text-4xl m-5">Verify E-mail</h1>
                    <h1 className='m-5'>User token = {token ? `${token}` : "no token"}</h1>
                    <hr className='w-[90vw] mx-auto' />
                    <div className="flex flex-col items-center justify-center py-2 my-8 space-y-3">
                        {verified && (
                            <div className='flex flex-col items-center justify-center py-2 space-y-3'>
                                <h2 className='text-2xl'>Email Verified</h2>
                                <Link className='text-white px-2 py-1 my-10 rounded bg-blue-600 hover:bg-blue-800' href={'/login'}>Login</Link>
                            </div>
                        )}
                    </div>
                </>)
            }
        </>
    )
}

export default VerifyEmailPage