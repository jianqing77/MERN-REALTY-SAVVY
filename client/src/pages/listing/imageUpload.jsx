// import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import FirebaseApp from '../config/firebase';

// function ImageUpload({ onImagesUpload }) {
//     const imageFileRef = useRef(null);
//     const [uploadProgress, setUploadProgress] = useState({});

//     const handleFileChange = (event) => {
//         const files = Array.from(event.target.files);
//         handleImageFileUpload(files);
//     };

//     const handleImageFileUpload = (imgFiles) => {
//         const storage = getStorage(FirebaseApp);
//         imgFiles.forEach((imgFile) => {
//             const imgFileName = `${new Date().getTime()}_${imgFile.name}`;
//             const storageRef = ref(storage, imgFileName);
//             const uploadTask = uploadBytesResumable(storageRef, imgFile);

//             uploadTask.on(
//                 'state_changed',
//                 (snapshot) => {
//                     const progress =
//                         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                     setUploadProgress((prevProgress) => ({
//                         ...prev,
//                         [imgFileName]: Math.round(progress),
//                     }));
//                 },
//                 (error) => {
//                     console.error('Upload error: ', error);
//                 },
//                 () => {
//                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                         onImagesUpload(downloadURL);
//                     });
//                 }
//             );
//         });
//     };

//     return (
//         <div className="text-center">
//             <input
//                 type="file"
//                 ref={imageFileRef}
//                 multiple
//                 accept="image/jpeg, image/png"
//                 onChange={handleFileChange}
//                 className="sr-only"
//             />
//             {/* Additional UI elements here */}
//         </div>
//     );
// }

// ImageUpload.propTypes = {
//     onImagesUpload: PropTypes.func.isRequired,
// };

// export default ImageUpload;
