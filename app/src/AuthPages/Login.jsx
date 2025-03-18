import React from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    sessionStorage.setItem("User", JSON.stringify({ type: "user" }));
    setIsAuthenticated(true);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container max-w-md p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold text-blue-500">Login</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
