import { useState } from 'react';

export default function ImageSlider(currentListing) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageUrls = currentListing.media.imageUrls;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
        );
    };

    return (
        <div className="relative w-full">
            <div className="relative h-20 overflow-hidden rounded-lg md:h-36 mb-2">
                {imageUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition duration-700 ease-in-out ${
                            index === currentImageIndex ? 'block' : 'hidden'
                        }`}>
                        <img
                            src={url}
                            className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                    type="button"
                    className="z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
                    onClick={prevImage}
                    data-carousel-prev>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-200  group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white  group-focus:outline-none">
                        <svg
                            className="w-3 h-3 text-white dark:text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
                    onClick={nextImage}
                    data-carousel-next>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-200  group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white  group-focus:outline-none">
                        <svg
                            className="w-3 h-3 text-white dark:text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </div>
    );
}
