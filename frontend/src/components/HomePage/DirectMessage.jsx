import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { PiMagnifyingGlass } from "react-icons/pi";
import UserControls from "../ServerSideBar/UserControls";
import { directMessages } from "../../fakeApi";
import DMList from "./DMList";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

const DirectMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const myId = "1";
  const participantsList = directMessages
    .map((conversation) => {
      return conversation.participants
        .filter((participant) => participant.id !== myId)
        .map((participant) => ({
          ...participant,
          conversationId: conversation.id,
        }));
    })

    .flat();
  const filteredParticipants = participantsList.filter((participant) =>
    participant.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hidden md:flex h-full w-60 z-30 flex-col fixed inset-y-0">
      <div className="flex flex-col bg-primary-2 h-full w-full text-white">
        <div className="bg-primary-2 h-12 border-neutral-900 border-b-2">
          <h1 className="font-semibold mx-4 my-3 text-lg">DISCLONE</h1>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex items-center px-2 py-2 relative">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="bg-primary-3 py-2 rounded-md px-3 outline-none w-full"
              placeholder="Search for friends"
            />
            <PiMagnifyingGlass
              size={24}
              className="text-zinc-400 absolute right-3"
            />
          </div>
          <div className="p-2 w-full">
            <button
              onClick={() => navigate("/")}
              className={`w-full flex items-center gap-4 py-2 px-5 rounded  hover:bg-zinc-700/50
              ${location.pathname === "/" && "bg-zinc-700 text-white"}`}
            >
              <FaUserFriends size={24} />
              Friends
            </button>
          </div>
          <div className="flex items-center justify-between py-3 px-3 cursor-pointer group ">
            <p className="flex items-center gap-1 text-xs uppercase font-semibold text-zinc-400 group-hover:text-zinc-300">
              Direct Messages
            </p>
            <button className="text-zinc-400 hover:text-zinc-300 ">
              <FaPlus />
            </button>
          </div>
          <div>
            <DMList listFriend={filteredParticipants} />
          </div>
        </div>
        <div className="mt-auto">
          <UserControls />
        </div>
      </div>
    </div>
  );
};

export default DirectMessage;
