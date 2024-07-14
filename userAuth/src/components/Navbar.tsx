import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div>
            <header className="text-white body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <Link href={'/'} className="flex title-font font-medium items-center mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-white text-xl">Volatility Analyzer</span>
                    </Link>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-end">
                        <Link href={'/home'} className="mr-5 hover:text-indigo-900">Home</Link>
                        <Link href={'/login'} className="mr-5 hover:text-indigo-900">Login</Link>
                        <Link href={'/signup'} className="mr-5 hover:text-indigo-900">Signup</Link>
                    </nav>
                </div>
            </header>
        </div>
    )
}

export default Navbar