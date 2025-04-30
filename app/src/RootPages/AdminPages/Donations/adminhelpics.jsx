import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, MoveRight } from 'lucide-react';
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable';
import VerifiedDonationsTable from '../../../components/AdminComponents/verifieddonationstable';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent';
import AdminBack from '../../../components/AdminComponents/AdminBack';
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import SortModal from '../../../components/AdminComponents/sortmodal'

function AdminHelpIcs() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(null)

  const [pendingDonations, setPendingDonations] = useState(null);
  const [verifiedDonations, setVerifiedDonations] = useState(null);
  const [driveData, setDriveData] = useState({});
  const [driveid, setDriveid] = useState('');
  const [noPendingDonations, setNoPendingDonations] = useState(true);
  const [pendingPage, setPendingPage] = useState(1);
  const [totalPendingPages, setTotalPendingPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [verifiedPage, setVerifiedPage] = useState(1)
  const [totalVerifiedPages, setTotalVerifiedPages] = useState(1)
  const [sortDirection, setSortDirection] = useState('asc')

  async function fetchDriveDetails() {
    try {
      const genDriveRes = await axios.get(`${API_BASE_URL}/admin/donations/generic-drive-view`, {headers: {Authorization: `Bearer ${token}`}});
      setDriveData(genDriveRes.data);
      setDriveid(genDriveRes.data.drive_id);
      return genDriveRes.data.drive_id;
    } catch (error) {
      console.log('Error fetching drive details:', error);
      setDriveData({});
      setDriveid('');
      return null;
    }
  }

  async function fetchPendingDonations(driveId) {
    try {
      const pendingDriveRes = await axios.get(`${API_BASE_URL}/admin/donations/get-all-pending-donations/${driveId}`, {headers: {Authorization: `Bearer ${token}`}});
      setPendingDonations(pendingDriveRes.data.data);
      setTotalPendingPages(pendingDriveRes.data.total_pages);
      setNoPendingDonations(pendingDriveRes.data.data.length === 0);
    } catch (error) {
      console.log('Error fetching pending donations:', error);
      setPendingDonations([]);
      setTotalPendingPages(1);
      setNoPendingDonations(true);
    }
  }

  async function fetchVerifiedDonations(driveId) {
    try {
      const verifiedDriveRes = await axios.get(`${API_BASE_URL}/admin/donations/get-all-verified-donations/${driveId}`, {headers: {Authorization: `Bearer ${token}`}});
      setVerifiedDonations(verifiedDriveRes.data.data);
      setTotalVerifiedPages(verifiedDriveRes.data.pages)
    } catch (error) {
      console.log('Error fetching verified donations:', error);
      setVerifiedDonations([]);
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    async function loadData() {
      setLoading(true);
      try {
        const driveId = await fetchDriveDetails();
        if (driveId) {
          await Promise.all([
            fetchPendingDonations(driveId),
            fetchVerifiedDonations(driveId),
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="flex flex-col lg:p-6 min-h-screen overflow-auto max-w-7xl mx-auto bg-gray-100">
      {loading ? (
        <div className="flex flex-col">
          <AdminBack label={'Back to Donations List'} />
          <h1 className="font-satoshi-bold text-5xl text-primary">Help ICS Out</h1>
          <div className="h-80 flex flex-row gap-2 mt-3">
            <div className="flex-1/3 border border-gray-300 rounded-2xl flex flex-col items-center gap-4 justify-center bg-white">
              <div className="flex flex-col items-center">
                <div className="h-12 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <p className="font-satoshi-light text-black">Total Raised (Verified)</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <p className="font-satoshi-light text-black">Total Raised (Including Unverified)</p>
              </div>
            </div>
            <div className="flex-2/3 border border-gray-300 rounded-xl p-6 w-full flex flex-col h-full bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="font-satoshi-medium text-black text-2xl">Pending Verification</h2>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-full h-full flex-1 overflow-auto">
                <PendingDonationsTable data={[]} loading={true} />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-satoshi-medium text-black text-4xl my-5">List of Donations</h2>
            <div className='flex flex-row items-center gap-2'>
              <button
                className="bg-primary rounded-3xl text-white px-4 py-3 h-fit cursor-pointer hover:bg-hover"
                onClick={() => navigate(`/admin/donations/donation-drive-demographics/${driveid}`)}
                >
                View Statistics
              </button>
              <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-3/5 w-full border border-gray-300 rounded-2xl overflow-auto bg-white">
            <VerifiedDonationsTable data={[]} loading={true} />
          </div>
        </div>
      ) : (
        <>
          <AdminBack label={'Back to Donations List'} />
          <h1 className="font-satoshi-bold text-5xl text-primary">Help ICS Out</h1>
          <div className="h-80 flex flex-row gap-2 mt-3">
            <div className="flex-1/3 border border-gray-300 rounded-2xl flex flex-col items-center gap-4 justify-center bg-white">
              <div className="flex flex-col items-center">
                <h2 className="font-satoshi-bold text-primary text-5xl">₱ {driveData.grand_total}</h2>
                <p className="font-satoshi-light text-black">Total Raised (Verified)</p>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="font-satoshi-bold text-primary text-5xl">₱ {driveData.verified_total}</h2>
                <p className="font-satoshi-light text-black">Total Raised (Including Unverified)</p>
              </div>
            </div>
            <div className="flex-2/3 border border-gray-300 rounded-xl p-6 w-full flex flex-col h-full bg-white">
              <div className="flex flex-row justify-between">
                <h2 className="font-satoshi-medium text-black text-2xl">Pending Verification</h2>
                {noPendingDonations ? null : (
                  <PaginationComponent
                    page={pendingPage}
                    setPage={setPendingPage}
                    totalPages={totalPendingPages}
                  />
                )}
              </div>
              <div className="w-full h-full flex-1 overflow-auto">
                {noPendingDonations ? (
                  <p className="text-center text-gray-500">No donations to verify</p>
                ) : (
                  <PendingDonationsTable data={pendingDonations} loading={false} />
                )}
              </div>
              {noPendingDonations ? null : (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5 flex-1">
                    {/* <h3 className="font-satoshi-light">
                      Monetary Total: <span className="text-primary">{pendingMonetaryTotal}</span>
                    </h3>
                    <h3 className="font-satoshi-light">
                      In-Kind Total: <span className="text-primary">{pendingInKindTotal}</span>
                    </h3> */}
                  </div>
                  <button
                    className="flex gap-2 w-full flex-1 text-primary hover:text-hover transition-colors cursor-pointer justify-end items-center font-satoshi-regular"
                    onClick={() =>
                      navigate(`/admin/donations/pending-donations/${driveid}`, {
                        state: { pendingDonations, driveName: driveData.title },
                      })
                    }
                  >
                    <p className="font-satoshi-light">View all pending verifications</p>
                    <MoveRight className="stroke-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-satoshi-medium text-black text-4xl my-5">List of Donations</h2>
            <div className='flex flex-row gap-2 '>
              <button
                className="bg-primary rounded-3xl text-white px-4 py-3 h-fit cursor-pointer hover:bg-hover"
                onClick={() => navigate(`/admin/donations/donation-drive-demographics/${driveid}`)}
              >
                View Statistics
              </button>
              {/* <SortModal
                filters={['Date', 'Name']}
                selectedFilter={}
                onSelect={}

              /> */}
              {/* TODO: Add order toggle */}
              <OrderToggle
                direction={sortDirection}
                onToggle={() => {}}
              />
              <PaginationComponent
                page={verifiedPage}
                setPage={setVerifiedPage}
                totalPages={totalVerifiedPages}
              />
            </div>
          </div>
          <div className="h-3/5 w-full border border-gray-300 rounded-2xl overflow-auto bg-white">
            <VerifiedDonationsTable data={verifiedDonations} loading={false} />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminHelpIcs;