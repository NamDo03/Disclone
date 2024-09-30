import React from "react";
import MemberItem from "./MemberItem";

const MemberList = ({ members }) => {
  return (
    <div className="pt-6 pl-4 pr-2">
      <h1 className="text-sm uppercase font-semibold text-zinc-400">Members</h1>
      <div className="flex flex-col mt-3">
        {members.map((member) => (
          <MemberItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
