import React from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useModal from "../../hooks/useModal";
import EditModal from "../Modal/EditModal";
import DeleteModal from "../Modal/DeleteModal";

const ChannelItem = ({ id, name, Icon }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { serverId } = useParams();
  const { isOpenModal: isOpenEditModal, toggleModal: toggleEditModal } =
    useModal();
  const { isOpenModal: isOpenDeleteModal, toggleModal: toggleDeleteModel } =
    useModal();

  const handleEdit = (event) => {
    event.stopPropagation();
    toggleEditModal();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    toggleDeleteModel();
  };
  return (
    <div
      onClick={() => navigate(`/servers/${serverId}/channels/${id}`)}
      className={`p-2 rounded-md flex items-center group gap-x-1 hover:bg-zinc-700/50 transition mb-1 cursor-pointer ${
        Number(params?.channelId) === id && "bg-zinc-700"
      }`}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-400" />
      <p
        className={`line-clamp-1 font-semibold text-sm  transition ${
          Number(params?.channelId) === id
            ? "text-zinc-200 group-hover:text-white"
            : "text-zinc-400 group-hover:text-zinc-300"
        }`}
      >
        {name}
      </p>
      <div className="ml-auto flex items-center gap-x-2">
        <FiEdit
          data-tooltip-id="edit"
          data-tooltip-content="Edit"
          data-tooltip-place="top"
          onClick={handleEdit}
          className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition outline-none"
        />
        <Tooltip
          id="edit"
          className="font-semibold"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
        <FaTrashCan
          data-tooltip-id="delete"
          data-tooltip-content="Delete"
          data-tooltip-place="top"
          onClick={handleDelete}
          className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition outline-none"
        />
        <Tooltip
          id="delete"
          className="font-semibold"
          style={{ backgroundColor: "#111214", color: "#fff" }}
        />
      </div>
      {isOpenEditModal && (
        <EditModal
          toggleModal={toggleEditModal}
          type="channel"
          serverId={serverId}
          channelId={id}
        />
      )}
      {isOpenDeleteModal && (
        <DeleteModal
          toggleModal={toggleDeleteModel}
          type="channel"
          serverId={serverId}
          channelId={id}
        />
      )}
    </div>
  );
};

export default ChannelItem;
