import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import CircularLoading from '../LoadingComponents/circularloading';


{/* 
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [reports, setReports] = useState([]);
    const [limitAccessLoading, setLimitAccessLoading] = useState(false);
    const [limitAccessComplete, setLimitAccessComplete] = useState(false);
    <button
        className="flex flex-row gap-2 text-error font-satoshi-medium cursor-pointer"
        onClick={() => setShowReportsModal(true)}
      >
        View Report Logs
      </button>
      <ReportModal
        isOpen={showReportsModal}
        onClose={() => {
          setShowReportsModal(false);
          setLimitAccessComplete(false);
        }}
        reports={reports}
        onLimitAccess={limitAccountAccess}
        isLoading={limitAccessLoading}
        isComplete={limitAccessComplete}
      />
    </div> 
*/}

function ReportModal({ isOpen, onClose, reports, onLimitAccess, isLoading, isComplete }) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-xl h-2/5">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <CircularLoading />
            </div>
          ) : isComplete ? (
            <>
              <div className="text-success">
                <CheckCircle size={48} />
              </div>
              <p className="text-xl font-satoshi-medium mt-4 text-center">
                Account Access Limited Successfully!
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
              {/* Modal Header */}
              <div className="flex justify-between w-full items-center pb-2">
                <h2 className="text-2xl font-satoshi-medium">Report Logs</h2>
                <button
                  className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
                  onClick={onClose}
                >
                  <X className="w-7 h-7 text-error" />
                </button>
              </div>
              {/* Report Table */}
              {reports != null && reports.length > 0 ? (
                <div className="flex flex-col h-full">
                  {/* Report Table */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="text-left text-sm font-satoshi-medium">
                          <th className="w-1/4 py-2 pr-4">Date</th>
                          <th className="w-1/4 py-2 pr-4">Time</th>
                          <th className="w-1/2 py-2 pr-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="overflow-y-auto">
                        {reports.map((report, index) => (
                          <tr key={index} className="font-satoshi-regular h-10 border-b border-gray-200">
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.report_date || 'N/A'}
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.report_time || 'N/A'}
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.reason || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Action Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className="font-satoshi-medium bg-error text-white px-4 py-2 rounded-3xl w-52 cursor-pointer hover:bg-red-600"
                      onClick={onLimitAccess}
                    >
                      Limit Account Access
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-satoshi-regular text-lg text-black">No reports</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  );
}

export default ReportModal;