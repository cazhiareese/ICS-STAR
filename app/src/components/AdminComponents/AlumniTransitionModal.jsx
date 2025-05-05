import React from 'react';
import { CheckCircle } from 'lucide-react';
import CircularLoading from '../LoadingComponents/circularloading';

{/* 
    <button
          className="flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer"
          onClick={() => setShowAlumniModal(true)}
        >
          Make Alumni
    </button>
    
    const [showAlumniModal, setShowAlumniModal] = useState(false);
    const [makeAlumniLoading, setMakeAlumniLoading] = useState(false);
    const [transitionComplete, setTransitionComplete] = useState(false);
    <AlumniTransitionModal
        isOpen={showAlumniModal}
        onClose={() => {
          setShowAlumniModal(false);
          setTransitionComplete(false);
          if (transitionComplete) window.location.reload();
        }}
        onConfirm={makeAlumni}
        isLoading={makeAlumniLoading}
        isComplete={transitionComplete}
/> 
*/}

function AlumniTransitionModal({ isOpen, onClose, onConfirm, isLoading, isComplete }) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
          {isLoading ? (
            <div className="h-full">
              <CircularLoading />
            </div>
          ) : isComplete ? (
            <>
              <div className="text-success">
                <CheckCircle size={48} />
              </div>
              <p className="text-xl font-satoshi-medium mt-4 text-center">
                Transition to Alumni Successful!
              </p>
              <button
                className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                onClick={onClose}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <p className="text-xl font-satoshi-medium text-center mt-4">
                Confirm transition to Alumni?
              </p>
              <div className="flex gap-3 mt-6 w-full justify-center">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-3xl w-full cursor-pointer"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-success text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}

export default AlumniTransitionModal;