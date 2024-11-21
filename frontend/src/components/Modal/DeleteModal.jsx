import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import { deleteMember, deleteServer, getServerById } from "../../api/serverService";
import { deleteChannel, getChannelById } from "../../api/channelService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { removeServer } from "../../redux/serverSlice";
import { useNavigate } from "react-router-dom";
import { removeChannel } from "../../redux/channelSlice";
import { deleteUser, removeFriend } from "../../api/userService";
import { logout } from "../../redux/userSlice";
import { socket } from "../../pages/ChannelPage";

const DeleteModal = ({
  type,
  toggleModal,
  serverId,
  channelId,
  friendId,
  memberId,
  onDeleteFriends,
  onMessageDeleted,
  onDeleteMember
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type.toLowerCase() === "server" && serverId) {
          const serverData = await getServerById(serverId);
          setName(serverData.server_name);
        } else if (type.toLowerCase() === "channel" && channelId) {
          const channelData = await getChannelById(channelId);
          setName(channelData.channel_name);
        }
      } catch (error) {
        toast.error("Failed to load data:" + error.message);
      }
    };

    fetchData();
  }, [type, serverId, channelId]);

  const handleDelete = async () => {
    try {
      if (type.toLowerCase() === "server" && serverId) {
        await deleteServer(serverId);
        dispatch(removeServer({ id: serverId }));
        setTimeout(() => navigate("/"), 100);
      } else if (type.toLowerCase() === "channel" && channelId) {
        await deleteChannel(channelId);
        socket.emit("deleteChannel", { serverId: serverId, channelId });
      } else if (type.toLowerCase() === "user") {
        await deleteUser(currentUser.id);
        dispatch(logout());
      } else if (type.toLowerCase() === "friends") {
        await removeFriend(friendId);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        onDeleteFriends(friendId);
      } else if (type.toLowerCase() === "message") {
        onMessageDeleted();
      } else if (type.toLowerCase() === "member") {
        await deleteMember(serverId, memberId);
        onDeleteMember(memberId);
      }
      toggleModal();
      toast.success(`Successfully deleted ${type} ${name || ""}`);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete data: " + error.message);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]">
      <div className="min-w-[450px] max-w-[580px] bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-zinc-200 font-semibold capitalize">
              Delete {type}
            </h2>
            <button
              onClick={toggleModal}
              className="text-zinc-400 hover:text-zinc-200 flex justify-end items-center"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="py-5">
            <p className="text-zinc-300 text-center">
              {type.toLowerCase() === "user"
                ? `Are you sure you want to delete this user `
                : `Are you sure you want to delete the ${type} `}
              <strong>{name}</strong>?
            </p>
            <p className="text-zinc-300 text-center">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2">
          <div
            onClick={toggleModal}
            className="hover:underline px-4 py-1 text-sm cursor-pointer"
          >
            Cancel
          </div>
          <button
            onClick={handleDelete}
            className="px-8 py-3 rounded font-semibold text-sm bg-red-600 cursor-pointer hover:bg-red-500 text-white"
          >
            Delete {type}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default DeleteModal;
