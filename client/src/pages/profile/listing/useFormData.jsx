import { useState } from 'react';

export default function useFormData() {
    const [formData, setFormData] = useState({
        title: '',
        listingType: 'for-rent', // default
        description: '',
        availableDate: '',
        price: '',
        propertyType: 'Apartment', // default
        address: '',
        aptOrSuite: '',
        city: '',
        state: '',
        zipCode: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        agentCompany: '',
        agentName: '',
        agentPhone: '',
        homeAge: 0,
        petPolicy: [],
        imageUrls: [],
        refUrl: '',
        email: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const formChangeHandler = (e) => {
        const { name, value } = e.target;

        let adjustedValue = value;
        if (
            name === 'homeAge' ||
            name === 'bedrooms' ||
            name === 'bathrooms' ||
            name === 'price' ||
            name === 'sqft'
        ) {
            adjustedValue = value === '' ? undefined : Number(value);
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: adjustedValue, // use the adjusted value
        }));
        console.log('Name: ' + name + ' Value: ' + adjustedValue);
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = {
            title: formData.title,
            listingType: formData.listingType,
            price: formData.price,
            propertyType: formData.propertyType,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            agentCompany: formData.agentCompany,
            agentName: formData.agentName,
            email: formData.email,
        };

        // Check each field and add to errors if empty
        for (const key in requiredFields) {
            if (!requiredFields[key]) {
                errors[key] = 'This field is required';
            }
        }

        return errors;
    };

    return {
        formData,
        formErrors,
        setFormData,
        setFormErrors,
        formChangeHandler,
        validateForm,
    };
}
