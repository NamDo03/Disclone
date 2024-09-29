import React from "react";
import { PiHashBold } from "react-icons/pi";

const ChatHeader = ({ type, name }) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-800 border-b-2">
      {type === "text" && <PiHashBold className="w-5 h-5 text-zinc-400 mr-2" />}
      <p className="text-white text-md font-semibold">{name}</p>
    </div>
  );
};

export default ChatHeader;
