import React from 'react';
import logoAvatar from '../assets/logo-rs-em.jpg';
import { Link } from 'react-router-dom';
const NavBar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-primary-dark shadow-md">
            <div className="mx-4 lg:mx-8 grid grid-cols-12 py-2">
                {/* Logo */}
                <Link
                    to="/"
                    className="col-span-3 flex flex-wrap items-center justify-center">
                    <img src={logoAvatar} alt="Logo" className="h-14" />
                    {/* <div className="hidden sm:block ps-1 text-lg">
                        <span className="text-yellow-100 font-mulish">Realty</span>
                        <span className="text-yellow-100 font-mulish font-bold">
                            Savvy
                        </span>
                    </div> */}
                </Link>
                {/* Search Bar */}
                <div className="col-span-5 flex items-center justify-end">
                    <form className="bg-slate-100 rounded-lg p-2 w-1/2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none"
                        />
                    </form>
                </div>
                {/* Navbar Items */}
                <div className="col-span-4 flex justify-center items-center ">
                    <ul className="flex gap-3">
                        <Link to="/" className="hover:underline text-yellow-100">
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="hidden sm:inline hover:underline text-yellow-100">
                            About
                        </Link>
                        <Link
                            to="/signin"
                            className="hidden sm:inline hover:underline text-yellow-100">
                            Sign in
                        </Link>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
