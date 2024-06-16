import React from 'react';
import PropTypes from 'prop-types';
import DropdownSingle from '../../components/DropDownSingle.jsx';
import DropdownMultiple from '../../components/DropDownMultiple.jsx';
import DropdownRange from '../../components/DropDownRange.jsx';

const SearchBarRentals = ({
    initialCategory,
    onCategoryChange,
    onPriceRangeChange,
    onSizeRangeChange,
    onBedroomsChange,
    onBathroomsChange,
    onPetsChange,
    onSearch,
}) => {
    const categoryOptions = [
        { label: 'For Rent', value: 'for-rent' },
        { label: 'For Sale', value: 'for-sale' },
    ];

    const bedroomsOptions = [
        { label: '0+', value: '0' },
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '3+', value: '3' },
        { label: '4+', value: '4' },
        { label: '5+', value: '5' },
    ];

    const bathroomsOptions = [
        { label: '0+', value: '0' },
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '3+', value: '3' },
        { label: '4+', value: '4' },
        { label: '5+', value: '5' },
    ];

    return (
        <div className="flex items-center justify-between px-2 rounded-lg mx-auto mt-4">
            <DropdownSingle
                label="Category"
                initialValue={initialCategory}
                options={categoryOptions}
                onSelectionChange={onCategoryChange}
            />
            <DropdownRange buttonLabel="Price" onRangeChange={onPriceRangeChange} />
            <DropdownRange buttonLabel="Size" onRangeChange={onSizeRangeChange} />
            <DropdownSingle
                label="Bedrooms"
                options={bedroomsOptions}
                onSelectionChange={onBedroomsChange}
            />
            <DropdownSingle
                label="Bathrooms"
                options={bathroomsOptions}
                onSelectionChange={onBathroomsChange}
            />
            <DropdownMultiple
                options={['Dog', 'Cat', 'No Pets Allowed']}
                buttonLabel="Pet"
                onSelectionChange={onPetsChange}
                buttonClassName="text-base"
            />
            <button
                className="bg-dark-200 text-white text-base rounded-lg px-4 py-2"
                onClick={onSearch}>
                Search
            </button>
        </div>
    );
};

SearchBarRentals.propTypes = {
    initialCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onPriceRangeChange: PropTypes.func.isRequired,
    onSizeRangeChange: PropTypes.func.isRequired,
    onBedroomsChange: PropTypes.func.isRequired,
    onBathroomsChange: PropTypes.func.isRequired,
    onPetsChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default SearchBarRentals;
