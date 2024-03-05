import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPasswordThunk, deleteUserThunk } from '../../services/user/user-thunk';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateUserInAuth, deleteUserInAuth } from '../../reducers/auth-reducer';
import { useNavigate } from 'react-router-dom';

export default function Security() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [formData, setFormData] = useState({});
    const passwordChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle form submission
    const saveSubmitHandler = async (e) => {
        e.preventDefault();
        console.log('save submit handler is called');
        // Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('The new passwords do not match');
            return;
        }

        // Clear error message and proceed to submit the form
        setErrorMessage('');

        // send the data to the server with an HTTP request
        try {
            const resultAction = await dispatch(
                updateUserPasswordThunk({
                    userId: currentUser._id,
                    userUpdateData: formData,
                })
            );
            const user = unwrapResult(resultAction); // This will get the payload from the fulfilled action or throw an error if the promise is rejected
            dispatch(updateUserInAuth(user.user));
        } catch (err) {
            setErrorMessage(err.message || 'An unexpected error occurred.');
        }
    };

    const deleteAccountHandler = async () => {
        try {
            // Assuming deleteUserThunk expects the user's ID or some identifier
            const resultAction = await dispatch(
                deleteUserThunk({
                    userId: currentUser._id,
                })
            );
            if (deleteUserThunk.fulfilled.match(resultAction)) {
                // User deletion successful, clear the current user in auth state
                dispatch(deleteUserInAuth());
                // Redirect to sign-in page or any other route you see fit
                navigate('/signin');
            }
        } catch (error) {
            // Handle any errors if the deletion was unsuccessful
            console.error('Failed to delete the user:', error);
        }
    };
    return (
        <div>
            {/* change password */}
            <div className="grid max-w-9xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <header>
                    <h2 className="text-base font-semibold leading-7 ">
                        Change password
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        Update your password associated with your account.
                    </p>
                </header>
                <form className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        {/* current password */}
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
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    value={currentPassword}
                                    className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* new password */}
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
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* confirm password */}
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
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        {errorMessage && (
                            <div className="col-span-full">
                                <p className="text-sm text-red-600">{errorMessage}</p>
                            </div>
                        )}
                        <button
                            onClick={saveSubmitHandler}
                            className="mt-3 rounded-md bg-dark-100 px-3 py-2 text-sm text-white font-semibold  shadow-sm hover:bg-dark-200  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                            Save
                        </button>
                    </div>
                </form>
            </div>
            {/* delete account */}
            <div className="grid max-w-9xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <header>
                    <h2 className="text-base font-semibold leading-7 ">Delete Account</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        When you delete your account, your profile, listings and all the
                        other information will be permanently removed.
                    </p>
                </header>
                <div className="col-span-2 ">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <div className="col-span-full">
                            <div
                                className=" border-t-4 border-dark-100 rounded-b text-gray-700 px-4 py-3 shadow-md"
                                role="alert">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg
                                            className="fill-current h-6 w-6 text-dark-100 mr-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path d="M10 20a10 10 0 100-20 10 10 0 000 20zM11 4h-1v7h1V4zm0 8h-1v2h1v-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">Warning</p>
                                        <p className="text-sm">
                                            I acknowledge that by deleting my account, all
                                            of my data will be permanently removed. This
                                            includes my profile information, posts, and
                                            any other associated data. Once my account is
                                            deleted, this process cannot be undone and I
                                            will not be able to recover any of my data or
                                            access the services with this account again.{' '}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={deleteAccountHandler}
                                    className="mt-9 rounded-md bg-dark-100 px-5 py-2 text-sm text-white font-semibold shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    DELETE ACCOUNT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
