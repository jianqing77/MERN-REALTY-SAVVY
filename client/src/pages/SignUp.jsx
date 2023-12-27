import React, { useState } from 'react';
import WelcomePic from '../assets/auth-2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUpThunk } from '../services/auth-thunk';
import GoogleAuth from '../components/googleAuth';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatchError, setPasswordMismatchError] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // track the form data change
    const usernameChangeHandler = (event) => {
        setUsername(event.target.value);
    };
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
        setPasswordMismatchError(false);
    };
    const confirmPasswordChangeHandler = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordMismatchError(false);
    };

    // sign up click handler
    const signUpClickHandler = async (event) => {
        event.preventDefault();
        // check if the password and confirm password are the same
        if (password !== confirmPassword) {
            setPasswordMismatchError(true);
            return;
        } else {
            setPasswordMismatchError(false);
        }
        try {
            await dispatch(signUpThunk({ username, email, password }));
            navigate('/signin');
        } catch (err) {
            alert(err);
        }
    };

    return (
        <section
            className="relative flex items-center justify-center"
            style={{
                height: '100vh', // ensures that the section is always as tall as the viewport
                backgroundImage: `url(${WelcomePic})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            <div className="absolute inset-0 bg-white bg-opacity-30"></div>
            <div className="relative w-full rounded-lg shadow md:mt-0 max-w-md bg-dark-100 dark:border-gray-700">
                {/* <ToastContainer position="top-center" autoClose={5000} /> */}
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="flex justify-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create Your Account
                    </h1>
                    <form
                        className="space-y-3 md:space-y-4"
                        onSubmit={signUpClickHandler}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="username"
                                onChange={usernameChangeHandler}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="name@email.com"
                                onChange={emailChangeHandler}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                                onChange={passwordChangeHandler}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-200 focus:border-primary-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none"
                                onChange={confirmPasswordChangeHandler}
                                required
                            />
                            {passwordMismatchError && (
                                <p className="mt-2 text-sm text-red-600">
                                    Passwords do not match.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-primary-200 hover:bg-yellow-500 hover:text-dark-100 focus:ring-4 focus:outline-none focus:ring-primary-200 focus:border-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Sign Up
                        </button>
                        <div className="flex justify-center">
                            <p className="text-sm font-light text-white">
                                Already have an account?
                                <Link
                                    to="/signin"
                                    className="font-medium text-white hover:underline ms-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
