import React, { useEffect } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useModal from "../../hooks/useModal";
import EditModal from "../Modal/EditModal";
import DeleteModal from "../Modal/DeleteModal";
import useServerOwner from "../../hooks/useServerOwner";
import {
  StreamVideo,
  CallParticipantsList,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { useCall } from "../../redux/callContext";
import "./style.css"

const ChannelItem = ({ index, id, name, Icon, type }) => {
  const { callVideo, client ,channelId} = useCall();
  const navigate = useNavigate();
  const params = useParams();
  const { isOpenModal: isOpenEditModal, toggleModal: toggleEditModal } =
    useModal();
  const { isOpenModal: isOpenDeleteModal, toggleModal: toggleDeleteModal } =
    useModal();

  const handleEdit = (event) => {
    event.stopPropagation();
    toggleEditModal();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    toggleDeleteModal();
  };

  const isOwner = useServerOwner();

  return (
    <>
    <div
      onClick={() =>
        navigate(
          type === "VOICE"
            ? `/servers/${params.serverId}/channels/${id}/voice`
            : `/servers/${params.serverId}/channels/${id}`
        )
      }
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
      {isOwner && (
        <>
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
            {index == 0 && type == "TEXT" ? (
              <></>
            ) : (
              <FaTrashCan
                data-tooltip-id="delete"
                data-tooltip-content="Delete"
                data-tooltip-place="top"
                onClick={handleDelete}
                className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition outline-none"
              />
            )}

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
              serverId={params.serverId}
              channelId={id}
            />
          )}
          {isOpenDeleteModal && (
            <DeleteModal
              toggleModal={toggleDeleteModal}
              type="channel"
              serverId={params.serverId}
              channelId={id}
            />
          )}
        </>
      )}
    </div>
    {type === "VOICE" && callVideo && id == channelId && (
        <StreamVideo client={client}>
          <StreamCall call={callVideo}>
            <CallParticipantsList />
          </StreamCall>
        </StreamVideo>
      )}
    </>
  );
};

export default ChannelItem;
