import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FirebaseApp from '../../config/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function GeneralSettings() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [userName, setUserName] = useState(currentUser.userName);
    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.firstName);
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber);

    const userNameChangeHandler = (event) => {
        const newUserName = event.target.value;
        setUserName(newUserName);
    };

    const firstNameChangeHandler = (event) => {
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
    };

    const lastNameChangeHandler = (event) => {
        const newLastName = event.target.value;
        setLastName(newLastName);
    };

    const phoneNumberChangeHandler = (event) => {
        const newPhoneNumber = event.target.value;
        setLastName(newPhoneNumber);
    };

    // Handle Profile Avatar Uploading
    const imageFileRef = useRef(null);
    const [imgFile, setImgFile] = useState(undefined); // track the image file chosen
    const [imgFilePercentage, setImgFilePercentage] = useState(0); // track the percentage of image file uploading
    const [imgFileError, setImgFileError] = useState(false); // track the percentage of image file uploading
    const [formData, setFormData] = useState({});

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
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <header>
                <h2 className="text-base font-semibold leading-7">
                    Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                    Use a permanent address where you can receive mail.
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
                                className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-white bg-dark-100 hover:bg-dark-200 focus:ring-4 focus:outline-none focus:ring-primary-300">
                                Change avatar
                            </button>
                            <p className="mt-2 text-xs self-center">
                                {imgFileError ? (
                                    <span className="text-red-700">
                                        Error when uploading the image. Please try again
                                        later.
                                    </span>
                                ) : imgFilePercentage > 0 && imgFilePercentage < 100 ? (
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
                                />
                            </div>
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
                                    className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-200 sm:text-sm">
                                    <option>US</option>
                                    <option>CA</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                name="phone-number"
                                id="phone-number"
                                className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                defaultValue={currentUser.phoneNumber}
                            />
                        </div>
                    </div>
                    {/* first name */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="first-name"
                            className="block text-sm font-medium leading-6 ">
                            First Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                defaultValue={currentUser.firstName}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {/* last name */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="last-name"
                            className="block text-sm font-medium leading-6 ">
                            Last Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                defaultValue={currentUser.lastName}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
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
    );
}
