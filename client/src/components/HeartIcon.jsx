import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    addLikedInternalListingThunk,
    removeLikedExternalListingThunk,
    addLikedExternalListingThunk,
    removeLikedInternalListingThunk,
} from '../services/user/user-thunk';
import { useNavigate } from 'react-router-dom';

function HeartIcon({ listingId, type }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { profile, loading } = useSelector((state) => state.user);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (profile._id) {
            const likedListings =
                type === 'internal'
                    ? profile.likedInternalListings
                    : profile.likedExternalListings;
            const listing = likedListings.find(
                (item) => item['propertyID'] === listingId
            );

            setIsLiked(listing ? listing.isLiked : false);
        } else {
            console.log('no profile id');
        }
    }, [profile, listingId, type]);

    const toggleHeart = async () => {
        if (loading) return;

        if (!profile || !profile._id) {
            // Redirect to sign-in page if user is not logged in
            navigate('/signin');
            return;
        }
        const userId = profile._id;
        const action = isLiked
            ? type === 'internal'
                ? removeLikedInternalListingThunk
                : removeLikedExternalListingThunk
            : type === 'internal'
            ? addLikedInternalListingThunk
            : addLikedExternalListingThunk;

        // Dispatch action and wait for it to finish
        dispatch(action({ userId: userId, propertyID: listingId }));

        // Update state based on action success
        setIsLiked(!isLiked);
    };

    if (!profile._id) {
        return null; // Render nothing or a loading indicator if profile is not loaded
    }

    return (
        <i
            className={isLiked ? 'fa fa-heart text-primary-200' : 'fa fa-heart-o'}
            aria-hidden="true"
            onClick={toggleHeart}></i>
    );
}

HeartIcon.propTypes = {
    listingId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['internal', 'external']).isRequired,
};

export default HeartIcon;
