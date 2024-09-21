import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const SideBarItem = ({ id, imgUrl, name }) => {
  const params = useParams();
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/servers/${id}`);
  };
  return (
    <div
      data-tooltip-id={id}
      data-tooltip-content={name}
      data-tooltip-place="right"
    >
      <button
        onClick={handleNavigation}
        className="group relative flex items-center"
      >
        <div
          className={`absolute left-0 bg-white rounded-r-full transition-all w-1 ${
            params?.serverId !== id && "group-hover:h-[20px]"
          } 
          ${params?.serverId === id ? "h-[48px]" : "h-[8px]"}`}
        />
        <div
          className={` relative group flex mx-3 h-[48px] w-[48px] rounded-3xl group-hover:rounded-xl transition duration-500 ease-linear cursor-pointer overflow-hidden ${
            params?.serverId === id && "text-white rounded-xl"
          }`}
        >
          <img src={imgUrl} alt="Server" />
        </div>
      </button>
      <Tooltip
        id={id}
        className="font-semibold z-[100]"
        style={{ backgroundColor: "#111214", color: "#fff" }}
      />
    </div>
  );
};

export default SideBarItem;
