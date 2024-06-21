import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import General from './general.jsx';
import Security from './Security.jsx';
import Favorites from './Favorites.jsx';
import Notifications from './Notifications.jsx';
import {
    FingerPrintIcon,
    Cog6ToothIcon,
    BellIcon,
    HeartIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';
import Listings from './listing/index.jsx';
import CreateNewListing from './listing/CreateNewListing.jsx';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const navigation = [
    { name: 'General', href: 'general', icon: Cog6ToothIcon },
    { name: 'Security', href: 'security', icon: FingerPrintIcon },
    { name: 'Favorites', href: 'favorites', icon: HeartIcon },
    { name: 'Listings', href: 'listings', icon: ListBulletIcon },
    { name: 'Notifications', href: 'notifications', icon: BellIcon },
];

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/profile') {
            navigate('/profile/general', { replace: true });
        }
    }, [navigate, location.pathname]);

    return (
        <div className="grid grid-cols-12 px-10">
            <div className="hidden lg:block lg:col-span-1">{/* nav sidebar */}</div>

            <div className="hidden lg:block lg:col-span-2">
                {/* nav sidebar */}
                <div className="flex flex-col py-16 gap-y-5 px-6 ring-1 ring-white/5">
                    <nav>
                        <ul role="list" className="space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            classNames(
                                                isActive
                                                    ? 'bg-dark-100 text-yellow-100'
                                                    : 'hover:bg-dark-100 hover:text-yellow-100',
                                                'group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold'
                                            )
                                        }>
                                        <item.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-8 ms-8 mt-2">
                {/* <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"> */}
                <Routes>
                    <Route index path="general" element={<General />} />
                    <Route path="security" element={<Security />} />
                    <Route path="favorites" element={<Favorites />} />
                    <Route path="notifications" element={<Notifications />} />
                    {/* listings and new listing routes as siblings, not  nested route */}
                    <Route path="listings" element={<Listings />} />
                    <Route path="listings/new" element={<CreateNewListing />} />
                    <Route path="*" element={<General />} />
                    {/* Fallback route: matches any URL path that hasn't been matched by preceding routes */}
                </Routes>
                {/* </div> */}
            </div>
        </div>
    );
}
