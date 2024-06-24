import PropTypes from 'prop-types';
import LeaseForm from './LeaseForm.jsx';
import SaleForm from './SaleForm.jsx';

export default function SpecialFormComponent({ formData, formChangeHandler }) {
    switch (formData.listingType) {
        case 'for-rent':
            return (
                <LeaseForm formData={formData} formChangeHandler={formChangeHandler} />
            );
        case 'for-sale':
            return <SaleForm formData={formData} formChangeHandler={formChangeHandler} />;
        default:
            return <div>Please select a listing type.</div>;
    }
}

// Define propTypes
SpecialFormComponent.propTypes = {
    formData: PropTypes.shape({
        listingType: PropTypes.string.isRequired,
    }).isRequired,
    formChangeHandler: PropTypes.func.isRequired,
};
