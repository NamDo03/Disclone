import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiHashBold } from "react-icons/pi";
import { PiMagnifyingGlass } from "react-icons/pi";
import { listfriend } from "../../fakeApi";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

const InviteMember = ({ toggleModal }) => {
  const { serverId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const filteredFriends = listfriend.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCopy = () => {
    navigator.clipboard.writeText(`${FRONTEND_URL}/invite/${serverId}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="w-[500px] flex flex-col">
        <div className="w-full bg-primary-1 rounded-t-md">
          <div className="p-4 rounded-t-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-zinc-200">
                Invite friends to join your server
              </h2>
              <button
                onClick={toggleModal}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div>
              <div
                className={` flex items-center py-[3px] rounded-[4px] my-3 bg-zinc-700":"bg-primary-2"}`}
              >
                <PiHashBold size={20} className="text-zinc-400" />
                <p className="text-zinc-400 text-xs ml-2">Channel name</p>
              </div>
              <div className="flex items-center relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  className="w-full bg-primary-3 py-2 rounded-sm px-3 outline-none"
                  placeholder="Search for friends"
                />
                <PiMagnifyingGlass
                  size={24}
                  className="text-zinc-400 absolute right-2"
                />
              </div>
            </div>
          </div>
          <div className="h-[1px] mt-5 bg-zinc-900" />
          <div className="m-4 overflow-y-auto max-h-[200px]">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center px-2 py-1 group hover:bg-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-9 h-9 object-cover rounded-full"
                      src={friend.avatarUrl}
                      alt={friend.username}
                    />
                    <p className="text-zinc-300">{friend.username}</p>
                  </div>
                  <button className="border border-green px-4 py-2 rounded-[4px] hover:bg-green group-hover:bg-green text-white">
                    Invite
                  </button>
                </div>
              ))
            ) : (
              <div className="text-zinc-400 text-center h-[200px] flex items-center justify-center uppercase font-semibold">
                No results found
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-primary-2 rounded-b-md p-4">
          <h2 className=" uppercase text-zinc-300 font-semibold text-xs">
            Or, send a server invite link to a friend
          </h2>
          <div className="w-full bg-primary-3 flex p-1 items-center justify-between mt-3">
            <input
              className="bg-transparent text-white border-none focus:outline-none focus:ring-0 px-2"
              value={`${FRONTEND_URL}/invite/${serverId}`}
              readOnly
              onChange={() => {}}
            />
            <button
              onClick={handleCopy}
              className={` py-2 px-5 text-white text-sm font-semibold rounded-sm ${
                copied
                  ? "bg-green hover:bg-green/85"
                  : "bg-main hover:bg-main/85"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default InviteMember;
