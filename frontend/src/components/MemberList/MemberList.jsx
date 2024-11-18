import React from "react";
import MemberItem from "./MemberItem";

const MemberList = ({ owner, members, onMemberDeleted }) => {
  return (
    <div className="pt-6 pl-4 pr-2">
      <h1 className="text-sm uppercase font-semibold text-zinc-400">Members</h1>
      <div className="flex flex-col mt-3">
        <div className="flex items-center gap-2 py-1 px-2 hover:bg-zinc-700/50 rounded-md cursor-pointer justify-between group ">
          <div className="flex items-center gap-2 ">
            <img
              src={owner.avatar_url}
              alt={owner.username}
              className="w-9 h-9 object-cover rounded-full"
            />
            <h2 className="text-sm font-semibold">{owner.username}</h2>
          </div>
        </div>
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member.user}
            onDelete={onMemberDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
