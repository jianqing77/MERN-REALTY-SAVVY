import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EditListing from './EditListing';
import ShowListing from './ShowListing';
import { useDispatch, useSelector } from 'react-redux';
import {
    findListingByIdThunk,
    updateListingThunk,
} from '../../../services/internal-listing/internal-listing-thunk';
import { unwrapResult } from '@reduxjs/toolkit';

export default function ListingDetailsPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const saveBtnHandler = async (formData) => {
        console.log('formData passed to saveBtnHandler: ' + JSON.stringify(formData));
        try {
            const resultAction = await dispatch(
                updateListingThunk({
                    tarId: listingId,
                    updatedData: formData,
                })
            );
            const updateResult = unwrapResult(resultAction); // Handle the fulfilled action or throw an error
            console.log('Update successful', updateResult);
            setIsEditing(false); // Close the editor after saving
        } catch (error) {
            console.error('Failed to update listing:', error);
            alert(error.message || 'Failed to update listing');
        }
    };

    const cancelBtnHandler = () => {
        setIsEditing(false);
    };

    const editBtnHandler = () => {
        setIsEditing(true);
    };
    return (
        <div>
            {isEditing ? (
                <EditListing
                    listingId={listingId}
                    onSave={saveBtnHandler}
                    onCancel={cancelBtnHandler}
                />
            ) : (
                <ShowListing listingId={listingId} onEdit={editBtnHandler} />
            )}
        </div>
    );
}
