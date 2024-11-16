import React from "react";
import { PiHashBold } from "react-icons/pi";
import { BsPeopleFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

const ChatHeader = ({ type, name, showMemberList, onToggleMemberList }) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center justify-between h-12 border-neutral-800 border-b-2">
      <div className="flex gap-2 items-center">
        {(type === "TEXT" || type === "DM") && (
          <PiHashBold className="w-5 h-5 text-zinc-400" />
        )}
        <p className="text-zinc-200 text-md font-semibold">{name}</p>
      </div>
      {type !== "DM" && (
        <BsPeopleFill
          data-tooltip-id="memberlist"
          data-tooltip-content={
            showMemberList ? "Show Member List" : "Hide Member List"
          }
          data-tooltip-place="bottom"
          size={22}
          className="text-zinc-200 cursor-pointer hover:text-white outline-none"
          onClick={onToggleMemberList}
        />
      )}
      <Tooltip
        id="memberlist"
        style={{
          backgroundColor: "#111214",
          color: "#fff",
          fontSize: "12px",
        }}
      />
    </div>
  );
};

export default ChatHeader;
