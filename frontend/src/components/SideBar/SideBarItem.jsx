import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const SideBarItem = ({ serverId, imgUrl, name, channels }) => {
  const params = useParams();
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/servers/${serverId}/channels/${channels.id}`);
  };
  return (
    <div
      data-tooltip-id={String(serverId)}
      data-tooltip-content={typeof name === "string" ? name : ""}
      data-tooltip-place="right"
    >
      <button
        onClick={handleNavigation}
        className="group relative flex items-center"
      >
        <div
          className={`absolute left-0 bg-white rounded-r-full transition-all w-1 ${
            Number(params?.serverId) !== serverId && "group-hover:h-[20px]"
          } 
          ${Number(params?.serverId) === serverId ? "h-[48px]" : "h-[8px]"}`}
        />
        <div
          className={` relative group flex mx-3 h-[48px] w-[48px] rounded-3xl group-hover:rounded-xl transition duration-500 ease-linear cursor-pointer overflow-hidden ${
            Number(params?.serverId) === serverId && "text-white rounded-xl"
          }`}
        >
          <img src={imgUrl} alt="Server" className="object-cover" />
        </div>
      </button>
      <Tooltip
        id={String(serverId)}
        className="font-semibold"
        style={{ backgroundColor: "#111214", color: "#fff" }}
      />
    </div>
  );
};

export default SideBarItem;
