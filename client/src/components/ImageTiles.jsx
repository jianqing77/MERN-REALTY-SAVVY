import React, { useEffect, useState } from 'react';
import pic1 from '../assets/auth-4.png';
import pic2 from '../assets/auth-3.png';
import pic3 from '../assets/auth-5.png';
import logoAvatar from '../assets/logo-rs-3.jpg';

const collections = [
    {
        name: 'Rent a Home',
        href: '#',
        imageSrc: pic3,
        description:
            'Experience hassle-free renting with our comprehensive online platform that streamlines everything from browsing listings to application and payment processes',
        btnText: 'Find rentals',
        imageAlt: 'Rental Hint Image',
    },
    {
        name: 'Buy a Home',
        href: '#',
        imageSrc: pic2,
        description:
            'Discover your dream home with our exclusive listings and immersive photo tours that showcase unique properties not available anywhere else',
        btnText: 'Browse homes',
        imageAlt: 'Buy Hint Image',
    },
    {
        name: 'List a Home',
        href: '#',
        imageSrc: pic1,
        description:
            'Simplify the process of listing your property with our expert guidance and personalized services that ensure a smooth and successful transaction',
        btnText: 'Add your own',
        imageAlt: 'List own property Hint Image',
    },
];

export default function ImageTiles() {
    return (
        <div className="relative">
            {/* Background image and overlap */}
            <div
                aria-hidden="true"
                className="absolute inset-0 hidden sm:flex sm:flex-col bg-primary-500">
                <div className="relative w-full flex-1">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* <img
                            src="https://tailwindui.com/img/ecommerce-images/home-page-04-hero-full-width.jpg"
                            alt=""
                            className="h-full w-full object-cover object-center"
                        /> */}
                    </div>
                    <div className="absolute inset-0 bg-primary-500 opacity-50" />
                </div>
                <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">
                {/* Background image and overlap */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col sm:hidden">
                    <div className="relative w-full flex-1 bg-gray-800">
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src="https://tailwindui.com/img/ecommerce-images/home-page-04-hero-full-width.jpg"
                                alt=""
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gray-900 opacity-50" />
                    </div>
                    <div className="h-48 w-full bg-white" />
                </div>
                <div className="relative py-32">
                    <div className="flex items-center justify-center">
                        <img src={logoAvatar} alt="Logo" className="h-20 mb-10" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        Expertise Meets Innovation
                    </h1>
                    <h1 className="my-4 text-4xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        II
                    </h1>
                    <h1 className="text-4xl font-bold tracking-tight text-dark-100 sm:text-3xl md:text-4xl">
                        Your Perfect New Home
                    </h1>
                </div>
            </div>

            <section
                aria-labelledby="collection-heading"
                className="relative -mt-96 sm:mt-0">
                <div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8 pb-20">
                    {collections.map((collection) => (
                        <div
                            key={collection.name}
                            className="group relative h-96 rounded-lg bg-dark-100 shadow-xl sm:aspect-h-5 sm:aspect-w-4 sm:h-auto">
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
                                        <div className="mt-1 flex justify-center items-center text-2xl font-bold text-primary-500">
                                            <a href={collection.href}>
                                                <span className="" />
                                                {collection.name}
                                            </a>
                                        </div>

                                        <div className="mt-1 p-4 flex flex-col justify-center items-center text-base text-primary-500 text-center">
                                            <a href={collection.href}>
                                                {collection.description}
                                            </a>
                                        </div>
                                        <div className="mt-2 sm:mt-3 flex justify-center items-center">
                                            <a
                                                href={collection.href}
                                                className="my-4 rounded-md bg-dark-200 py-3 px-10 font-medium text-yellow-100 hover:bg-primary-500 hover:text-dark-100">
                                                {collection.btnText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="relative rounded-lg overflow-hidden">
                                <div className="overflow-hidden">
                                    <img
                                        src={collection.imageSrc}
                                        alt={collection.imageAlt}
                                        className="w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-110 group-hover:opacity-70"
                                    />
                                </div>

                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black opacity-50" />

                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-primary-500">
                                        <a href={collection.href}>{collection.name}</a>
                                    </div>
                                    <div className="mt-1 text-base text-primary-500">
                                        <a href={collection.href}>
                                            {collection.description}
                                        </a>
                                    </div>
                                    <div className="mt-2 sm:mt-3">
                                        <a
                                            href={collection.href}
                                            className="my-4 rounded-md bg-dark-200 py-3 px-10 font-medium text-yellow-100 hover:bg-primary-500 hover:text-dark-100">
                                            {collection.btnText}
                                        </a>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div>
                                <div
                                    aria-hidden="true"
                                    className="relative overflow-hidden rounded-lg">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={collection.imageSrc}
                                            alt={collection.imageAlt}
                                            className="h-full w-full object-cover object-center transition-transform duration-300 transform group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black transition-opacity duration-300 opacity-50 group-hover:opacity-70" />
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                    <div>
                                        <div className="mt-1 flex justify-center items-center text-2xl font-bold text-primary-500">
                                            <a href={collection.href}>
                                                {collection.name}
                                            </a>
                                        </div>

                                        <div className="mt-1 p-4 flex flex-col justify-center items-center text-base text-primary-500 text-center">
                                            <a href={collection.href}>
                                                {collection.description}
                                            </a>
                                        </div>

                                        <div className="mt-2 sm:mt-3 flex justify-center items-center">
                                            <a
                                                href={collection.href}
                                                className="my-4 rounded-md bg-dark-200 py-3 px-10 font-medium text-yellow-100 hover:bg-primary-500 hover:text-dark-100">
                                                {collection.btnText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
