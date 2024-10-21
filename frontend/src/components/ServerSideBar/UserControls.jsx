import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphonesFilled, TbHeadphonesOff } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import useModal from "../../hooks/useModal";
import EditUserModal from "../Modal/EditUser";
import { useSelector } from "react-redux";


const UserControls = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [micOn, setMicOn] = useState(true);
  const [headphonesOn, setHeadphonesOn] = useState(true);
  const { isOpenModal: isOpenEditUser, toggleModal: toggleEditUser } = useModal();

  const handleMicToggle = () => {
    if (!headphonesOn) {
      setHeadphonesOn(true);
    }
    setMicOn(!micOn);
  };

  const handleHeadphonesToggle = () => {
    if (headphonesOn) {
      setMicOn(false);
    }
    setHeadphonesOn(!headphonesOn);
  };

  return (
    <div className="px-2 py-3 flex items-center justify-between bg-[#232428]">
      <div className="flex flex-row items-center gap-2">
        <img
          src={currentUser.avatar_url}
          alt="avatarUser"
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-sm">{currentUser.username}</h2>
          <p className="text-green text-xs">Online</p>
        </div>
      </div>
      <div className="">
        <button
          onClick={handleMicToggle}
          className="p-1.5 hover:bg-zinc-700 rounded"
          data-tooltip-id="microphone"
          data-tooltip-content={
            micOn ? "Turn Off Microphone" : "Turn On Microphone"
          }
          data-tooltip-place="top"
        >
          {micOn ? (
            <FaMicrophone size={18} className="text-zinc-300" />
          ) : (
            <FaMicrophoneSlash size={20} className="text-red-500" />
          )}
        </button>
        <button
          onClick={handleHeadphonesToggle}
          className="p-1.5 hover:bg-zinc-700 rounded"
          data-tooltip-id="headphone"
          data-tooltip-content={headphonesOn ? "Deafen" : "Undeafen"}
          data-tooltip-place="top"
        >
          {headphonesOn ? (
            <TbHeadphonesFilled size={22} className="text-zinc-300" />
          ) : (
            <TbHeadphonesOff size={22} className="text-red-500" />
          )}
        </button>
        <button
          onClick={toggleEditUser}
          className="p-1.5 hover:bg-zinc-700 rounded"
          data-tooltip-id="setting"
          data-tooltip-content="User Settings"
          data-tooltip-place="top"
        >
          <IoMdSettings size={20} className="text-zinc-300" />
        </button>
        <Tooltip
          id="microphone"
          className="text-xs"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <Tooltip
          id="headphone"
          className="text-xs"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <Tooltip
          id="setting"
          className="text-xs"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
      </div>
        {isOpenEditUser && (
        <EditUserModal
          toggleModal={toggleEditUser} 
          user={currentUser}         
        />
        )}
    </div>
  );
};

export default UserControls;
