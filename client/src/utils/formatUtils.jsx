import states from 'states-us';

export function cleanFilters(filters) {
    const cleanObject = {};
    Object.keys(filters).forEach((key) => {
        // Check for null and possibly other falsy values you want to exclude
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            cleanObject[key] = filters[key];
        }
    });
    return cleanObject;
}

// ================================ RESULTS ================================
const petMapping = {
    Dogs: 'dogs',
    Cats: 'cats',
    'No Pets Allowed': 'no_pets_allowed',
};

const petMappingInternal = {
    Dogs: 'Dogs',
    Cats: 'Cats',
    'No Pets Allowed': 'No Pets Allowed',
};

export function formatPets(pets) {
    return pets.map((pet) => petMapping[pet.trim()]).join(',');
}

export function formatPetsString(pets) {
    return pets.map((pet) => petMappingInternal[pet.trim()]).join(',');
}

export function formatRange(range) {
    const { min, max } = range;
    if (min && max) {
        return `${min},${max}`;
    } else if (min) {
        return `${min}`;
    } else if (max) {
        return `,${max}`;
    }
    return ''; // Return empty string if both min and max are not provided
}

// ================================ LISTING CARD ===========================
// Function to format price
export function formatPrice(value) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Convert number to string if necessary
    const stringValue = value.toString();

    // Check if the price is a range
    if (stringValue.includes('-')) {
        const prices = stringValue.split('-').map((price) => price.trim());
        const formattedPrices = prices.map((price) => formatter.format(price));
        return formattedPrices.join(' - ');
    }

    // Handle single price
    return formatter.format(stringValue);
}

export function formatSquareFeet(value) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Use "decimal" for non-currency numbers
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Check if the value is a range
    if (value.includes('-')) {
        const sqftRange = value.split('-').map((sqft) => sqft.trim());
        const formattedSqft = sqftRange.map((sqft) => formatter.format(sqft));
        return formattedSqft.join(' - ');
    }

    // Handle single value
    return formatter.format(value);
}

export function formatPropertyType(type) {
    const typeMap = {
        condos: 'Condo',
        co_op: 'Co-op',
        cond_op: 'Cond-op',
        townhomes: 'Town home',
        single_family: 'Single-Family',
        multi_family: 'Multi-Family',
        mobile_mfd: 'Mobile/Mfd',
        farm_ranch: 'Farm Ranch',
        land: 'Land',
        apartment: 'Apartment',
    };

    return typeMap[type] || type; // Return original type if no match found
}

export function formatPropertyTypeInternal(type) {
    const typeMap = [
        { label: 'Single-family Home', value: 'single-family-home' },
        { label: 'Multi-family Home', value: 'multi-family-home' },
        { label: 'Condo', value: 'condo' },
        { label: 'Townhouse', value: 'townhouse' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Other', value: 'other' },
    ];

    const matchedType = typeMap.find((item) => item.value === type);

    // Return the label if found, otherwise return 'Unknown'
    return matchedType ? matchedType.label : 'Unknown';
}

export function formatListingType(type) {
    const typeMap = {
        for_sale: 'For Sale',
        for_rent: 'For Rent',
    };

    return typeMap[type] || type; // Return original type if no match found
}

export function formatListingTypeInternal(type) {
    const typeMap = [
        { label: 'for-sale', value: 'For Sale' },
        { label: 'for-rent', value: 'For Rent' },
    ];

    const matchedType = typeMap.find((item) => item.label === type);

    // Return the label if found, otherwise return 'Unknown'
    return matchedType ? matchedType.value : 'Unknown';
}

// Function to format the state to an abbreviation
export function getAbbreviation(stateName) {
    const state = states.find(
        (state) => state.name.toLowerCase() === stateName.toLowerCase()
    );
    return state ? state.abbreviation : null;
}

export function formatDate(dateString) {
    if (!dateString) return 'No Date';

    const date = new Date(dateString);
    const formattedDate = date
        .toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\//g, '-'); // Replace slashes with hyphens

    return formattedDate;
}
