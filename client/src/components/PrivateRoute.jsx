import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router';

export default function PrivateRoute() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    console.log('currentUser: ' + currentUser);
    return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}
