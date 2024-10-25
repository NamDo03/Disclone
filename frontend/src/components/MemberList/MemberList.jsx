import React from "react";
import MemberItem from "./MemberItem";
import { deleteMember } from "../../api/serverService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MemberList = ({ owner, members, onMemberDeleted }) => {
  const { serverId } = useParams();
  const handleDeleteMember = async (userId) => {
    try {
      const result = await deleteMember(serverId, userId);
      toast.success(result.message);
      onMemberDeleted(userId);
    } catch (error) {
      toast.error(error.message);
    }
  };
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
            onDelete={handleDeleteMember}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
