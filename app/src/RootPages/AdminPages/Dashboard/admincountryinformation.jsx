import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { List, LayoutGrid, MoveLeft, MoveRight, TentIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import UsersTable from "../../../components/AdminComponents/userstable";
import axios from "axios";
import SortModal from "../../../components/AdminComponents/sortmodal";
import OrderToggle from "../../../components/AdminComponents/ordertoggle";
import PaginationComponent from "../../../components/AdminComponents/PaginationComponent";

function AdminCountryInformation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { count } = state || {};

  const [viewStyle, setViewStye] = useState("List");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(48);
  const [allCountry, setAllCountry] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [topIndustries, setTopIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryUsers, setCountryUsers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryTotalCount, setCountryTotalCount] = useState(count);
  const [statsOrUser, setStatsOrUser] = useState("stats");
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0a3d91", "#5a78c8", "#a3b9ec", "#d8e4fa"];

  // Sorters
  const sorters = [
    { label: "Name", value: "name" },
    { label: "Batch", value: "batch" },
    { label: "Last Update", value: "updated" },
  ];
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("name_asc");

  const handleSortFieldChange = (field) => {
    setSortBy(field);
    const newParam = `${field}_${sortDirection}`;
    setOrderBy(newParam);
  };

  const handleDirectionToggle = (newDirection) => {
    setSortDirection(newDirection);
    const newParam = `${sortBy}_${newDirection}`;
    setOrderBy(newParam);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const countryParams = new URLSearchParams();
        countryParams.append("order_by", orderBy);
        const queryString = countryParams.toString();

        const [jobTitlesRes, topIndustriesRes, citiesRes, countryUsersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/stats/get_country_top_jobs?country=${selectedCountry}`, { headers }),
          axios.get(`${API_BASE_URL}/admin/stats/get_country_top_industries?country=${selectedCountry}`, { headers }),
          axios.get(`${API_BASE_URL}/admin/stats/get_country_cities?country=${selectedCountry}`, { headers }),
          axios.get(`${API_BASE_URL}/admin/stats/alumni_country_filter?country=${selectedCountry}&${queryString}`, { headers }),
        ]);

        setJobTitles(jobTitlesRes.data.data);
        setTopIndustries(topIndustriesRes.data.data);
        setCities(citiesRes.data.data);
        setCountryUsers(countryUsersRes.data.data);
      } catch (error) {
        setJobTitles([]);
        setTopIndustries([]);
        setCities([]);
        setCountryUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (allCountry.length > 0) {
      const index = allCountry.findIndex((f) => f.country === selectedCountry);
      setCountryTotalCount(allCountry[index].count);
    }
    if (selectedCountry) {
      fetchData();
    }
  }, [selectedCountry, orderBy]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const getCountries = await axios.get(
          `${API_BASE_URL}/get-all-countries`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllCountry(getCountries.data.data);
        setSelectedCountry(getCountries.data.data[0].country);
        setCountryTotalCount(getCountries.data.data[0].count);
      } catch (error) {
        setAllCountry([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const countryParams = new URLSearchParams();
        countryParams.append("order_by", orderBy);
        const queryString = countryParams.toString();
        const getCountryUsers = await axios.get(
          `${API_BASE_URL}/admin/stats/alumni_country_filter?country=${selectedCountry}&page=${page}&${queryString}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalPages(getCountryUsers.data.total_pages);
        setCountryUsers(getCountryUsers.data.data);
      } catch (error) {
        setCountryUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, sortBy, sortDirection]);

  // Skeleton components
  const SkeletonBarChart = () => (
    <div className="bg-[#FFFFFF] border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
      <div className="h-full w-full flex flex-col gap-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-6 w-full bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  const SkeletonPieChart = () => (
    <div className="border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
      <div className="flex flex-row h-full">
        <div className="h-full flex-1">
          <div className="w-3/4 h-3/4 bg-gray-200 rounded-full mx-auto"></div>
        </div>
        <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
              <span className="h-4 w-1/2 bg-gray-200 rounded"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white border border-gray-400 rounded-xl p-6 h-fit hidden lg:block animate-pulse">
      <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-10 w-full bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col py-6 px-25 overflow-auto h-screen max-h-screen">
      {/* Back button always visible */}
      <button
        className="flex gap-2 mb-3 flex-row items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="text-primary" />
        <p className="text-primary font-satoshi-medium text-lg">Back</p>
      </button>
      <div className="flex flex-1 pt-5 flex-col">
        {loading ? (
          <>
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="flex flex-row justify-between py-4">
              <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="flex flex-row gap-15">
                <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
            <div className="w-full lg:w-auto min-w-xs">
              <div className="h-10 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            {statsOrUser === "stats" ? (
              <div className="flex flex-col gap-4 mt-4">
                <SkeletonBarChart />
                <SkeletonBarChart />
                <SkeletonPieChart />
              </div>
            ) : (
              <>
                <div className="flex gap-2 mt-8 mb-4 justify-end">
                  <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <SkeletonTable />
              </>
            )}
          </>
        ) : (
          <>

          <div className='flex gap-2 mt-4 mb-2 justify-end'>
            
            <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
          
            {/* Order by */}
            <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle}/>
           
            {/* View changer */}
            <div className="flex items-center border border-disabled rounded-3xl overflow-hidden">
              {/* List View Button */}
              <button className="bg-[#FFFFFF] px-5 py-2 flex gap-2 cursor-pointer text-primary" onClick={() => {setViewStye('List')}}>
                <List className={`${viewStyle === 'List' ? 'text-primary' : 'text-disabled'}`} />
              </button>
              <div className="h-6 w-px bg-disabled"></div>
              {/* Grid View Button */}
              <button className="bg-[#FFFFFF] px-5 py-2 flex gap-2 cursor-pointer text-disabled" onClick={() => {setViewStye('Grid')}}>
                <LayoutGrid className={`${viewStyle === 'Grid' ? 'text-primary' : 'text-disabled'}`} />
              </button>

            </div>
            <div>
              <div className="w-full lg:w-auto min-w-xs">
                <button
                  className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${
                    statsOrUser === "stats"
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setStatsOrUser("stats")}
                >
                  <p
                    className={`text-black font-satoshi-light text-md ${
                      statsOrUser === "stats"
                        ? "text-primary font-satoshi-medium"
                        : ""
                    }`}
                  >
                    {" "}
                    Statistics{" "}
                  </p>
                </button>
                <button
                  className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${
                    statsOrUser === "users"
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setStatsOrUser("users")}
                >
                  <p
                    className={`text-black font-satoshi-light text-md ${
                      statsOrUser === "users"
                        ? "text-primary font-satoshi-medium"
                        : ""
                    }`}
                  >
                    {" "}
                    User List{" "}
                  </p>
                </button>
                <div className="border-b-1 border-gray-300 flex-1"></div>
              </div>
            </div>
            {statsOrUser === "stats" ? (
              <div className="flex flex-col gap-4 mt-4">
                {jobTitles && jobTitles.length > 0 ? (
                  <div className="bg-[#FFFFFF] border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6">
                    <h2 className="font-satoshi-bold text-xl"> Top Job Titles </h2>
                    <div className="h-full w-full ">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={jobTitles}
                          margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="job_title"
                            tick={{ fill: "#5A5673", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Bar
                            dataKey="count"
                            barSize={20}
                            background={{ fill: "#EAF1FF" }}
                            radius={[10, 10, 10, 10]}
                          >
                            {jobTitles.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill="#0A2B91"
                                radius={[10, 10, 10, 10]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : null}
                {topIndustries && topIndustries.length > 0 ? (
                  <div className="border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6">
                    <h2 className="font-satoshi-bold text-xl"> Top Industries </h2>
                    <div className="h-full w-full ">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={topIndustries}
                          margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="industry"
                            tick={{ fill: "#5A5673", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Bar
                            dataKey="count"
                            barSize={20}
                            background={{ fill: "#EAF1FF" }}
                            radius={[10, 10, 10, 10]}
                          >
                            {topIndustries.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill="#0A2B91"
                                radius={[10, 10, 10, 10]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : null}
                {cities && cities.length > 0 ? (
                  <div className="border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6">
                    <h2 className="font-satoshi-bold text-xl"> Cities </h2>
                    <div className="flex flex-row h-full">
                      <div className="h-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={cities}
                              cx="50%"
                              cy="50%"
                              outerRadius="80%"
                              dataKey="count"
                              stroke="none"
                            >
                              {cities.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                        {cities.map((entry, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index] }}
                            ></span>
                            <span>
                              {entry.city}
                              <span className="text-[#0a3d91] ml-1">
                                ({entry.percentage}%)
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="flex gap-2 mt-8 mb-4 justify-end">
                  <SortModal
                    filters={sorters}
                    selectedFilter={sortBy}
                    onSelect={handleSortFieldChange}
                  />
                  <OrderToggle
                    direction={sortDirection}
                    onToggle={handleDirectionToggle}
                  />
                  <PaginationComponent
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                  />
                </div>
                <div className="bg-white border border-gray-400 rounded-xl p-6 h-fit hidden lg:block overflow-auto">
                  <UsersTable data={countryUsers} userType="alum" />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminCountryInformation;