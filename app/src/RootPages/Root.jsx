import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Root() {
  const token = localStorage.getItem("token");
  const [google,setGoogle] = useState(null);
  import.meta.env.VITE_BACKEND_URL;

  let tokentype = "guest";
  let verified = null;
  let banned = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      tokentype = decoded.role || "guest";
      verified = decoded.is_verified || null;
      banned = decoded.is_banned || null;
      console.log("Decoded token type:", tokentype);
    } catch (error) {
      console.error("Invalid token:", error);
      tokentype = "guest";
    }
  }

  useEffect(() => {
    const checkPasswordNull = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-password-null`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGoogle(response.data); // adjust based on your response structure
      } catch (error) {
        console.error("Error checking password null:", error);
      }
    };

    checkPasswordNull();
  }, []);

  return (
    <div>
      {["alumni", "student","guest"].includes(tokentype) && (
        <Navbar tokentype={tokentype} verified={verified} banned={banned} google={google} />
      )}
      <Outlet context={tokentype} />
    </div>
  );
}

export default Root;
