import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

function ConfirmDialog({ open, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4">Are you sure you want to delete this listing?</p>
                <div className="rounded-md bg-yellow-50 p-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon
                                className="h-5 w-5 text-yellow-400"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Warning
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>This action cannot be undone.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
                        onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                        onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
