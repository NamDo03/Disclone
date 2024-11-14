import React, { useState } from "react";
import img from "../assets/bg.webp";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { login } from "../api/authService";
import Cookies from "js-cookie";

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.userEmail || "");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";

  const handleSignin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await login(email, password);
      Cookies.set("token", data.token, {
        expires: 2 / 24,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
      dispatch(loginSuccess(data.user));
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Failed to signin: " + err.message);
      dispatch(loginFailure());
    }
  };

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
                autoComplete="current-password"
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
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="bg-main rounded p-3 w-full my-3 text-white hover:opacity-65"
              >
                Sign In
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
