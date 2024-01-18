import React from 'react';
import PropTypes from 'prop-types';
import GoogleAvatar from '../assets/google.svg.png';
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import FirebaseApp from '../config/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authGoogleThunk } from '../services/auth/auth-thunk';

const GoogleAuth = ({ onGoogleAuth }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const googleClickHandler = async () => {
        onGoogleAuth();
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(FirebaseApp);
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result); // This gives you a Google Access Token. You can use it to access the Google API.
            const token = credential.accessToken; // The signed-in user info.
            const user = result.user;
            const userData = {
                userName: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                token: token,
            };
            await dispatch(authGoogleThunk(userData));
            navigate('/profile');
        } catch (err) {
            console.log('Error when using google: ' + err.message);
        }
    };

    return (
        <button
            type="submit"
            onClick={googleClickHandler}
            className="w-full text-white  bg-gray-800 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            <span className="flex items-center justify-center">
                <img src={GoogleAvatar} alt="google image" className="w-7 h-7 mx-3" />
                Continue with Google
            </span>
        </button>
    );
};

GoogleAuth.propTypes = {
    onGoogleAuth: PropTypes.func.isRequired,
};

export default GoogleAuth;
