import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import PendingInvites from "./PendingInvites";
import AddFriends from "./AddFriends";
import AllFriends from "./AllFriends";

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState("friends");

  return (
    <div className="bg-primary-1 h-screen text-zinc-300">
      <header className="flex items-center text-sm font-semibold px-5 justify-between h-12 border-neutral-800 border-b-2">
        <div className="flex items-center gap-8 py-1 group">
          <div className="flex items-center gap-1">
            <FaUserFriends size={26} />
            <div>Friends</div>
          </div>
          <button
            className="cursor-pointer"
            onClick={() => setActiveComponent("friends")}
          >
            All
          </button>
          <button
            className="cursor-pointer"
            onClick={() => setActiveComponent("pendingInvites")}
          >
            Pending Invite
          </button>
          <button
            className="p-1 rounded-md flex items-center group gap-x-1 hover:bg-green/50 transition mb-1 cursor-pointer bg-green"
            onClick={() => setActiveComponent("addFriends")}
          >
            Add Friends
          </button>
        </div>
      </header>
      <main>
        {activeComponent === "pendingInvites" ? (
          <PendingInvites />
        ) : activeComponent === "addFriends" ? (
          <AddFriends />
        ) : (
          <AllFriends setActiveComponent={setActiveComponent}/>
        )}
      </main>
    </div>
  );
};

export default HomePage;
