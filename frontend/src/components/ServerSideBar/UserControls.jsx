import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphonesFilled, TbHeadphonesOff } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { Tooltip } from "react-tooltip";

const UserControls = () => {
  const [micOn, setMicOn] = useState(true);
  const [headphonesOn, setHeadphonesOn] = useState(true);

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
  console.log("Mic:" + micOn + " headphone:" + headphonesOn);

  return (
    <div className="px-2 py-3 flex items-center justify-between bg-[#232428]">
      <div className="flex flex-row items-center gap-2">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcysrRmAGo9RR1jbOv2vyOU1KD-PRqHjXjLQ&s "
          alt="avatarUser"
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-sm">Namdo</h2>
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
          className="p-1.5 hover:bg-zinc-700 rounded"
          data-tooltip-id="setting"
          data-tooltip-content="User Settings"
          data-tooltip-place="top"
        >
          <IoMdSettings size={20} className="text-zinc-300" />
        </button>
        <Tooltip
          id="microphone"
          className="text-xs z-[100]"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <Tooltip
          id="headphone"
          className="text-xs z-[100]"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <Tooltip
          id="setting"
          className="text-xs z-[100]"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
      </div>
    </div>
  );
};

export default UserControls;
