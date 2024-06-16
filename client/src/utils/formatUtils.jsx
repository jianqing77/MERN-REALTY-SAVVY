import states from 'states-us';

// ================================ RESULTS ================================
const petMapping = {
    Dog: 'dogs',
    Cat: 'cats',
    'No Pets Allowed': 'no_pets_allowed',
};

export function formatPets(pets) {
    return pets.map((pet) => petMapping[pet.trim()]).join(',');
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

    // Check if the price is a range
    if (value.includes('-')) {
        const prices = value.split('-').map((price) => price.trim());
        const formattedPrices = prices.map((price) => formatter.format(price));
        return formattedPrices.join(' - ');
    }

    // Handle single price
    return formatter.format(value);
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

export function formatListingType(type) {
    const typeMap = {
        for_sale: 'for sale',
        for_rent: 'for rent',
    };

    return typeMap[type] || type; // Return original type if no match found
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
