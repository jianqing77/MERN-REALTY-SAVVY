import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

function Pagination({ page, totalPages, onPageChange }) {
    const prevClickHandler = (e) => {
        e.preventDefault();
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const nextClickHandler = (e) => {
        e.preventDefault();
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    const handleSelectChange = (e) => {
        onPageChange(Number(e.target.value));
    };

    return (
        <nav className="flex items-center justify-between border-t px-4 sm:px-0 ">
            <div className="flex w-0 flex-1 justify-end">
                <a
                    href="#"
                    onClick={prevClickHandler}
                    className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-6 text-base font-medium ${
                        page <= 1 ? 'text-gray-300' : 'text-dark-100 hover:text-dark-200'
                    }`}>
                    <ArrowLongLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Previous
                </a>
            </div>
            <div className="hidden md:flex">
                {/* Dropdown for selecting page number */}
                <select
                    className="bg-transparent border-transparent mt-2 ml-3 px-2 pt-6 text-base font-medium text-dark-100 cursor-pointer focus:outline-none focus:border-none focus:ring-0"
                    value={page}
                    onChange={handleSelectChange}
                    aria-label="Select page">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            Page {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex w-0 flex-1 justify-start ">
                <a
                    href="#"
                    onClick={nextClickHandler}
                    className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-6 text-base font-medium ${
                        page >= totalPages
                            ? 'text-gray-300'
                            : 'text-dark-100 hover:text-dark-200'
                    }`}>
                    Next
                    <ArrowLongRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
                </a>
            </div>
        </nav>
    );
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
