import React from "react";
import NotFondSvg from "../assets/404.svg";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-cyan-800">
        Page Not Found
      </h1>
      <img src={NotFondSvg} alt="404" className="max-w-[800px] w-[100%]" />
      <div className="flex gap-2 text-gray-600 capitalize items-center">
        back to home page
        <button
          className="text-cyan-700 font-medium hover:text-cyan-600 hover:underline"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
