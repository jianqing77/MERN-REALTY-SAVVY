import { useRef } from 'react';
import useImageHandler from './useImageHandler';
import PropTypes from 'prop-types';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function EditImage({ imageUrls, onImageSave }) {
    // Image Handling
    const imageFileRef = useRef(null);
    const {
        imagePreviews,
        fileCountError,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
    } = useImageHandler(imageUrls);

    const addImageHandler = () => {
        imageFileRef.current.click(); // Trigger the file input
    };

    const saveImages = () => {
        handleImageFileUpload(imagePreviews.filter((p) => p.isUploading)); // Upload only images that are in the uploading state
        onImageSave(imagePreviews); // Invoke the external save handler
    };

    return (
        <div className="grid grid-cols-3">
            <div className="col-span-1">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Current Listing Images
                </h2>
            </div>
            <div className="flex flex-col items-left justify-start gap-y-4 col-span-2 ms-2">
                <div className="flex overflow-x-auto py-2 max-w-md min-w-full">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative mr-4 flex-shrink-0">
                            <img
                                src={preview.url}
                                className="block w-20 h-20 object-cover rounded-lg"
                                alt={`Image ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeImageHandler(index)}
                                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-lg"
                                aria-label="Delete image">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                {/* section below: upload new images */}
                <div className="flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-4">
                    <div className="text-center w-full">
                        <PhotoIcon
                            className="mx-auto h-6 w-6 text-gray-300"
                            aria-hidden="true"
                        />
                        <div className="mt-3 flex justify-center items-center text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-200 focus-within:outline-none  hover:text-indigo-500 inline-block w-full text-center">
                                <span>Add Image Files</span>
                                <input
                                    id="file-upload"
                                    ref={imageFileRef}
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    multiple
                                    onChange={fileChangeHandler}
                                />
                            </label>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, JPEG up to 3MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

EditImage.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    onImageSave: PropTypes.func.isRequired,
};

{
    /* <div>
                    <input
                        type="file"
                        onChange={fileChangeHandler}
                        multiple
                        className="hidden"
                        ref={imageFileRef}
                        id="file-upload"
                        accept="image/*"
                    />
                    <div className="flex items-center justify-end gap-x-6">
                        <PlusCircleIcon
                            className="mr-3 h-7 w-7 text-dark-200 "
                            aria-hidden="true"
                            onClick={addImageHandler}
                        />
                        <button
                            type="button"
                            onClick={saveImages}
                            className="rounded-md bg-dark-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                            Save
                        </button>
                    </div>
                </div> */
}
