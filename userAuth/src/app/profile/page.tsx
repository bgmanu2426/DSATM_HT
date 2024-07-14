"use client"

import Navbar from '@/components/Navbar';
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const ProfilePage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState('')
    const [userVerified, setUserVerified] = useState(true)

    //API request to check if user is verified or not
    useEffect(() => {
        axios("api/users/getUserData")
            .then((response) => {
                setUserVerified(response.data.data.isVerified);
                setUserData(response.data.data._id);
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }, [])

    const handleLogout = (e: any) => {
        e.preventDefault();
        setLoading(true);
        //API request to logout an user
        axios("api/users/logout")
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

    //Function to get user details
    const getUserDetails = () => {
        router.push(`/profile/${userData}`)
        router.refresh()
    }

    return (
        <>
            <Navbar />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className='flex flex-col space-y-6 items-center justify-center min-h-[70vh]'>
                <h1 className='font-semibold text-2xl mb-20'>ProfilePage</h1>
                {!userVerified && <div className="md:max-w-[40vw] max-w-[40vw] w-full bg-red-700 shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-lg font-medium text-center text-white">Verify User</p>
                                <p className="mt-1 text-sm text-white text-center">Verify your account by clicking on the link sent to your registered email</p>
                            </div>
                        </div>
                    </div>
                </div>}
                <p>User ID : {userData}</p>
                <div className='flex'>
                    <button onClick={getUserDetails} className='m-3 rounded bg-blue-800 hover:bg-blue-500 px-3 py-1 text-white'>Get User Details</button>
                    <button onClick={handleLogout} className='m-3 rounded bg-red-800 hover:bg-red-500 px-3 py-1 text-white'>{loading ? "Processing" : "Logout"}</button>
                </div>
            </div>
        </>
    )
}

export default ProfilePage