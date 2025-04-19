import React from "react";
//invokes when link entered is not within the route
const Unauthorized = () => {
  return (
    <div className="flex h-max justify-center items-center">
      <div className="text-center">
        <img className="h-40 m-auto self-center mt-10" src="https://static.vecteezy.com/system/resources/thumbnails/012/042/292/small/warning-sign-icon-transparent-background-free-png.png" />
      <h1 className="font-bold text-4xl my-6 text-red-800">Unauthorized!</h1>
      <p className="text-lg font-semibold">You do not have permission to view this page.</p>
      <p className="text-base">Either sign in using a different account or contact the developers if you think this is a mistake. </p>
      </div>
    </div>
  );
};

export default Unauthorized;