import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import useModal from "../../hooks/useModal";
import DeleteModal from "../Modal/DeleteModal";
import useServerOwner from "../../hooks/useServerOwner";
import { useParams } from "react-router-dom";

const MemberItem = ({ member, onDelete }) => {
  const isOwner = useServerOwner();
  const{serverId}=useParams();
  const { isOpenModal: isOpenDeleteModal, toggleModal: toggleDeleteModal } =
  useModal();
  const handleDelete = (event) => {
    event.stopPropagation(); 
    toggleDeleteModal(); 
  };
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
      {isOwner && (
        <>
          <IoIosCloseCircle
            data-tooltip-id="delete"
            data-tooltip-content="Delete"
            data-tooltip-place="top"
            onClick={handleDelete}
            className="cursor-pointer transition text-zinc-300 hover:text-zinc-100 border-0 hidden group-hover:block"
            size={24}
          />
          <Tooltip
            id= "delete"
            className="font-semibold"
            style={{ backgroundColor: "#111214", color: "#fff" }}
          />
          {isOpenDeleteModal && (
            <DeleteModal
              onDeleteMember={onDelete}
              toggleModal={toggleDeleteModal}
              type="member"
              serverId={serverId}
              memberId={member.id}
            />
          )}
        </>        
      )}
    </div>
  );
};

export default MemberItem;
