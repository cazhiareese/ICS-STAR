import React from 'react';
import PropTypes from 'prop-types';

const ModalTemplate = ({ onClose, onContinue, choiceclose, choicecontinue, header, information }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-10 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-center">{header}</h2>
                <p className="text-gray-600 text-center mb-6">
                    {information}
                </p>
                <div className="flex justify-center space-x-10">
                    {choiceclose &&
                        <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={onClose}
                    >
                        {choiceclose}
                    </button>
                    }
                    {choicecontinue &&
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            onClick={onContinue}
                        >
                            {choicecontinue}
                        </button>
                    }
                    
                </div>
            </div>
        </div>
    );
};

ModalTemplate.propTypes = {
    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};

export default ModalTemplate;