import React from 'react';
import WelcomePic from '../assets/auth-2.jpg';
import GoogleAvatar from '../assets/google.svg.png';

import { Link } from 'react-router-dom';

export default function SignIn() {
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
            <div className="relative w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-primary-dark dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="flex justify-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Welcome to RealtySavvy!
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">
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
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-primary-200 hover:bg-yellow-500 hover:text-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Sign In
                        </button>
                        <div className="flex items-center">
                            <div className="flex-grow h-px bg-gray-400"></div>
                            <span className="mx-4 text-white">or</span>
                            <div className="flex-grow h-px bg-gray-400"></div>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white  bg-gray-800 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            <span className="flex items-center justify-center">
                                <img
                                    src={GoogleAvatar}
                                    alt="google image"
                                    className="w-7 h-7 mx-3"
                                />
                                Sign In with Google
                            </span>
                        </button>

                        <div className="flex justify-center">
                            <p className="text-sm font-light text-white">
                                Not have an account yet?
                                <Link
                                    to="/signup"
                                    className="font-medium text-white hover:underline ms-1">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
