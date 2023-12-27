import React from 'react';
import logoAvatar from '../assets/logo-rs-em.jpg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = () => {
    // console.log(useSelector((state) => state.auth.currentUser));
    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <nav className="sticky top-0 z-50 bg-primary-dark shadow-md">
            <div className="mx-4 lg:mx-8 grid grid-cols-12 py-2">
                {/* Logo */}
                <Link
                    to="/profile"
                    className="col-span-3 flex flex-wrap items-center justify-center">
                    <img src={logoAvatar} alt="Logo" className="h-14" />
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
                <div className="col-span-4 flex justify-center items-center">
                    <ul className="flex gap-3 items-center">
                        <li>
                            <Link to="/" className="hover:underline text-yellow-100">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="hidden sm:inline hover:underline text-yellow-100">
                                About
                            </Link>
                        </li>
                        {currentUser ? (
                            <li className="flex items-center">
                                <Link to="/profile" className="flex items-center">
                                    <img
                                        src={currentUser.avatar}
                                        alt="user avatar"
                                        className="rounded-full w-8 h-8 object-cover ms-2"
                                    />
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/signin"
                                    className="hidden sm:inline hover:underline text-yellow-100">
                                    Sign in
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
