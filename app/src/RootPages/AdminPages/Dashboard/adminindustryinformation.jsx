import React, {useState, useEffect} from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { List, LayoutGrid, MoveLeft, MoveRight, TentIcon} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import UsersTable from '../../../components/AdminComponents/userstable';
import axios from 'axios'
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';

function AdminIndustryInformation() {
    const navigate = useNavigate()
    const { state } = useLocation(); // From navigate
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const { count } = state || {};

    const [viewStyle, setViewStye] = useState('List')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(48)

    const[jobTitles, setJobTitles] = useState([])
    const [industries, setIndustries] = useState([])
    const [employmentClassificaion, setEmploymentClassification]  = useState([])
    const [tenureStatus, setTenureStatus]  = useState([])
    const [workMode, setWorkMode] = useState([])
    const [salaryGrade, setSalaryGrade] = useState([])

    
    const [industryUsers, setIndustryUsers] = useState([])
    const [selectedIndustry, setSelectedIndustry] = useState('')
    const [industryTotalCount, setIndustryTotalCount] = useState(count)
    const [statsOrUser, setStatsOrUser] = useState('stats')

    const COLORS = ['#0a3d91', '#5a78c8', '#a3b9ec', '#d8e4fa'];

    //sorters
    const sorters = [
      { label: 'Name', value: 'name' },
      { label: 'Batch', value: 'batch' },
      { label: 'Last Update', value: 'updated' },
    ];
    const [sortBy, setSortBy] = useState(sorters[0].value);
    const [sortDirection, setSortDirection] = useState('asc');
    const [orderBy, setOrderBy] = useState('name_asc');
    
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

    useEffect(()=>{
      const fetchData = async () =>{
      try {
        const getemploymentClass= await axios.get(`${API_BASE_URL}/admin/stats/industry/employment_class?industry=${selectedIndustry}`);
        setEmploymentClassification(getemploymentClass.data?.data || []);
      } catch (error) {
          setEmploymentClassification([]); 
      }

     
      try{
      const getJobTitles = await axios.get(`${API_BASE_URL}/admin/stats/get_industry_jobs?industry=${selectedIndustry}`)
      setJobTitles(getJobTitles.data.data)
      }catch (error){
        setJobTitles([])
      }

      try{
        const getTenureStatus = await axios.get(`${API_BASE_URL}/admin/stats/industry/tenured_status?industry=${selectedIndustry}`)
        setTenureStatus(getTenureStatus.data.data)
        }catch (error){
            setTenureStatus([])
        }
      
        try{
          const getWorkMode = await axios.get(`${API_BASE_URL}/admin/stats/industry/work_type?industry=${selectedIndustry}`)
          setWorkMode(getWorkMode.data.data)
          }catch (error){
            setWorkMode([])
          }
          
          try{
            const getSalaryGrade = await axios.get(`${API_BASE_URL}/admin/stats/industry/salary_grade?industry=${selectedIndustry}`)
            setSalaryGrade(getSalaryGrade.data.data)
            }catch (error){
              setSalaryGrade([])
            }

        try {
          const industryParams = new URLSearchParams();
          industryParams.append('order_by', orderBy);
          const queryString = industryParams.toString();
          const getIndustryUsers = await  axios.get(`${API_BASE_URL}/admin/stats/alumni_industry_filter?industry=${selectedIndustry}&${queryString}`)
          setIndustryUsers(getIndustryUsers.data.data)
        }catch (error) {
          setIndustryUsers([])
        }

    }
    if (industries.length > 0){
        console.log(industries)
      const index = industries.findIndex(f => f.industry === selectedIndustry);
    //   console.log(industries[index])
      setIndustryTotalCount(industries[index].count)
    }
      fetchData();
      
    }, [selectedIndustry])

    useEffect(() => {
    const fetchData = async () =>{
    const getIndustries = await axios.get(`${API_BASE_URL}/get-all-industries`);
    console.log(getIndustries.data.data)
      setIndustries(getIndustries.data.data);
      setSelectedIndustry(getIndustries.data.data[0].industry)
      setIndustryTotalCount(getIndustries.data.data[0].count)
    }
    fetchData();
    }, [])

    useEffect (() => {

      const fetchUsers = async () => {
        try {
            const industryParams = new URLSearchParams();
            industryParams.append('order_by', orderBy);
            const queryString = industryParams.toString();
            const getIndustryUsers = await  axios.get(`${API_BASE_URL}/admin/stats/alumni_industry_filter?industry=${selectedIndustry}&${queryString}`)
            setIndustryUsers(getIndustryUsers.data.data)
          }catch (error) {
            setIndustryUsers([])
          }
      } 
      fetchUsers();
    }, [sortBy, sortDirection])
    


    return (
    <div className='py-6 px-25 overflow-auto max-h-screen'>
      {/* Back */}
        <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      <div className='flex flex-col'>
        <h2 className='font-satoshi-bold text-2xl text-primary'> Industries </h2>
        {/* Batch and count */}
        <div className='flex flex-row justify-between'>
          {/* Batch selector */}
          <select
            value={selectedIndustry}
            onChange={(e) => {
              setSelectedIndustry(e.target.value);
            }}
            className="block w-fit px-4 py-2 text-2xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black font-satoshi-bold"
          >
            {industries.map((industry) => (
              <option key={industry.industry} value={industry.industry}>
                {industry.industry}
              </option>
            ))}
          </select>
          {/* Count, active, inactive */}
          <div className='flex flex-row gap-15'>
            {/* Total count */}
            <div className='flex flex-col items-center'>
              <p className='font-satoshi-bold text-3xl'> {industryTotalCount} </p>
              <p className='font-satoshi-light text-sm text-primary'> Total Count</p>
            </div>

          </div>
        </div>
        {/* Selector */}
        <div>
          <div className='w-full lg:w-auto  min-w-xs'>
            {/* Alumni button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${statsOrUser === 'stats' ? 'border-primary' : 'border-transparent'}`} onClick={() => setStatsOrUser('stats')}>
              <p className={`text-black font-satoshi-light text-md ${statsOrUser === 'stats' ? 'text-primary font-satoshi-medium' : ''}`}> Statistics </p>
            </button>
            {/* Student button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${statsOrUser === 'users' ? 'border-primary' : 'border-transparent'}`} onClick={() => setStatsOrUser('users')}>
            <p className={`text-black font-satoshi-light text-md ${statsOrUser === 'users' ? 'text-primary font-satoshi-medium' : ''}`}> User List </p>
            </button>
            {/* For the underline */}
            <div className='border-b-1 border-gray-300 flex-1'></div>
          </div>
        </div>
        {/* Statistics */}
        {statsOrUser === 'stats' ? (
        <div className='flex flex-col gap-2 mt-2'>
          {/* Top Job Titles */}
          {jobTitles && jobTitles.length > 0  ? <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
            <h2 className='font-satoshi-bold text-xl'> Job Titles </h2>
            <div className='h-full w-full '>
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
                    tick={{ fill: "#5A5673", fontSize:10}}
                    axisLine={false}
                    tickLine={false}
                    />
                  <Bar
                    dataKey="count"
                    barSize={20}
                    background={{ fill: "#EAF1FF" }}
                    radius={[10,10,10,10]}
                    >
                    {jobTitles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#0A2B91" radius={[10,10,10,10]} /> 
                    ))}
                    {/* <LabelList dataKey="count" position="right" fill="#000" fontSize={14} /> */}

                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div> : null
          }
          
          {employmentClassificaion && employmentClassificaion.length > 0 ? <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
                      <h2 className='font-satoshi-bold text-xl'> Employer Classification </h2>
                      <div className='flex flex-row h-full'>
                        {/* Pie chart */}
                        <div className="h-full flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={employmentClassificaion}
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                dataKey="count"
                                stroke="none"
                                >
                                {employmentClassificaion.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                          {employmentClassificaion.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                                ></span>
                              <span>
                                {entry.class}
                                <span className="text-[#0a3d91] ml-1">({entry.percentage}%)</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div> : null}
            <div className={`grid grid-cols-2 gap-8 flex-1`}>
            {tenureStatus &&tenureStatus.length > 0 ? <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
                <h2 className='font-satoshi-bold text-xl'> Tenure Status </h2>
                <div className='flex flex-row h-full'>
                {/* Pie chart */}
                <div className="h-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={tenureStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        dataKey="count"
                        stroke="none"
                        >
                        {tenureStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                    {tenureStatus.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                        ></span>
                        <span>
                        {entry.tenured_status}
                        <span className="text-[#0a3d91] ml-1">({entry.percentage}%)</span>
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            </div> : null}
            {workMode &&workMode.length > 0 ? <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
                <h2 className='font-satoshi-bold text-xl'> Work Mode </h2>
                <div className='flex flex-row h-full'>
                {/* Pie chart */}
                <div className="h-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={workMode}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        dataKey="count"
                        stroke="none"
                        >
                        {workMode.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                    {workMode.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                        ></span>
                        <span>
                        {entry.work_mode}
                        <span className="text-[#0a3d91] ml-1">({entry.percentage}%)</span>
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            </div> : null}
            </div>
            { salaryGrade && salaryGrade.length > 0 ? <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
            <h2 className='font-satoshi-bold text-xl'> Salary Grades</h2>
            <div className='h-full w-full '>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={salaryGrade}
                  margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                  >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="salary_grade"
                    tick={{ fill: "#5A5673", fontSize:10}}
                    axisLine={false}
                    tickLine={false}
                    />
                  <Bar
                    dataKey="count"
                    barSize={20}
                    background={{ fill: "#EAF1FF" }}
                    radius={[10,10,10,10]}
                    >
                    {salaryGrade.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#0A2B91" radius={[10,10,10,10]} /> 
                    ))}
                    {/* <LabelList dataKey="count" position="right" fill="#000" fontSize={14} /> */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>: null }

        </div>
        ) : (
          <>
          <div className='flex gap-2'>
            
            <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
          
            {/* Order by */}
            <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle}/>
           
            {/* View changer */}
            <div className="flex items-center border border-disabled rounded-3xl overflow-hidden">
              {/* List View Button */}
              <button className="px-5 py-2 flex gap-2 cursor-pointer text-primary" onClick={() => {setViewStye('List')}}>
                <List className={`${viewStyle === 'List' ? 'text-primary' : 'text-disabled'}`} />
              </button>
              <div className="h-6 w-px bg-disabled"></div>
              {/* Grid View Button */}
              <button className="px-5 py-2 flex gap-2 cursor-pointer text-disabled" onClick={() => {setViewStye('Grid')}}>
                <LayoutGrid className={`${viewStyle === 'Grid' ? 'text-primary' : 'text-disabled'}`} />
              </button>
            </div>
            {/* Page */}
            <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
              <MoveLeft className='cursor-pointer' onClick={() => {}}/>
                <p> Page </p>
                <input
                  type="text"
                  value={page}
                  onChange={() => {}}
                  className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
                />
              <p>of {totalPages}</p>
              <MoveRight className='cursor-pointer' onClick={() => {}}/>
            </div>
          </div>
          <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto'>
            <UsersTable data={industryUsers}/>
          </div>
          </>
        )}
      </div>
    </div>
    )
  }
  
  export default AdminIndustryInformation
  