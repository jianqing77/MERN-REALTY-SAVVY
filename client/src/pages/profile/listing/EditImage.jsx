import { useRef } from 'react';
import useImageHandler from './useImageHandler';
import PropTypes from 'prop-types';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

export default function EditImage({ imageUrls, onImageSave, onImageCancel }) {
    // Image Handling
    const imageFileRef = useRef(null);
    const {
        imagePreviews,
        fileCountError,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
    } = useImageHandler();

    const addImageHandler = () => {};

    return (
        <div className="flex flex-col items-center justify-start gap-y-4">
            <div className="flex overflow-x-auto py-2">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative mr-4">
                        <img
                            src={url}
                            className="block w-32 h-32 object-cover rounded-lg"
                            alt={`Image ${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => removeImageHandler(index)}
                            className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                            aria-label="Delete image">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <input
                    type="file"
                    onChange={fileChangeHandler}
                    multiple
                    className="hidden"
                    id="file-upload"
                    accept="image/png, image/jpeg"
                />
                <PlusCircleIcon
                    className="mr-3 h-7 w-7 text-dark-200 "
                    aria-hidden="true"
                    onClick={addImageHandler}
                />

                <button
                    type="button"
                    onClick={onImageCancel}
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onImageSave}
                    className="rounded-md bg-dark-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                    Save
                </button>
            </div>
        </div>
    );
}

EditImage.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    onImageSave: PropTypes.func.isRequired,
    onImageCancel: PropTypes.func.isRequired,
};
