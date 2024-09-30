import React from "react";

const MemberItem = ({ member }) => {
  return (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-zinc-700/50 rounded-md cursor-pointer">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-9 h-9 object-cover rounded-full"
      />
      <h2 className="text-sm font-semibold">{member.name}</h2>
    </div>
  );
};

export default MemberItem;
