import React from "react";
import DropdownItem from "./DropdownItem";
import { FaUserPlus, FaTrashCan } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import InviteMember from "../Modal/InviteMember";
import useModal from "../../hooks/useModal";
import EditModal from "../Modal/EditModal";
import DeleteModal from "../Modal/DeleteModal";
import { useParams } from "react-router-dom";
import useServerOwner from "../../hooks/useServerOwner";

const DropdownMenu = () => {
  const { serverId } = useParams();
  const { isOpenModal: isOpenInviteModal, toggleModal: toggleInviteModal } =
    useModal();
  const { isOpenModal: isOpenEditServer, toggleModal: toggleEditServer } =
    useModal();
  const { isOpenModal: isOpenDeleteModal, toggleModal: toggleDeleteModel } =
    useModal();

  const isOwner = useServerOwner();
  return (
    <div className="flex justify-center items-center absolute top-full left-0 w-full">
      <div className="w-56 text-xs font-medium text-neutral-400 bg-[#0f0c0d] p-1 rounded">
        <DropdownItem
          label="Invite People"
          onClick={toggleInviteModal}
          Icon={FaUserPlus}
          color="text-indigo-400"
        />
        {isOwner && (
          <>
            <DropdownItem
              label="Server Settings"
              onClick={toggleEditServer}
              Icon={IoMdSettings}
            />
            <div className="border-b-[1px] mx-2 my-1 border-neutral-700"></div>
            <DropdownItem
              label="Delete Server"
              onClick={toggleDeleteModel}
              Icon={FaTrashCan}
              color="text-red-600"
            />
          </>
        )}
      </div>
      {isOpenInviteModal && <InviteMember toggleModal={toggleInviteModal} />}
      {isOpenEditServer && (
        <EditModal
          toggleModal={toggleEditServer}
          type="server"
          serverId={serverId}
        />
      )}
      {isOpenDeleteModal && (
        <DeleteModal
          toggleModal={toggleDeleteModel}
          type="server"
          serverId={serverId}
        />
      )}
    </div>
  );
};

export default DropdownMenu;
