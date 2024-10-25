import React from "react";
import MemberItem from "./MemberItem";
import { deleteMember } from "../../api/serverService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MemberList = ({ members, onMemberDeleted }) => {
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
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
