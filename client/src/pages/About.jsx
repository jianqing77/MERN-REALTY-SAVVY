import React from 'react';
import pic3 from '../assets/auth-3.png';
import pic1 from '../assets/auth-1.jpg';
import pic2 from '../assets/auth-2.jpg';
import pic4 from '../assets/auth-4.png';
import pic5 from '../assets/auth-5.png';

export default function About() {
    return (
        <div>
            {/* Upper Section */}
            <div className="relative isolate overflow-hidden bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="flex flex-col justify-center lg:col-start-3 lg:col-span-4 px-10 text-dark-100">
                        <div className="text-sm font-medium mb-2 text-center lg:text-left">
                            Overview
                        </div>
                        <h1 className="text-2xl font-bold mt-0 mb-6 text-center lg:text-left">
                            About us
                        </h1>
                        <p className="text-lg">
                            Realty Savvy is your premier online destination for creating,
                            discovering, and sharing real estate listings across the
                            United States.
                        </p>
                    </div>
                    <div className="lg:col-start-7 lg:col-span-4 px-10 mt-6 lg:mt-0">
                        <img
                            className="block mx-auto lg:mx-0 shadow-2xl w-full rounded-lg"
                            alt="Affectionate young family interacting with each other on living room sofa."
                            src={pic3}
                        />
                    </div>
                </div>
                {/* Lower Sections */}
                <div className="mt-12">
                    <div className="mt-32 grid grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-start-3 lg:col-span-3">
                            <img
                                className="hidden lg:block mx-auto w-1/2 lg:mx-0 shadow-2xl lg:w-full rounded-lg"
                                alt="Affectionate young family interacting with each other on living room sofa."
                                src={pic1}
                            />
                        </div>
                        <div className="flex flex-col justify-center lg:col-start-7 lg:col-span-4 text-center lg:text-left px-10">
                            <h2 className="text-2xl font-bold mt-0 mb-6 text-center lg:text-left">
                                Our Mission
                            </h2>
                            <p className="mt-10 text-lg">
                                Our mission at Realty Savvy is to transform the real
                                estate market by making it more accessible, transparent,
                                and efficient for everyone involved. Whether you are a
                                buyer, seller, real estate agent, or just a curious
                                browser, our platform is designed to cater to your needs.
                                We strive to deliver a seamless experience that not only
                                meets but exceeds your expectations.
                            </p>
                        </div>
                    </div>
                    <div className="mt-32 grid  grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-start-3 lg:col-span-3">
                            <img
                                className="hidden lg:block mx-auto w-1/2 lg:mx-0 shadow-2xl lg:w-full rounded-lg"
                                alt=""
                                src={pic5}
                            />
                        </div>
                        <div className="flex flex-col justify-center lg:col-start-7 lg:col-span-4 text-center lg:text-left px-10">
                            <h2 className="text-2xl font-bold mt-0 mb-6 text-center lg:text-left">
                                Our Vision
                            </h2>
                            <p className="mt-10 text-lg">
                                At Realty Savvy, we envision a world where the right
                                property is just a click away. We are dedicated to
                                continuous innovation and improvement, aiming to set new
                                standards in the real estate industry. Our goal is to
                                expand our services nationwide, providing comprehensive
                                support and tools that help users make informed decisions.
                            </p>
                        </div>
                    </div>
                    <div className="mt-32 grid grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-start-3 lg:col-span-3">
                            <img
                                className="hidden lg:block mx-auto w-1/2 lg:mx-0 shadow-2xl lg:w-full rounded-lg"
                                alt="Affectionate young family interacting with each other on living room sofa."
                                src={pic2}
                            />
                        </div>
                        <div className="flex flex-col justify-center col-start-7 col-span-4 text-center lg:text-left px-10">
                            <h2 className="text-2xl font-bold">Our History</h2>
                            <p className="mt-10 text-lg">
                                Since our inception in 2023, Realty Savvy has rapidly
                                grown to become one of the most trusted names in online
                                real estate. We started with a small team of passionate
                                professionals who shared a common goal: to revolutionize
                                the real estate landscape through technology. Today, we
                                are proud to serve thousands of users daily, offering
                                unparalleled access to real estate listings with detailed
                                maps and vital property information.
                            </p>
                        </div>
                    </div>
                    <div className="mt-32 grid  grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-start-3 lg:col-span-3">
                            <img
                                className="hidden lg:block mx-auto w-1/2 lg:mx-0 shadow-2xl lg:w-full rounded-lg"
                                alt="Affectionate young family interacting with each other on living room sofa."
                                src={pic4}
                            />
                        </div>
                        <div className="flex flex-col justify-center col-start-7 col-span-4 text-center lg:text-left px-10 ">
                            <h2 className="text-2xl font-bold">
                                The Future of Realty Savvy
                            </h2>
                            <p className="mt-10 text-lg">
                                Looking ahead, Realty Savvy is committed to expanding its
                                offerings and enhancing user engagement through innovative
                                features like virtual tours, personalized alerts, and
                                advanced analytics. We are continuously working on
                                improving our platform and services to ensure that we stay
                                at the forefront of the real estate industry. We invite
                                you to explore Realty Savvy and discover how easy and
                                enjoyable finding the perfect property can be. Join us in
                                shaping the future of real estate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
