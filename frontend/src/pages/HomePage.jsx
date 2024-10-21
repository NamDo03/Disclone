import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { PiMagnifyingGlass } from "react-icons/pi";
import { IoChatbubbleSharp } from "react-icons/io5";
import { listfriend } from "../fakeApi";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFriends = listfriend.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-primary-1 h-screen text-zinc-300">
      <div>
        <section className="flex items-center text-sm font-semibold px-5 justify-between h-12 border-neutral-800 border-b-2">
          <div className="flex items-center gap-8 py-1 group">
            <div className="flex items-center gap-1">
              <FaUserFriends size={26} />
              <div>Friends</div>
            </div>
            <div className="cursor-pointer">Pending Invite</div>
            <div className="p-1 rounded-md flex items-center group gap-x-1 hover:bg-green/50 transition mb-1 cursor-pointer bg-green">
              Add Friends
            </div>
          </div>
        </section>
      </div>
      <div>
        <div className="flex items-center pl-10 pt-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="bg-primary-3 py-2 rounded-md px-3 outline-none"
            placeholder="Search for friends"
          />
          <PiMagnifyingGlass
            size={24}
            className="text-zinc-400 absolute ml-[200px]"
          />
        </div>
        <div className="pl-10 pr-[300px]">
          <p className="text-zinc-400 text-md ml-2 mt-4">
            Total Friends - {filteredFriends.length}
          </p>
          <div className="h-[1px] mt-5 bg-zinc-500" />
          <div className=" overflow-y-auto">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center px-3 py-2 rounded-lg group hover:bg-zinc-700 "
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-9 h-9 object-cover rounded-full"
                      src={friend.avatarUrl}
                      alt={friend.username}
                    />
                    <p className="text-zinc-300">{friend.username}</p>
                  </div>
                  <button className="px-4 py-2 rounded-[16px] hover:bg-primary-3 text-white">
                    <IoChatbubbleSharp />
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
    </div>
  );
};

export default HomePage;
