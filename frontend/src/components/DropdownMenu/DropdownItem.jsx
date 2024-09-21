import React from "react";

const DropdownItem = ({ label, onClick, Icon, color }) => {
  return (
    <div
      onClick={onClick}
      className={`${color ? color : "text-gray-1"} 
         px-3 py-2 text-sm cursor-pointer flex items-center hover:bg-[#23201f] rounded`}
    >
      {label}
      {Icon && <Icon size={18} className="ml-auto" />}
    </div>
  );
};

export default DropdownItem;
