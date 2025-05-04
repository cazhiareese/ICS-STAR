import React from 'react';
import PropTypes from 'prop-types';

const ModalTemplate = ({ onClose, onContinue, choiceclose, choicecontinue, header, information, color="bg-green-500" }) => {
    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-10 z-50">
            <div className="bg-white rounded-3xl shadow-lg p-6 w-96">

                <h2 className="text-xl font-bold mb-4 text-center">{header}</h2>
                <p className="text-gray-600 text-center mb-6">
                    {information}
                </p>
                <div className="flex justify-center space-x-10">
                    {choiceclose &&
                        <button
                        className="px-6 py-2 bg-neutral-100 border border-neutral-300 text-gray-700 rounded-2xl hover:bg-gray-300 cursor-pointer font-satoshi-bold"
                        onClick={onClose}
                    >
                        {choiceclose}
                    </button>
                    }
                    {choicecontinue &&
                        <button
                            className="px-6 py-2 bg-success text-white rounded-2xl hover:bg-green-600 font-satoshi-bold cursor-pointer"
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