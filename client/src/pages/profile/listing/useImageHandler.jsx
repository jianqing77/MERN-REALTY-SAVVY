import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import FirebaseApp from '../../../config/firebase';

export default function useImageHandler() {
    const [imgFiles, setImgFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileCountError, setFileCountError] = useState('');

    const maxFileSize = 1024 * 1024 * 3; // 3MB
    const maxFileCount = 15;

    // Check the file count to less than the max file number
    useEffect(() => {
        if (fileCountError) {
            const timer = setTimeout(() => {
                setFileCountError('');
            }, 3000); // Clear the error message after 3 seconds

            return () => clearTimeout(timer); // Clear the timer if the component unmounts or the error changes
        }
    }, [fileCountError]);

    // Cleanup function to revoke URLs when imagePreviews change or component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);

    const fileChangeHandler = (event) => {
        const newFiles = Array.from(event.target.files);
        const totalFileCount = imgFiles.length + newFiles.length;

        if (totalFileCount > maxFileCount) {
            setFileCountError(`You can only upload up to ${maxFileCount} images.`);
            return; // Prevent further execution if the limit is exceeded
        } else {
            setFileCountError(''); // Clear error message if under limit
        }

        const updatedPreviews = newFiles.map((file) => {
            if (
                file.size > maxFileSize ||
                (file.type !== 'image/jpeg' && file.type !== 'image/png')
            ) {
                setTimeout(() => {
                    clearErrorMessage(file);
                }, 3000); // Clear the error message after 3 seconds

                return {
                    file,
                    status: 'error',
                    message: `${file.name} has invalid format or size`,
                };
            } else {
                return {
                    url: URL.createObjectURL(file),
                    file,
                    status: 'pending',
                    progress: 0,
                    isUploading: false,
                };
            }
        });
        // Update state with the new files, adding to the existing files
        setImagePreviews((prev) => [...prev, ...updatedPreviews]);
        setImgFiles((prevFiles) => [...prevFiles, ...newFiles.map((f) => f.file)]);
    };

    const handleImageFileUpload = (imgFiles) => {
        const storage = getStorage(FirebaseApp);
        // console.log('image files:', imgFiles); // Log without JSON.stringify for better clarity
        imgFiles.forEach((imgFileObj, index) => {
            if (!imgFileObj.file) {
                return; // Skip this iteration if no file object is present
            }
            // updateFileUploadStatus(imgFileObj.file, true); // Set isUploading to true
            const imgFile = imgFileObj.file; // Access the actual file object
            const imgFileName = `${new Date().getTime()}_${imgFile.name}`;

            const storageRef = ref(storage, imgFileName);
            const uploadTask = uploadBytesResumable(storageRef, imgFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // Update progress in the state for each file
                    setImagePreviews((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, progress, status: 'uploading' }
                                : item
                        )
                    );
                },
                (error) => {
                    setImagePreviews((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, status: 'error', message: 'Upload failed' }
                                : item
                        )
                    );
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // Update success status and add URL in the state for each file
                        setImagePreviews((prev) =>
                            prev.map((item, idx) =>
                                idx === index
                                    ? {
                                          ...item,
                                          status: 'success',
                                          message: 'Upload successful',
                                          url: downloadURL,
                                      }
                                    : item
                            )
                        );
                    });
                }
            );
        });
    };

    const removeImageHandler = (index) => {
        const filteredPreviews = imagePreviews.filter((_, idx) => idx !== index);
        setImagePreviews(filteredPreviews);
        const filteredFiles = imgFiles.filter((_, idx) => idx !== index);
        setImgFiles(filteredFiles);

        URL.revokeObjectURL(imagePreviews[index].url); // Clean up the URL to prevent memory leaks
    };

    // Handler image error message time out
    const clearErrorMessage = (file) => {
        setImagePreviews((currentPreviews) =>
            currentPreviews.map((preview) => {
                if (preview.file === file) {
                    return { ...preview, message: '' }; // Clear the message
                }
                return preview;
            })
        );
    };

    return {
        imgFiles,
        imagePreviews,
        fileCountError,
        maxFileCount,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
        clearErrorMessage,
    };
}
