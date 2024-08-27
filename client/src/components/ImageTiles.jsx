import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import pic1 from '../assets/auth-4.png';
import pic2 from '../assets/auth-3.png';
import pic3 from '../assets/auth-5.png';
import logoAvatar from '../assets/logo-rs-3.jpg';
import { Link } from 'react-router-dom';

const collections = [
    {
        name: 'Rent a Home',
        href: '/results',
        imageSrc: pic3,
        description:
            'Experience hassle-free renting with our comprehensive online platform that streamlines everything from browsing listings to application',
        btnText: 'Find rentals',
        imageAlt: 'Rental Hint Image',
        category: 'for-rent',
    },
    {
        name: 'Buy a Home',
        href: '/results',
        imageSrc: pic2,
        description:
            'Discover your dream home with our exclusive listings and immersive photo tours that showcase unique properties not available anywhere else',
        btnText: 'Browse homes',
        imageAlt: 'Buy Hint Image',
        category: 'for-sale',
    },
    {
        name: 'List a Home',
        href: '/profile/listings/new',
        imageSrc: pic1,
        description:
            'Simplify the process of listing your property with our expert guidance and personalized services that ensure a smooth and successful transaction',
        btnText: 'Add your own',
        imageAlt: 'List own property Hint Image',
        category: 'listings',
    },
];

export default function ImageTiles({ onCategoryChange, scrollToTopOfHome }) {
    return (
        <div className="relative">
            {/* Background image and overlap */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col bg-primary-500">
                <div className="relative w-full flex-1">
                    <div className="absolute inset-0 overflow-hidden"></div>
                    <div className="absolute inset-0 bg-primary-500 opacity-50" />
                </div>
                <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">
                <div className="relative py-32">
                    <div className="flex items-center justify-center">
                        <img src={logoAvatar} alt="Logo" className="h-20 mb-10" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        Expertise Meets Innovation
                    </h1>
                    <h1 className="my-4 text-2xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        II
                    </h1>
                    <h1 className="text-2xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        Your Perfect New Home
                    </h1>
                </div>
            </div>

            <section
                aria-labelledby="collection-heading"
                className="relative -mt-96 sm:mt-0">
                <div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 md:max-w-7xl md:grid-cols-3 md:gap-x-6 md:gap-y-0 md:px-6 lg:gap-x-8 lg:px-8 pb-20">
                    {collections.map((collection) => (
                        <div
                            key={collection.name}
                            className="group relative h-96 rounded-lg bg-dark-100 shadow-xl md:aspect-h-5 md:aspect-w-4 md:h-auto">
                            <div>
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 overflow-hidden rounded-lg">
                                    <div className="absolute inset-0 overflow-hidden group-hover:opacity-70 transition-transform duration-300 transform group-hover:scale-110">
                                        <img
                                            src={collection.imageSrc}
                                            alt={collection.imageAlt}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-dark-100 transition-opacity duration-300 group:opacity-60 group-hover:opacity-70" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                    <div>
                                        <div className="mt-1 flex justify-center items-center text-xl lg:text-2xl font-bold text-primary-500">
                                            {collection.name}
                                        </div>

                                        <div className="mt-1 p-4 flex flex-col justify-center items-center text-sm lg:text-base text-primary-500 text-center">
                                            {collection.description}
                                        </div>
                                        <div className="mt-2 sm:mt-3 flex justify-center items-center">
                                            <div className="mt-2 sm:mt-3 flex justify-center items-center">
                                                {collection.category === 'listings' ? (
                                                    <Link
                                                        to={collection.href}
                                                        className="lg:my-4 rounded-md bg-dark-200 py-3 px-10 font-medium text-yellow-100 hover:bg-primary-500 hover:text-dark-100">
                                                        {collection.btnText}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            onCategoryChange({
                                                                target: {
                                                                    value: collection.category,
                                                                },
                                                            });
                                                            scrollToTopOfHome();
                                                        }}
                                                        className="lg:my-4 rounded-md bg-dark-200 py-3 px-10 font-medium text-yellow-100 hover:bg-primary-500 hover:text-dark-100">
                                                        {collection.btnText}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

ImageTiles.propTypes = {
    onCategoryChange: PropTypes.func.isRequired,
    scrollToTopOfHome: PropTypes.func,
};
