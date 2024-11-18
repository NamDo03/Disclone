import React, { useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { HiVideoCamera } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import useModal from "../../hooks/useModal";
import EditUserModal from "../Modal/EditUser";
import { useSelector } from "react-redux";
import { useCall } from "../../redux/callContext";
import { useLocation } from "react-router-dom";
import { StreamCall } from "@stream-io/video-react-sdk";
import { CustomToggleAudioPublishingButton } from "./CustomToggleAudioPublishingButton";
import { CustomToggleVideoPublishingButton } from "./CustomToggleVideoPublishingButton";

const UserControls = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isOpenModal: isOpenEditUser, toggleModal: toggleEditUser } =
    useModal();

  const location = useLocation();
  const { pathname } = location;
  const shouldFetchCallContext = pathname.match(
    /^\/servers\/\d+\/channels\/\d+$/
  );
  const { callVideo, setCallVideo } = useCall() || {};
  useEffect(() => {
    if (shouldFetchCallContext) {
      setCallVideo(callVideo);
    }
    setCallVideo(null);
  }, [pathname, shouldFetchCallContext, setCallVideo]);

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
      <div className="flex flex-row gap-2">
        {callVideo ? (
          <StreamCall call={callVideo}>
            <CustomToggleAudioPublishingButton />
            <CustomToggleVideoPublishingButton />
          </StreamCall>
        ) : (
          <>
            <button
              className="p-1.5 hover:bg-zinc-700 rounded"
              data-tooltip-id="microphone"
              data-tooltip-content={"You not in call yet"}
              data-tooltip-place="top"
            >
              <FaMicrophone size={18} className="text-zinc-300" />
            </button>
            <button
              className="p-1.5 hover:bg-zinc-700 rounded"
              data-tooltip-id="video"
              data-tooltip-content={"You not in call yet"}
              data-tooltip-place="top"
            >
              <HiVideoCamera size={22} className="text-zinc-300" />
            </button>
          </>
        )}
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
          id="video"
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
        <EditUserModal toggleModal={toggleEditUser} user={currentUser} />
      )}
    </div>
  );
};

export default UserControls;
