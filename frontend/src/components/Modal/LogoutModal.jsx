import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../../redux/userSlice";

const LogoutModal = ({ toggleModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout());
    navigate("/sign-in");
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="max-w-[400px] w-full bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-zinc-200">Logout</h2>
            <button
              onClick={toggleModal}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <IoClose size={24} />
            </button>
          </div>
          <p className="text-zinc-400 text-center text-lg mt-4 mb-5">
            Are you sure want to log out?
          </p>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <div
            onClick={toggleModal}
            className="hover:underline px-4 py-1 text-sm cursor-pointer"
          >
            Cancel
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-1 rounded-sm cursor-pointer hover:bg-red-1/85"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
