import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

const MemberItem = ({ member, onDelete  }) => {
  return (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-zinc-700/50 rounded-md cursor-pointer justify-between group ">
     <div className="flex items-center gap-2 ">
      <img
        src={member.avatar_url}
        alt={member.username}
        className="w-9 h-9 object-cover rounded-full"
      />
      <h2 className="text-sm font-semibold">{member.username}</h2>
      </div>
      <IoIosCloseCircle  onClick={() => onDelete(member.id)} className="cursor-pointer transition text-zinc-300 hover:text-zinc-100 border-0 hidden group-hover:block" size={24}/>
    </div>
  );
};

export default MemberItem;
