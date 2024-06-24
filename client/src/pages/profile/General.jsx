import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FirebaseApp from '../../config/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { updateUserGeneralThunk } from '../../services/user/user-thunk';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateUserInAuth } from '../../reducers/auth-reducer';

export default function GeneralSettings() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [formData, setFormData] = useState({});
    // Handle Profile Avatar Uploading
    const imageFileRef = useRef(null);
    const [imgFile, setImgFile] = useState(undefined); // track the image file chosen
    const [imgFilePercentage, setImgFilePercentage] = useState(0); // track the percentage of image file uploading
    const [imgFileError, setImgFileError] = useState(false);

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

    // track other information changed
    const generalInfoChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const dispatch = useDispatch(); // to dispatch thunks

    const saveClickHandler = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(
                updateUserGeneralThunk({
                    userId: currentUser._id,
                    userUpdateData: formData,
                })
            );
            const user = unwrapResult(resultAction); // unwrapResult will get the payload from the fulfilled action or throw an error if the promise is rejected
            dispatch(updateUserInAuth(user.user));
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div>
            {/* public information */}
            <div className="grid max-w-9xl grid-cols-1 gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 md:grid-cols-3 lg:px-8">
                <header>
                    <h2 className="text-base font-semibold leading-7">Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        This information will be displayed publicly so be careful what you
                        share.
                    </p>
                </header>
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
                                    className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-white bg-dark-100 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300">
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
                                htmlFor="userName"
                                className="block text-sm font-medium leading-6 ">
                                Username
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-primary-200 focus:border-primary-200">
                                    <input
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        autoComplete="userName"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                        defaultValue={currentUser.userName}
                                        onChange={generalInfoChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* email address */}
                        <div className="col-span-full">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 ">
                                Email
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-primary-200 focus:border-primary-200">
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                        defaultValue={currentUser.email}
                                        onChange={generalInfoChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {/* personal information */}
            <div className="grid max-w-9xl grid-cols-1 gap-x-8 gap-y-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <header>
                    <h2 className="text-base font-semibold leading-7 ">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        Use a permanent address where you can receive mail.
                    </p>
                </header>
                <form className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        {/* first name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium leading-6 ">
                                First Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                    defaultValue={currentUser.firstName}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        {/* last name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium leading-6 ">
                                Last Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    name="lastName"
                                    id="lastName"
                                    autoComplete="family-name"
                                    defaultValue={currentUser.lastName}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        {/* phone number */}
                        <div className="col-span-full">
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium leading-6 ">
                                Phone Number
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <label htmlFor="country" className="sr-only">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary-200 sm:text-sm">
                                        <option>US</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    defaultValue={currentUser.phoneNumber}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-primary-200 sm:max-w-xs sm:text-sm sm:leading-6"
                                    name="city"
                                    id="city"
                                    defaultValue={currentUser.city}
                                    autoComplete="address-level2"
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="region"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-primary-200 sm:max-w-xs sm:text-sm sm:leading-6"
                                    name="region"
                                    id="region"
                                    autoComplete="address-level1"
                                    defaultValue={currentUser.region}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="streetAddress"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-primary-200 sm:max-w-xs sm:text-sm sm:leading-6"
                                    name="streetAddress"
                                    id="streetAddress"
                                    autoComplete="street-address"
                                    defaultValue={currentUser.streetAddress}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="postalCode"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                ZIP / Postal code
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-primary-200 sm:max-w-xs sm:text-sm sm:leading-6"
                                    name="postalCode"
                                    id="postalCode"
                                    autoComplete="postal-code"
                                    defaultValue={currentUser.postalCode}
                                    onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex">
                        <button
                            onClick={saveClickHandler}
                            className="rounded-md bg-dark-100 px-3 py-2 text-sm text-white font-semibold shadow-sm hover:bg-primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
