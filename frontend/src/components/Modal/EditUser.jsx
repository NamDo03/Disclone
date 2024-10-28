import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import DeleteModal from "./DeleteModal";
import EditAvatar from "./EditAvatar";
import EditInfo from "./EditInfo";
import useModal from "../../hooks/useModal";
import { useParams } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";

const EditUserModal = ({ toggleModal, user }) => {
  const { userId } = useParams();

  // const [image] = useState(user.avatar_url || "");
  // const [username, setUsername] = useState(user.username || "");
  const [loading, setLoading] = useState(false);

  const { isOpenModal: isOpenDeleteModal, toggleModal: toggleDeleteModal } =
    useModal();
  const { isOpenModal: isOpenEditAvatar, toggleModal: toggleEditAvatar } =
    useModal();
  const { isOpenModal: isOpenEditUsername, toggleModal: toggleEditUsername } =
    useModal();
  const { isOpenModal: isOpenEditPassword, toggleModal: toggleEditPassword } =
    useModal();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleModal]);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
      <div className="bg-[#2f3136] rounded-lg p-6 w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">My Account</h2>
          <button
            onClick={toggleModal}
            className="text-white hover:text-gray-400 flex items-center"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="overflow-y-auto">
          <div className="flex items-center mb-4">
            <div
              className="relative group w-[72px] h-[72px]"
              onClick={toggleEditAvatar}
            >
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover group-hover:brightness-50 transition duration-200"
              />
              <RiPencilFill
                size={24}
                className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-white text-2xl">{user.username}</h3>
            </div>
          </div>
          <div className="bg-primary-3 rounded-lg p-4 mb-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <label className="text-sm text-gray-400 block mr-4">
                  Email
                </label>
                <p className="text-white text-zinc-400 mr-2">{user.email}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <label className="text-sm text-gray-400 block mr-4">
                  Username
                </label>
                <p className="text-white text-zinc-400 mr-2">{user.username}</p>
              </div>
              <button
                onClick={toggleEditUsername}
                type="button"
                className="ml-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition "
              >
                Edit
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex">
                <label className="text-sm text-gray-400 block mr-4">
                  Password
                </label>
                <p className="text-white text-zinc-400 mr-2">••••••••••</p>
              </div>
              <button
                onClick={toggleEditPassword}
                type="button"
                className="ml-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition "
              >
                Edit
              </button>
            </div>
          </div>
          <button
            onClick={toggleDeleteModal}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
      {isOpenDeleteModal && (
        <DeleteModal
          toggleModal={toggleDeleteModal}
          type="user"
          userId={userId}
        />
      )}
      {isOpenEditAvatar && <EditAvatar toggleModal={toggleEditAvatar} />}
      {isOpenEditUsername && (
        <EditInfo toggleModal={toggleEditUsername} type="username" />
      )}
      {isOpenEditPassword && (
        <EditInfo toggleModal={toggleEditPassword} type="new password" />
      )}
    </div>,
    document.getElementById("root")
  );
};

export default EditUserModal;
