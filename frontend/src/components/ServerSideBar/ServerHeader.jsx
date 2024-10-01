import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

const ServerHeader = ({ name }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="w-full text-md font-semibold px-3 flex items-center justify-between h-12 
      border-neutral-900 border-b-2 hover:bg-zinc-700/50 transition cursor-pointer"
      >
        {name}
        {isDropdownOpen ? <IoClose size={20} /> : <FaChevronDown />}
      </div>
      {isDropdownOpen && (
        <DropdownMenu />
      )}
    </div>
  );
};

export default ServerHeader;
