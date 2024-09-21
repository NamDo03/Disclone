import React from "react";
import { FaTrashCan, FaLock } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const ServerChannel = ({ name, Icon }) => {
  return (
    <div className="p-2 rounded-md flex items-center group gap-x-1 hover:bg-zinc-700/50 transition mb-1 cursor-pointer">
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-400" />
      <p className="line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">
        {name}
      </p>
      <div className="ml-auto flex items-center gap-x-2">
        <FiEdit
          data-tooltip-id="edit"
          data-tooltip-content="Edit"
          data-tooltip-place="top"
          className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition outline-none"
        />
        <Tooltip
          id="edit"
          className="font-semibold"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <FaTrashCan
          data-tooltip-id="delete"
          data-tooltip-content="Delete"
          data-tooltip-place="top"
          className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition outline-none"
        />
        <Tooltip
          id="delete"
          className="font-semibold"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
      </div>
    </div>
  );
};

export default ServerChannel;
