import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

function Root() {
  const user = {
    id: 123,
    type: "admin",
  };

  return (
    <div>
      <Navbar user={user} />
      <Outlet context={user}></Outlet>

    </div>
  );
}

export default Root;
