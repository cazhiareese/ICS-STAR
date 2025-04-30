import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ onClose, onContinue }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Continue as guest?</h2>
                <p className="text-gray-600 text-center mb-6">
                    You may only access the newsletters and events page. To access more features, log in or sign up with your account.
                </p>
                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={onContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmationModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};

export default ConfirmationModal;