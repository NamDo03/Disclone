import React from "react";
import img from "../assets/bg.webp";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen w-screen">
      <img
        src={img}
        className="h-screen w-screen object-cover fixed top-0 left-0"
        alt=""
      />
      <div className="absolute min-h-[580px] h-full w-full flex items-center justify-center">
        <form className=" bg-primary-1 p-8 rounded min-w-[480px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <h1 className="text-white text-xl font-bold cursor-default text-center">
            Create an account
          </h1>
          <div className="flex flex-col mt-5 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-1 uppercase font-semibold text-xs">
                Email
              </label>
              <input
                type="email"
                className="p-2 rounded text-base border-none outline-none bg-primary-3 text-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-1 uppercase font-semibold text-xs">
                Username
              </label>
              <input
                type="text"
                className="p-2 rounded text-base border-none outline-none bg-primary-3 text-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-1 uppercase font-semibold text-xs">
                password
              </label>
              <input
                type="password"
                className="p-2 rounded text-base border-none outline-none bg-primary-3 text-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-main rounded p-3 w-full mt-3 text-white hover:opacity-65">
                Sign Up
              </button>
              <div className="">
                <button
                  onClick={() => navigate("/sign-in")}
                  className="text-blue-1 hover:underline cursor-pointer text-sm mt-2"
                >
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
