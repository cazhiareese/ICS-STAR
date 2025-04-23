import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";

function Root() {

  //const User = localStorage.getItem("token");
  //const decoded = jwtDecode(User);
  const tokentype = "alumni";
  console.log("Decoded token typee:", tokentype);

  return (
    <div>

{["alumni", "student"].includes(tokentype) && (
  <Navbar tokentype={tokentype} />
)}

      <Outlet context={tokentype} />
    </div>
  );
}

export default Root;
