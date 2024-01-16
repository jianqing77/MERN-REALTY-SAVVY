import React, { Fragment, useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {
    FingerPrintIcon,
    Cog6ToothIcon,
    BellIcon,
    SignalIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import FirebaseApp from '../config/firebase';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const navigation = [
    { name: 'General', href: '#', icon: Cog6ToothIcon, current: true },
    { name: 'Security', href: '#', icon: FingerPrintIcon, current: false },
    { name: 'Notifications', href: '#', icon: BellIcon, current: false },
    { name: 'Listings', href: '#', icon: SignalIcon, current: false },
    { name: 'Favorites', href: '#', icon: SignalIcon, current: false },
];

export default function Profile() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    // Handle Profile Avatar Uploading
    const imageFileRef = useRef(null);
    const [imgFile, setImgFile] = useState(undefined); // track the image file chosen
    const [imgFilePercentage, setImgFilePercentage] = useState(0); // track the percentage of image file uploading
    const [imgFileError, setImgFileError] = useState(false); // track the percentage of image file uploading
    const [formData, setFormData] = useState({});
    // console.log(imgFile);
    // console.log(imgFilePercentage);
    // console.log(formData);
    // track the file chosen
    const fileChangeHandler = (event) => {
        setImgFile(event.target.files[0]); // select multiple but choose only the first one
    };

    useEffect(() => {
        if (imgFile) {
            handleImageFileUpload(imgFile);
        }
    }, [imgFile]);

    const handleImageFileUpload = (imgFile) => {
        const storage = getStorage(FirebaseApp);
        const imgFileName = new Date().getTime() + imgFile.name;
        const storageRef = ref(storage, imgFileName);
        const uploadTask = uploadBytesResumable(storageRef, imgFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImgFilePercentage(Math.round(progress));
            },
            (error) => {
                setImgFileError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };
    return (
        <div className="grid grid-cols-12 px-10">
            <div className="col-span-3">
                {/* nav sidebar */}
                <div className="fixed w-72 flex flex-col py-16 gap-y-5 px-6 ring-1 ring-white/5">
                    <nav>
                        <ul role="list" className="space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? ' bg-dark-100 text-yellow-100'
                                                : ' hover:bg-dark-100 hover:text-yellow-100',
                                            ' group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold'
                                        )}>
                                        <item.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="col-span-9">
                {/* personal information */}
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7">
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
                                    src={formData.avatar || currentUser.avatar}
                                    alt="user avatar"
                                    className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                                />
                                <div>
                                    <input
                                        type="file"
                                        ref={imageFileRef}
                                        hidden
                                        accept="image/*"
                                        onChange={fileChangeHandler}></input>
                                    <button
                                        onClick={() => imageFileRef.current.click()}
                                        type="button"
                                        className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-white bg-dark-100 hover:bg-dark-200 focus:ring-4 focus:outline-none focus:ring-primary-300">
                                        Change avatar
                                    </button>
                                    <p className="mt-2 text-xs self-center">
                                        {imgFileError ? (
                                            <span className="text-red-700">
                                                Error when uploading the image. Please try
                                                again later.
                                            </span>
                                        ) : imgFilePercentage > 0 &&
                                          imgFilePercentage < 100 ? (
                                            <span className="text-slate-700">
                                                Uploading: {imgFilePercentage}%
                                            </span>
                                        ) : imgFilePercentage === 100 ? (
                                            <span className="text-green-700">
                                                Successfully uploaded!
                                            </span>
                                        ) : null}
                                    </p>
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
                {/* change password */}
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
    );
}
