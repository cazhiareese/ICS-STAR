import React, { useState, useEffect } from 'react';
import { Plus, HandCoins, MoveLeft, MoveRight, List, LayoutGrid, Filter, Search } from 'lucide-react';
import DonationsTable from '../../../components/AdminComponents/donationstable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent';
import SearchComponent from '../../../components/AdminComponents/SearchComponent';

function AdminDonations() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [donationType, setDonationType] = useState('open');
  const [viewStyle, setViewStyle] = useState('List');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genericDriveDetails, setGenericDriveDetails] = useState({});

  const filters = [
    { label: 'Amount Raised', value: 'amount_raised' },
    { label: 'Percent Funded', value: 'percent_funded' },
    { label: 'Donation Count', value: 'donation_count' },
    { label: 'Date Created', value: 'date_created' },
    { label: 'Date Closed', value: 'date_closed' },
  ];
  const [sortBy, setSortBy] = useState('amount_raised');
  const [sortDirection, setSortDirection] = useState('desc');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function fetchData(token) {
    setLoading(true);
    try {
      let endpoint = '/admin/donations/search';

      const sortOptions = {
        amount_raised: `amount_raised_${sortDirection}`,
        percent_funded: `percent_funded_${sortDirection}`,
        donation_count: `donation_count_${sortDirection}`,
        date_created: `date_created_${sortDirection === 'desc' ? 'oldest' : 'newest'}`,
        date_closed: `date_closed_${sortDirection === 'desc' ? 'oldest' : 'newest'}`,
      };

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        is_closed: donationType === 'closed' ? 'true' : 'false',
        sort_by: sortOptions[sortBy] || 'amount_raised_descending',
      });

      // Only include title parameter if query is not empty
      if (query.trim()) {
        params.append('title', query.trim());
      }

      const pageUrl = `${endpoint}?${params.toString()}`;
      console.log(pageUrl);

      try {
        const response = await axios.get(`${API_BASE_URL}${pageUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setDonations(response.data);
        // Adjust based on actual API response for pagination
        setTotalPages(response.data.total_pages || 1); // Placeholder; assumes total_pages in response
      } catch (error) {
        console.error('Error fetching donations:', error);
        setDonations([]);
      }

      const genDriveResponse = await axios.get(`${API_BASE_URL}/admin/donations/update-generic-drive`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(genDriveResponse.data);
      setGenericDriveDetails(genDriveResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle query changes to reset page to 1 when query is cleared
  useEffect(() => {
    if (!query.trim()) {
      setPage(1); // Reset to first page when search is empty
    }
    const token = localStorage.getItem('token');
    fetchData(token);
  }, [sortBy, sortDirection, page, donationType, query]);

  return (
    <div className="flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-primary text-5xl font-satoshi-bold">Donations</h1>
        <button
          className="flex bg-primary font-satoshi-regular px-6 py-3 text-white rounded-2xl gap-2 cursor-pointer hover:bg-hover"
          onClick={() => navigate('/admin/donations/create-donation-drive')}
        >
          <Plus />
          <p>New Donation</p>
        </button>
      </div>
      <div
        className="border border-gray-300 rounded-xl flex py-4 cursor-pointer hover:border-primary bg-white"
        onClick={() => navigate('/admin/donations/help-ics')}
      >
        <div className="flex flex-row text-2xl items-center justify-center flex-1 gap-2">
          <HandCoins />
          <h2 className="font-satoshi-medium">Help ICS</h2>
        </div>
        <div className="border-l border-gray-300"></div>
        <div className="flex flex-1">
          <div className="flex flex-col items-center justify-center flex-1">
            <h3 className="font-satoshi-bold text-2xl text-primary">Php {genericDriveDetails.total_amount}</h3>
            <p className="font-satoshi-light">Monetary Donations</p>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <h3 className="font-satoshi-bold text-2xl text-primary">{genericDriveDetails.total_in_kind}</h3>
            <p className="font-satoshi-light">In-kind Donations</p>
          </div>
        </div>
        <div className="border-l border-gray-300"></div>
        <div className="flex flex-col items-center justify-center flex-1">
          <h3 className="font-satoshi-bold text-2xl text-primary">{genericDriveDetails.number_of_unverified}</h3>
          <p className="font-satoshi-medium">Unverified Donations</p>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0">
        <div className="w-full lg:w-auto min-w-xs">
          <button
            className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${
              donationType === 'open' ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'
            }`}
            onClick={() => setDonationType('open')}
          >
            <p>Open</p>
          </button>
          <button
            className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${
              donationType === 'closed' ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'
            }`}
            onClick={() => setDonationType('closed')}
          >
            <p>Closed</p>
          </button>
        </div>
        <div className="flex gap-2">
          <SearchComponent query={query} setQuery={setQuery} focused={focused} setFocused={setFocused} />
          <SortModal filters={filters} selectedFilter={sortBy} onSelect={setSortBy} />
          <OrderToggle direction={sortDirection} onToggle={setSortDirection} />
          <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
      <div className="border border-gray-400 rounded-xl p-6 h-fit hidden lg:block overflow-auto bg-white">
        <DonationsTable data={donations} loading={loading} />
      </div>
    </div>
  );
}

export default AdminDonations;