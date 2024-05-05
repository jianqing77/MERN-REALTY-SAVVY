import React from 'react';
import logoAvatar from '../assets/logo-rs-em.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutThunk } from '../services/auth/auth-thunk';

const NavBar = () => {
    // console.log(useSelector((state) => state.auth.currentUser));
    const currentUser = useSelector((state) => state.auth.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate(); // useHistory hook to programmatically navigate

    const signOutClickHandler = () => {
        dispatch(signOutThunk())
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <nav className="sticky top-0 z-50 bg-dark-100 shadow-md">
            <div className="mx-4 lg:mx-8 grid grid-cols-12 py-2">
                {/* Logo */}
                <Link
                    to="/profile"
                    className="col-span-3 flex flex-wrap items-center justify-center">
                    <img src={logoAvatar} alt="Logo" className="h-14" />
                </Link>
                {/* Search Bar */}
                <div className="col-span-5 flex items-center justify-end"></div>
                {/* Navbar Items */}
                <div className="col-span-4 flex justify-center items-center">
                    <ul className="flex gap-3 items-center">
                        <li>
                            <Link
                                to="/"
                                className="hover:underline text-yellow-100 font-semibold">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="hidden sm:inline hover:underline text-yellow-100 font-semibold">
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
                                <button
                                    onClick={signOutClickHandler}
                                    className="ms-5 hidden sm:inline hover:underline text-yellow-100 font-semibold">
                                    Sign Out
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/signin"
                                    className="hidden sm:inline hover:underline text-yellow-100 font-semibold">
                                    Sign Up / Sign In
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
