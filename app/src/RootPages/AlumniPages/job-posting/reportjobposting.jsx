// ReportJobPosting.jsx
import React from "react";

function ReportJobPosting (){

      useEffect(() => {
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
        
    

      }, [id, token]);
  return (
<div className="w-full max-w-[1100px] mx-auto p-4">
    </div>
  );
};

export default ReportJobPosting;
