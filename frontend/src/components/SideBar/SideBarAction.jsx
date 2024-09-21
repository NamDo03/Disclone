import React from "react";
import { Tooltip } from "react-tooltip";

const SideBarAction = ({
  name,
  content,
  bgColor,
  textColor,
  Icon,
  handleAction,
}) => {
  return (
    <div
      data-tooltip-id={name}
      data-tooltip-content={content}
      data-tooltip-place="right"
    >
      <button onClick={handleAction} className="group flex items-center">
        <div
          className={`flex mx-3 h-[48px] w-[48px] rounded-3xl group-hover:rounded-xl transition duration-500 ease-linear cursor-pointer overflow-hidden items-center justify-center bg-primary-1 ${
            bgColor ? bgColor : "group-hover:bg-green"
          } `}
        >
          {Icon && (
            <Icon
              size={25}
              className={`group-hover:text-white ${
                textColor ? textColor : "text-green"
              } transition`}
            />
          )}
        </div>
      </button>
      <Tooltip
        id={name}
        className="font-semibold"
        style={{ backgroundColor: "#111214", color: "#fff" }}
      />
    </div>
  );
};

export default SideBarAction;
