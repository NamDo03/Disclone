import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useSelector } from "react-redux";
import { deleteMessageById, updateMessageById } from "../../api/userService";
import { Filter } from "bad-words";
import useModal from "../../hooks/useModal";
import DeleteModal from "../Modal/DeleteModal";
import * as crypto from "../../utils/crypto.js";
import { socket } from "../../pages/ChannelPage.jsx";
import ImageWithBlur from "../ImageWithBlur.jsx"

const filter = new Filter();
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

const ChatItem = ({
  authorName,
  authorAvatar,
  authorId,
  content,
  owner,
  timestamp,
  messageId,
  onMessageUpdated,
  onMessageDeleted,
  groupKey,
  directMessageId
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const shouldFilterBadWords = useSelector(
    (state) => state.filter.filterBadWords
  );
  const filteredContent = shouldFilterBadWords
    ? filter.clean(content)
    : content;

  const isAdmin = Number(currentUser.id) === Number(owner.id);
  const canEditMessage = authorId === currentUser.id;
  const canDeleteMessage = isAdmin || authorId === currentUser.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpenModal, toggleModal } = useModal();
  const { channelId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedMessage.trim()) return;

    setIsLoading(true);
    try {
      const { iv, ciphertext } = await crypto.encryptWithSymmetricKey(
        groupKey,
        editedMessage
      );
      await updateMessageById(messageId, ciphertext, iv);
      if (directMessageId) {
        socket.emit("messageUpdated", { directMessageId, messageId, editedMessage });
      } else {
        socket.emit("messageUpdated", { channelId, messageId, editedMessage });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteMessageById(messageId);
      if (directMessageId) {
        socket.emit("messageDeleted", { directMessageId, messageId });
      } else {
        socket.emit("messageDeleted", { channelId, messageId });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("onMessageUpdated", ({ messageId, editedMessage }) => {
      onMessageUpdated(messageId, editedMessage);
    })
  
    socket.on("onMessageDeleted", (messageId) => {
      onMessageDeleted(messageId);
    })

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const isCloudinaryImageUrl = (string) => {
    return (
      string.startsWith("https://res.cloudinary.com/") &&
      /\.(jpg|jpeg|png|gif)$/.test(string)
    );
  };

  const isInviteLink = (url) => {
    const inviteRegex = new RegExp(`${FRONTEND_URL}\/invite\/\\d+$`);
    return inviteRegex.test(url);
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <img
            src={authorAvatar}
            className="h-[40px] w-[40px] rounded-full object-cover"
            alt="avatar"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {authorName}
              </p>
            </div>
            <span className="text-xs text-zinc-400">{timestamp}</span>
          </div>
          {!isEditing &&
             <>
             {isCloudinaryImageUrl(content) ? (
               <ImageWithBlur content={content} />
             ) : isInviteLink(content) ? (
               <a
                 href={content}
                 className="text-blue-500 underline text-sm"
                 rel="noopener noreferrer"
               >
                 {content}
               </a>
             ) : (
               <p className="text-sm text-zinc-300">{filteredContent}</p>
             )}
           </>}
          {isEditing && (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    className="p-2 w-full bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-zinc-200 rounded-md"
                    placeholder="Edit message"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-main py-2 px-5 rounded-md hover:bg-main/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </>
          )}
        </div>
      </div>
      {(canDeleteMessage || canEditMessage) && !isEditing && (
        <div className="hidden group-hover:flex items-center absolute -top-2 right-5 bg-primary-1 border border-zinc-800 rounded-md">
          {canEditMessage && (
            <>
              <div
                data-tooltip-id="edit"
                data-tooltip-content="Edit"
                data-tooltip-place="top"
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto hover:bg-zinc-700 p-2 transition text-zinc-300 hover:text-zinc-100 border-0 rounded-md"
              >
                <MdEdit className="w-5 h-5 " />
              </div>
              <Tooltip
                id="edit"
                className="font-semibold"
                style={{ backgroundColor: "#111214", color: "#fff" }}
              />
            </>
          )}
          {canDeleteMessage && (
            <>
              <div
                data-tooltip-id="delete"
                data-tooltip-content="Delete"
                data-tooltip-place="top"
                onClick={toggleModal}
                className="cursor-pointer ml-auto hover:bg-zinc-700 p-2 transition text-zinc-300 hover:text-zinc-100 border-0 rounded-md"
              >
                <FaTrashCan className="w-5 h-5" />
              </div>
              <Tooltip
                id="delete"
                className="font-semibold"
                style={{ backgroundColor: "#111214", color: "#fff" }}
              />
            </>
          )}
        </div>
      )}
      {isOpenModal && (
        <DeleteModal
          onMessageDeleted={handleDelete}
          toggleModal={toggleModal}
          type="message"
        />
      )}
    </div>
  );
};

export default ChatItem;
