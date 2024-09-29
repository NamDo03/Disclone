import React, { useState } from "react";
import img from "../assets/bg.webp";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Wrong email or password")
        } else {
          const error = await res.json();
          throw new Error(error.message || "An error occurred while signing in")
        }
      }
      const data = await res.json()
      console.log(data.token)
    } catch (err) {
      toast.error("Failed to signin: "+ err.message);
    }
  }

  return (
    <div className="relative h-screen w-screen">
      <img
        src={img}
        className="h-screen w-screen object-cover fixed top-0 left-0"
        alt=""
      />
      <div className="absolute min-h-[580px] h-full w-full flex items-center justify-center">
        <form
          onSubmit={handleSignin}
          className=" bg-primary-1 p-8 rounded min-w-[480px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-white text-xl font-bold cursor-default">
              Welcome back!
            </h1>
            <div className="text-gray-2 cursor-default">
              We're so excited to see you again!
            </div>
          </div>
          <div className="flex flex-col mt-5 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-1 uppercase font-semibold text-xs">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 rounded text-base border-none outline-none bg-primary-3 text-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="bg-main rounded p-3 w-full my-3 text-white hover:opacity-65"
              >
                Sign In
              </button>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <button className="bg-main rounded p-3 w-full mt-3 text-white hover:opacity-65">
                Guest Mode
              </button>
              <div className="text-sm">
                <span className="text-gray-3 cursor-default">
                  Need an account? {"  "}
                </span>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="text-blue-1 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
