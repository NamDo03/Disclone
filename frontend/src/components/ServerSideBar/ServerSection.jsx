import React from "react";
import { FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import AddChannelModal from "../Modal/AddChannelModal";
import useModal from "../../hooks/useModal";
import useServerOwner from "../../hooks/useServerOwner";

const ServerSection = ({ name, isExpanded, toggleExpand }) => {
  const { isOpenModal, toggleModal } = useModal();
  const isOwner = useServerOwner();
  return (
    <div className="flex items-center justify-between py-2 cursor-pointer group">
      <p
        onClick={toggleExpand}
        className="flex items-center gap-1 text-xs uppercase font-semibold text-zinc-400 group-hover:text-zinc-300"
      >
        {isExpanded ? (
          <FaChevronDown size={10} />
        ) : (
          <FaChevronRight size={10} />
        )}
        {name}
      </p>
      {isOwner && (
        <>
          <button
            onClick={toggleModal}
            data-tooltip-id="addChannel"
            data-tooltip-content="Create Channel"
            data-tooltip-place="top"
            className="text-zinc-400 hover:text-zinc-300 "
          >
            <FaPlus />
          </button>
          <Tooltip
            id="addChannel"
            style={{ backgroundColor: "#111214", color: "#fff" }}
          />
          {isOpenModal && <AddChannelModal toggleModal={toggleModal} />}
        </>
      )}
    </div>
  );
};

export default ServerSection;
