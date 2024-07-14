"use client"

import Navbar from '@/components/Navbar'
import axios from 'axios'
import React from 'react'

const UserProfile = ({ params }: any) => {
    const [userData, setUserData] = React.useState({ username: undefined, email: undefined })

    React.useEffect(() => {
        axios("/api/users/getUserData")
            .then((response) => {
                setUserData({
                    username: response.data.data.username,
                    email: response.data.data.email
                });
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }, [])
    return (
        <>
            <Navbar />
            <div className='min-h-[80vh] mx-auto w-fit md:text-2xl text-lg flex flex-col justify-center space-y-10'>
                <p>UserID : <span className='p-2 bg-orange-500 text-white rounded'>{params.id}</span></p>
                <p>Username : <span className='p-2 bg-orange-500 text-white rounded'>{userData.username}</span></p>
                <p>E-mail : <span className='p-2 bg-orange-500 text-white rounded'>{userData.email}</span></p>
            </div>
        </>
    )
}

export default UserProfile