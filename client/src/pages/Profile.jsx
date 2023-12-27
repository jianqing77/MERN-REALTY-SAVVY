import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import {
    ChartBarSquareIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const navigation = [
    { name: 'Personal Information', href: '#', icon: FolderIcon, current: false },
    { name: 'Account Security', href: '#', icon: ServerIcon, current: false },
    { name: 'My Favorites', href: '#', icon: SignalIcon, current: false },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
];

export default function Profile() {
    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <div>
            <div className="divide-y divide-white/5 grid grid-cols-12">
                <div className="col-span-3"></div>
                <div className="col-span-9">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base font-semibold leading-7 ">
                                Personal Information
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                Use a permanent address where you can receive mail.
                            </p>
                        </div>

                        <form className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full flex items-center gap-x-8">
                                    <img
                                        src={currentUser.avatar}
                                        alt=""
                                        className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                                    />
                                    <div>
                                        <button
                                            type="button"
                                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-white bg-dark-100 hover:bg-dark-200 focus:ring-4 focus:outline-none focus:ring-primary-300">
                                            Change avatar
                                        </button>
                                        <p className="mt-2 text-xs leading-5 text-gray-400">
                                            JPG, GIF or PNG. 1MB max.
                                        </p>
                                    </div>
                                </div>
                                {/* username */}
                                <div className="col-span-full">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium leading-6 ">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-primary-200 focus:border-primary-200">
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                autoComplete="username"
                                                className="block w-full rounded-md border-gray-400 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                                placeholder={currentUser.username}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* email address */}
                                <div className="col-span-full">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 ">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder={currentUser.email}
                                            className="block w-full rounded-md border-gray-400 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6 outline-none"
                                        />
                                    </div>
                                </div>
                                {/* first name */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="first-name"
                                        className="block text-sm font-medium leading-6 ">
                                        First name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                {/* last name */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="last-name"
                                        className="block text-sm font-medium leading-6 ">
                                        Last name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex">
                                <button
                                    type="submit"
                                    className="rounded-md bg-dark-100 px-3 py-2 text-sm text-white font-semibold shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base font-semibold leading-7 ">
                                Change password
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                Update your password associated with your account.
                            </p>
                        </div>

                        <form className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label
                                        htmlFor="current-password"
                                        className="block text-sm font-medium leading-6 ">
                                        Current password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="current-password"
                                            name="current_password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label
                                        htmlFor="new-password"
                                        className="block text-sm font-medium leading-6 ">
                                        New password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="new-password"
                                            name="new_password"
                                            type="password"
                                            autoComplete="new-password"
                                            className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label
                                        htmlFor="confirm-password"
                                        className="block text-sm font-medium leading-6 ">
                                        Confirm password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirm-password"
                                            name="confirm_password"
                                            type="password"
                                            autoComplete="new-password"
                                            className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex">
                                <button
                                    type="submit"
                                    className="rounded-md bg-dark-100 px-3 py-2 text-sm text-white font-semibold  shadow-sm hover:bg-dark-200  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
