import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobOverviewCard from "./jobcomponent/joboverview";
import JobSectionHeader from "./jobcomponent/jobsectionheader";
import BackButton from "../../../components/backbutton";
import axios from "axios";

function InterestedUsers() {
  const did  = useParams();
  const id = did.jobid;
  console.log(id);
    //const id = "f7a09e35-1e12-4214-9bda-5c87de635416"; // temporary hardcoded ID
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [jobOverview, setJobOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const page = 1;
        console.log("hdsd",id);
        const response = await axios.get(`${API_BASE_URL}/job/interested_in/${id}?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        const data = response.data;
        console.log("Interested Users Data:", data.results); // Debugging line
        if (data.detail) {
          setError(data.detail); // Show message like "No users found who are interested in this job posting."
          setInterestedUsers([]); // Clear the list
        } else {
          setInterestedUsers(data.results); // Proceed normally
          console.log("ankue");
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized access. Please log in.");
          } else if (err.response.status === 404) {
            setError("No users found who are interested in this job posting.");
          } else {
            setError("Failed to fetch interested users.");
          }
        } else {
          setError(err.message || "Network error.");
        }
      } finally {
        setLoading(false);
      }
      
    };
    const fetchJobOverview = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/job/overview/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) throw new Error("Failed to fetch job overview");
    
        const data = await response.json();
        console.log("Job Overview Data:", data); // Debugging line
        setJobOverview(data);
      } catch (err) {
        console.error("Job Overview Fetch Error:", err);
      }
    };
    
    fetchJobOverview();
    

    fetchInterestedUsers();
  }, [id, token]);

    console.log("Idddnterested Users:", interestedUsers); 
    console.log(loading);
    console.log(error);// Debugging line
  return (
    <div className="w-full max-w-[1100px] mx-auto p-4">
      <div className="sm:pl-12">
      <BackButton label="Back" />
      </div>

      <JobSectionHeader title="Interested Users" />

      {jobOverview && <JobOverviewCard overview={jobOverview} />}


      {/* Content */}
      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-primary font-satoshi-bold mt-4 justify-center text-center">{error}</p>}

      {/* Large screen table */}
      {!loading && !error && interestedUsers.length > 0 && (
        <>
          {/* Table View (lg and up) */}
          <div className="hidden lg:block overflow-auto mt-4">
  <div className="max-w-[1100px] mx-auto bg-whitey rounded-[10px] shadow border border-disabled p-4">
    <table className="w-full max-w-5xl mx-auto text-sm text-left text-black">

      <thead className=" text-[13px] text-primary uppercase font-satoshi-bold">
        <tr>
          <th className="px-4 py-5">Name</th>
          <th className="px-4 py-5">Batch</th>
          <th className="px-4 py-5">Base Location</th>
          <th className="px-4 py-5">Job Title</th>
          <th className="px-4 py-5">Industry</th>
          <th className="px-4 py-5">Interested On</th>
        </tr>
      </thead>
      <tbody>
        {interestedUsers.map((user, idx) => (
          <tr key={idx} className=" hover:bg-gray-50">
            <td className="px-4 py-3 flex items-center gap-3">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="font-satoshi-bold text-black">{user.name}</span>
            </td>
            <td className="px-4 py-3 font-satoshi-medium">{user.batch}</td>
<td className="px-4 py-3 font-satoshi-medium">{user.location}</td>
<td className="px-4 py-3 font-satoshi-medium">{user.title}</td>
<td className="px-4 py-3 font-satoshi-medium">{user.industry || "—"}</td>
<td className="px-4 py-3 font-satoshi-medium">{user.date_of_interest}</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


          {/* Card View (mobile) */}
          <div className="block lg:hidden space-y-4 mt-4">
            {interestedUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-4 p-2 ">
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-satoshi-black text-black text-[16px]">{user.name}</p>
                  <p className="text-[12px] text-black font-satoshi-medium">Class of {user.batch}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default InterestedUsers;
