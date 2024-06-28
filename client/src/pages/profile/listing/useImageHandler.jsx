import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import FirebaseApp from '../../../config/firebase';

export default function useImageHandler(initialImageUrls = []) {
    const [images, setImages] = useState(
        initialImageUrls.map((url) => ({
            url,
            status: 'success',
            isUploading: false,
            progress: 100,
            file: null, // Initially, there is no file object because these are preloaded URLs
        }))
    );

    const [fileCountError, setFileCountError] = useState('');

    const maxFileSize = 1024 * 1024 * 3; // 3MB
    const maxFileCount = 15;

    useEffect(() => {
        if (fileCountError) {
            const timer = setTimeout(() => {
                setFileCountError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fileCountError]);

    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.url && image.file) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, [images]);

    const fileChangeHandler = (event) => {
        const newFiles = Array.from(event.target.files);
        const totalFileCount = images.length + newFiles.length;

        if (totalFileCount > maxFileCount) {
            setFileCountError(`You can only upload up to ${maxFileCount} images.`);
            return;
        }

        const updatedImages = newFiles.map((file) => {
            if (
                file.size > maxFileSize ||
                (file.type !== 'image/jpeg' && file.type !== 'image/png')
            ) {
                setTimeout(() => clearErrorMessage(file), 3000);
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

        setImages((prev) => [...prev, ...updatedImages]);
    };

    const handleImageFileUpload = () => {
        const storage = getStorage(FirebaseApp);
        images.forEach((img, index) => {
            if (!img.file || img.status === 'success') {
                return;
            }

            const imgFile = img.file;
            const imgFileName = `${new Date().getTime()}_${imgFile.name}`;
            const storageRef = ref(storage, imgFileName);
            const uploadTask = uploadBytesResumable(storageRef, imgFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImages((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, progress, status: 'uploading' }
                                : item
                        )
                    );
                },
                (error) => {
                    setImages((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, status: 'error', message: 'Upload failed' }
                                : item
                        )
                    );
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImages((prev) =>
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
        const updatedImages = images.filter((_, idx) => idx !== index);
        setImages(updatedImages);
        if (images[index].url && images[index].file) {
            URL.revokeObjectURL(images[index].url);
        }
    };

    const clearErrorMessage = (file) => {
        setImages((currentImages) =>
            currentImages.map((image) => {
                if (image.file === file) {
                    return { ...image, message: '' };
                }
                return image;
            })
        );
    };

    return {
        images,
        fileCountError,
        maxFileCount,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
        clearErrorMessage,
    };
}
