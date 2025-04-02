import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

function Root() {
  const user = {
    id: 123,
    type: "alumni",
  };

  return (
    <div>

{user.type !== "admin" && (<Navbar user={user} />)}
      <Outlet context={user} />
    </div>
  );
}

export default Root;
