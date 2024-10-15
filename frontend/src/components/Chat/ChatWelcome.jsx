import React from "react";
import { PiHashBold } from "react-icons/pi";

const ChatWelcome = ({ type, name }) => {
  return (
    <div className=" space-y-2 px-4 mb-4">
      {type === "TEXT" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-700 flex items-center justify-center">
          <PiHashBold size={50} className="text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "TEXT" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-zinc-400 text-sm">
        {type === "TEXT"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;
