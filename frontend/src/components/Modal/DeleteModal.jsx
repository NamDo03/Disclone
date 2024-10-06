import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import servers from "../../fakeApi";
import { createPortal } from "react-dom";

const DeleteModal = ({ type, toggleModal, serverId, channelId }) => {
    const server = servers.find((s) => s.id === serverId);
    const channel = server?.channels.find((c) => c.id === channelId);
  
    const isServer = type.toLowerCase() === "server";
    const deleteTarget = isServer ? server : channel;
    const deleteName = deleteTarget?.name || "this";
  
    const handleDelete = () => {
      console.log(`Deleting ${type} with id:`, deleteTarget?.id);
    };
  
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
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
                Are you sure you want to delete the {type}{" "}
                <strong>{deleteName}</strong>? 
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