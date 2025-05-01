import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";

function Root() {
  const token = localStorage.getItem("token");

  let tokentype = "guest";
  let verified = false;
  let banned = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      tokentype = decoded.role || "guest";
      verified = decoded.is_verified || false;
      banned = decoded.is_banned || false;
      console.log("Decoded token type:", tokentype);
    } catch (error) {
      console.error("Invalid token:", error);
      tokentype = "guest";
    }
  }

  return (
    <div>
      {["alumni", "student","guest"].includes(tokentype) && (
        <Navbar tokentype={tokentype} verified={verified} banned={banned} />
      )}
      <Outlet context={tokentype} />
    </div>
  );
}

export default Root;
