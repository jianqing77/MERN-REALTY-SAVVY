import PropTypes from 'prop-types';

export default function SellForm({ formData, formChangeHandler }) {
    return (
        <div>
            <label
                htmlFor="homeAge"
                className="block text-sm font-medium leading-6 text-gray-900">
                Home Age
            </label>
            <div className="mt-2">
                <input
                    type="text"
                    name="homeAge"
                    id="homeAge"
                    value={formData.homeAge}
                    onChange={formChangeHandler}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    );
}

SellForm.propTypes = {
    formData: PropTypes.shape({
        homeAge: PropTypes.string,
    }).isRequired,
    formChangeHandler: PropTypes.func.isRequired,
};
