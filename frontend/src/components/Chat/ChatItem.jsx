import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useSelector } from "react-redux";
import { Filter } from 'bad-words'

const ChatItem = ({
  authorName,
  authorAvatar,
  authorId,
  content,
  owner,
  timestamp,
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAdmin = Number(currentUser.id) === Number(owner.id);

  const canEditMessage = authorId === currentUser.id;
  const canDeleteMessage = isAdmin || authorId === currentUser.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(content);

  const filter = new Filter();
  const filteredContent = filter.clean(content);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated message:", editedMessage);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedMessage(e.target.value);
  };

  const handleDelete = () => {
    console.log("Delete message success");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Added dependency array to prevent memory leaks

  const isCloudinaryImageUrl = (string) => {
    return (
      string.startsWith("https://res.cloudinary.com/") &&
      /\.(jpg|jpeg|png|gif)$/.test(string)
    );
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
            (isCloudinaryImageUrl(content) ? (
              <img
                src={content}
                alt="uploaded"
                className="max-w-[300px] mt-4 h-auto rounded-md object-cover"
              />
            ) : (
              <p className="text-sm text-zinc-300">{filteredContent}</p>
            ))}
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
                    onChange={handleInputChange}
                  />
                </div>
                <button className="bg-main py-2 px-5 rounded-md hover:bg-main/80">
                  Save
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
                onClick={handleDelete}
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
    </div>
  );
};

export default ChatItem;
