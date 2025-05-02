import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Check, ShieldAlert, MapPin, Phone, IdCard, GraduationCap, X, CheckCircle } from "lucide-react";
import axios from "axios";
import CircularLoading from "../../../components/LoadingComponents/circularloading";
import AdminBack from "../../../components/AdminComponents/AdminBack";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AdminUserDetails() {
  const navigate = useNavigate();
  const { userid } = useParams();
  const [loading, setLoading] = useState(true);
  const [limitAccessLoading, setLimitAccessLoading] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [makeAlumniLoading, setMakeAlumniLoading] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    age: null,
    gender: "",
    city: "",
    state: "",
    country: "",
    marital_status: "",
    image: null,
    user_type: "",
    position: null,
    is_banned: false,
    student_number: "",
    standing: null,
    graduation_year: null,
    graduation_semester: "",
    employment_status: "",
    industry: null,
    company_name: null,
    job_title: null,
    work_location: null,
    work_mode: null,
    employer_class: null,
    tenured_status: null,
    salary_grade: null,
    facebook: null,
    linkedin: null,
    github: null,
    created_at: "",
    updated_at: "",
    skills: [],
    scholarships: [],
    affiliations: [],
  });
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        navigate("/admin/login");
        return;
      }

      if (!userid) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch user details and reports concurrently
        const [userResponse, reportsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/profile/${userid}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/admin/report-logs/${userid}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = userResponse.data.data || {};
        const reportsData = reportsResponse.data || [];
        console.log(userResponse.data.data)
        setUser({
          user_id: userData.user_id || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          mobile_number: userData.mobile_number || "",
          age: userData.age || null,
          gender: userData.gender || "",
          city: userData.city || "",
          state: userData.state || "",
          country: userData.country || "",
          marital_status: userData.marital_status || "",
          image: userData.image || null,
          user_type: userData.user_type || "",
          position: userData.position || null,
          is_banned: userData.is_banned || false,
          student_number: userData.student_number || "",
          standing: userData.standing || null,
          graduation_year: userData.graduation_year || null,
          graduation_semester: userData.graduation_semester || "",
          employment_status: userData.employment_status || "",
          industry: userData.industry || null,
          company_name: userData.company_name || null,
          job_title: userData.job_title || null,
          work_location: userData.work_location || null,
          work_mode: userData.work_mode || null,
          employer_class: userData.employer_class || null,
          tenured_status: userData.tenured_status || null,
          salary_grade: userData.salary_grade || null,
          facebook: userData.facebook || null,
          linkedin: userData.linkedin || null,
          github: userData.github || null,
          created_at: userData.created_at || "",
          updated_at: userData.updated_at || "",
          skills: userData.skills || [],
          scholarships: userData.scholarships || [],
          affiliations: userData.affiliations || [],
        });
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [userid, token, navigate]);

  async function makeAlumni() {
    setMakeAlumniLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/admin/transition/${userid}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransitionComplete(true);
    } catch (error) {
      console.error("Error transitioning to alumni:", error);
      setError("Failed to transition to alumni");
    } finally {
      setMakeAlumniLoading(false);
    }
  }

  async function limitAccountAccess() {
    setLimitAccessLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/admin/ban/${userid}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, is_banned: true }));
    } catch (error) {
      console.error("Error limiting account access:", error);
      setError("Failed to limit account access");
    } finally {
      setLimitAccessLoading(false);
      setShowReportsModal(false);
    }
  }

  return (
    loading ? (
      <div className="flex items-center justify-center h-screen">
        <CircularLoading size={90} />
      </div>
    ) : error ? (
      <div className="text-red-500 font-satoshi-medium text-center p-6">{error}</div>
    ) : (
      <div className="p-6 overflow-auto max-h-screen">
        {/* Back */}
        <AdminBack label={'Back'} />
        {/* Records and confirmation button */}
        <div className="flex lg:justify-between justify-end items-center mb-5">
          <h1 className="text-primary font-satoshi-bold text-5xl hidden lg:block">Records</h1>
          {user.user_type === "student" ? (
            <button
              className="flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer"
              onClick={() => setShowAlumniModal(true)}
            >
              <Check className="" size={20} />
              <p>Make Alumni</p>
            </button>
          ) : null}
        </div>
        {/* Basic information */}
        <div className="flex flex-row border border-gray-300 rounded-xl w-full p-6 mb-6">
          <div className="bg-primary rounded-full h-30 w-30 overflow-hidden">
            <img src={user.image} alt="" className="object-cover w-full" />
          </div>
          <div className="flex flex-col justify-center ml-8">
            <h2 className="font-satoshi-bold text-2xl">{`${user.first_name} ${user.last_name}`}</h2>
            <p className="font-satoshi-light">{user.email}</p>
          </div>
          <button
            className="hidden lg:flex flex-row gap-2 ml-auto text-error font-satoshi-medium cursor-pointer"
            onClick={() => setShowReportsModal(true)}
          >
            <p className="hidden lg:block">View Report Logs</p>
            <ShieldAlert />
          </button>
        </div>
        {/* Personal information */}
        <h2 className="font-satoshi-medium text-xl">PERSONAL INFORMATION</h2>
        <div className="border-t border-gray-300 grid gap-y-5 grid-cols-2 lg:flex flex-row justify-between text-lg py-5 w-full mb-5">
          {/* Personal information cards */}
          {/* Location */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <MapPin className='text-primary' />
              <h3 className="font-satoshi-light ml-1">Location</h3>
            </div>
            <h3 className="font-satoshi-medium ml-7">{user.city && user.country ? `${user.city}, ${user.country}` : "N/A"}</h3>          </div>
          {/* Mobile Number */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <Phone className="text-primary"/>
              <h3 className="font-satoshi-light ml-1">Mobile Number</h3>
            </div>
            <h3 className="font-satoshi-medium ml-7">{user.mobile_number || "N/A"}</h3>
          </div>
          {/* Student Number */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <IdCard className='text-primary'/>
              <h3 className="font-satoshi-light ml-1">Student Number</h3>
            </div>
            <h3 className="font-satoshi-medium ml-7">{user.student_number || "N/A"}</h3>
          </div>
          {/* Graduating Class */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <GraduationCap className='text-primary'/>
              <h3 className="font-satoshi-light ml-1">Graduating Class</h3>
            </div>
            <h3 className="font-satoshi-medium ml-7">
              {user.graduation_year && user.graduation_semester
                ? `${user.graduation_year} ${user.graduation_semester}`
                : "N/A"}
            </h3>
          </div>
        </div>
        {/* SKILLS AND INTERESTS */}
        <h2 className="font-satoshi-medium text-xl">SKILLS AND INTERESTS</h2>
        <div className="border-t border-gray-300 flex flex-row flex-wrap gap-3 py-5 mb-5">
          {user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <div key={index} className="rounded-4xl p-2 border-2 w-fit border-black">
                <p className="font-satoshi-medium lg:text-md text-sm whitespace-nowrap">{skill}</p>
              </div>
            ))
          ) : (
            <p className="font-satoshi-light">No skills listed</p>
          )}
        </div>
        {/* AFFILIATIONS */}
        <h2 className="font-satoshi-medium text-xl">AFFILIATIONS</h2>
        <div className="border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5">
          {user.affiliations.length > 0 ? (
            user.affiliations.map((affiliation, index) => (
              <div key={index} className="">
                <p className="font-satoshi-medium">{affiliation.organization || "N/A"}</p>
                <p className="font-satoshi-light">{affiliation.role || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="font-satoshi-light">No affiliations listed</p>
          )}
        </div>
        {/* SCHOLARSHIPS */}
        <h2 className="font-satoshi-medium text-xl">SCHOLARSHIPS</h2>
        <div className="border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5">
          {user.scholarships.length > 0 ? (
            user.scholarships.map((scholarship, index) => (
              <div key={index} className="">
                <p className="font-satoshi-medium">{scholarship || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="font-satoshi-light">No scholarships listed</p>
          )}
        </div>
        {/* Report Logs Modal */}
        {showReportsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg min-w-xl max-w-xl h-2/5">
              {/* Modal Header */}
              <div className="flex justify-between w-full items-center pb-2">
                <h2 className="text-2xl font-satoshi-medium">Report Logs</h2>
                <button
                  className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => setShowReportsModal(false)}
                >
                  <X className="w-7 h-7 text-error" />
                </button>
              </div>
              {/* Report Table */}
              {reports.length > 0 ? (
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
                          <tr key={index} className="font-satoshi-regular h-10">
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.report_date || "N/A"}
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.report_time || "N/A"}
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                              {report.reason || "N/A"}
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
                      onClick={limitAccountAccess}
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
            </div>
          </div>
        )}
        {/* Graduation loading */}
        {showAlumniModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
              {/* Loading Spinner */}
              {makeAlumniLoading ? (
                <div className="h-full">
                  <CircularLoading />
                </div>
              ) : transitionComplete ? (
                <>
                  <div className="text-success">
                    <CheckCircle size={48} />
                  </div>
                  <p className="text-xl font-satoshi-medium mt-4 text-center">
                    Transition to Alumni Successful!
                  </p>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                    onClick={() => {
                      setShowAlumniModal(false);
                      setTransitionComplete(false);
                      window.location.reload();
                    }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="">
                  <p className="text-xl font-satoshi-medium text-center mt-4">
                    Confirm transition to Alumni?
                  </p>
                  <div className="flex gap-3 mt-6 w-full h-full justify-center">
                    <button
                      className="bg-gray-300 text-black px-4 py-2 rounded-3xl w-full cursor-pointer"
                      onClick={() => setShowAlumniModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-success text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                      onClick={makeAlumni}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default AdminUserDetails;