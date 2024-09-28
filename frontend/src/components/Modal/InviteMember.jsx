import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiHashBold } from "react-icons/pi";
import { PiMagnifyingGlass } from "react-icons/pi";
import { listfriend } from "../../fakeApi";

const InviteMember = ({ toggleModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFriends = listfriend.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="max-w-[500px] w-full bg-primary-1 rounded-md min-w-[400px]">
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
                <button className="border border-green px-4 py-2 rounded-[4px] hover:bg-green group-hover:bg-green">
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
    </div>
  );
};

export default InviteMember;
