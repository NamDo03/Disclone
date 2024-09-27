import React from "react";
import DropdownItem from "./DropdownItem";
import { FaUserPlus, FaTrashCan } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import InviteMember from "../Modal/InviteMember";
import useModal from "../../hooks/useModal";

const DropdownMenu = ({ isOpen }) => {
  const { isOpenModal: isOpenInviteModal, toggleModal: toggleInviteModal } = useModal();
  if (!isOpen) return null;
  return (
    <div
      className="flex justify-center items-center absolute top-full left-0 w-full"
    >
      <div className="w-56 text-xs font-medium text-neutral-400 bg-[#0f0c0d] p-1 rounded">
        <DropdownItem
          label="Invite People"
          onClick={toggleInviteModal}
          Icon={FaUserPlus}
          color="text-indigo-400"
        />
        <DropdownItem
          label="Server Settings"
          onClick={() => console.log("Server Settings clicked")}
          Icon={IoMdSettings}
        />
        <DropdownItem
          label="Manage Members"
          onClick={() => console.log("Manage Members clicked")}
          Icon={IoPeople}
        />
        <div className="border-b-[1px] mx-2 my-1 border-neutral-700"></div>
        <DropdownItem
          label="Delete Server"
          onClick={() => console.log("Manage Members clicked")}
          Icon={FaTrashCan}
          color="text-red-600"
        />
      </div>
      {isOpenInviteModal&&<InviteMember toggleModal={toggleInviteModal}/>}
    </div>
  );
};

export default DropdownMenu;
