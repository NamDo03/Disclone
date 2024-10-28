import React, { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { editUsername, editUserPassword } from "../../api/userService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUsername } from "../../redux/userSlice";

const EditInfo = ({ type, toggleModal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (type.toLowerCase() === "username") {
      setName(value);
    } else {
      setNewPassword(value);
    }
  };

  const handleEditUser = async () => {
    setLoading(true);
    try {
      if (type.toLowerCase() === "username") {
        const newUsername = await editUsername(currentUser.id, name, password);
        dispatch(updateUsername(newUsername.user.username));
        toast.success("Username updated successfully");
      } else if (type.toLowerCase() === "new password") {
        await editUserPassword(currentUser.id, newPassword, password);
        toast.success("Password updated successfully");
      }
      toggleModal();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]">
      <div className="min-w-[450px] max-w-[580px] bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-zinc-200 font-semibold capitalize">
              Edit {type}
            </h2>
            <button
              className="text-zinc-400 hover:text-zinc-200 flex justify-end items-center"
              onClick={toggleModal}
            >
              <IoClose size={24} />
            </button>
          </div>

          <form>
            <div className="py-5 flex-col flex gap-6">
              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor="input"
                  className="uppercase text-xs font-bold text-zinc-400"
                >
                  {type}
                </label>
                <input
                  id="input"
                  type={type.toLowerCase() === "username" ? "text" : "password"}
                  value={type.toLowerCase() === "username" ? name : newPassword}
                  onChange={handleInputChange}
                  className={`bg-primary-3/80 py-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-300 outline-none rounded
                        ${type.toLowerCase() === "channel" ? "pl-8" : "px-3"}
                        `}
                  placeholder={`Enter ${type} `}
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor="input"
                  className="uppercase text-xs font-bold text-zinc-400"
                >
                  Current Password
                </label>
                <input
                  id="input"
                  type="password"
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-primary-3/80 py-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-300 outline-none rounded px-3`}
                  placeholder={`Enter current password `}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <div
            onClick={toggleModal}
            className="hover:underline px-4 py-1 text-sm cursor-pointer"
          >
            Cancel
          </div>
          <button
            onClick={handleEditUser}
            className={`px-8 py-3 rounded font-semibold text-sm ${
              password &&
              (type.toLowerCase() === "username" ? name : newPassword)
                ? "bg-main cursor-pointer hover:bg-main/85 text-white"
                : "bg-main/50 cursor-not-allowed text-zinc-400"
            } 
                ${loading && "bg-main/50 cursor-not-allowed text-zinc-400"}
                `}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default EditInfo;
