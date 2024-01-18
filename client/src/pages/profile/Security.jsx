import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPasswordThunk } from '../../services/user/user-thunk';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateUserInAuth } from '../../reducers/auth-reducer';

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

    // Handle form submission
    const saveSubmitHandler = async (e) => {
        e.preventDefault();

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
            alert(err);
        }
    };

    return (
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <header>
                <h2 className="text-base font-semibold leading-7 ">Change password</h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                    Update your password associated with your account.
                </p>
            </header>

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
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                value={currentPassword}
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
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
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
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                className="block w-full rounded-md border-gray-400 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:border-primary-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex">
                    <button
                        onClick={saveSubmitHandler}
                        className="rounded-md bg-dark-100 px-3 py-2 text-sm text-white font-semibold  shadow-sm hover:bg-dark-200  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
