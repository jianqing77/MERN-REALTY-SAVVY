import PropTypes from 'prop-types';

export default function LeaseForm({ formData, formChangeHandler }) {
    return (
        <div>
            <label
                htmlFor="petPolicy"
                className="block text-sm font-medium leading-6 text-gray-900">
                Pet Policy
            </label>
            <div className="mt-2">
                <input
                    type="text"
                    name="petPolicy"
                    id="petPolicy"
                    value={formData.petPolicy}
                    onChange={formChangeHandler}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    );
}

LeaseForm.propTypes = {
    formData: PropTypes.shape({
        petPolicy: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    formChangeHandler: PropTypes.func.isRequired,
};
