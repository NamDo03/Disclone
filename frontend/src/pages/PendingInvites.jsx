import React, { useEffect, useState } from "react";
import {
  getPendingInvites,
  acceptFriendInvite,
  rejectFriendInvite,
} from "../api/userService";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import img from "../assets/nopending.svg";

const PendingInvites = () => {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      try {
        const invites = await getPendingInvites();
        setPendingInvites(invites);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInvites();
  }, []);

  const handleAccept = async (inviteId) => {
    try {
      await acceptFriendInvite(inviteId);
      setPendingInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
      );
      setMessage("Friend invite accepted successfully!");
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReject = async (inviteId) => {
    try {
      await rejectFriendInvite(inviteId);
      setPendingInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
      );
      setMessage("Friend invite rejected successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-primary-1 h-screen text-white flex flex-col items-center p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {message && <p className="text-green mb-4">{message}</p>}
          {pendingInvites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img src={img} alt="No pending invites" className="mb-4" />
              <p>There are no pending friend requests.</p>
            </div>
          ) : (
            <div className="w-full">
              <p className="mb-4">PENDING - {pendingInvites.length}</p>
              <ul className="space-y-2">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="border-t-[1px] border-t-zinc-500 p-4  flex justify-between items-center"
                  >
                    <div className="flex flex-row gap-3 items-center">
                      <img
                        src={invite.sender.avatar_url}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-start">
                        <h2 className="font-semibold">
                          {invite.sender.username}
                        </h2>
                        <span className="text-xs text-zinc-400">
                          Incoming Friend Request
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleAccept(invite.id)}
                        className="bg-zinc-600 hover:bg-zinc-700 text-white hover:text-green p-1 flex items-center justify-center rounded-full w-8 h-8 "
                      >
                        <FaCheck size={20} />
                      </button>
                      <button
                        onClick={() => handleReject(invite.id)}
                        className="bg-zinc-600 hover:bg-zinc-700 text-white hover:text-red-500 p-1 flex items-center justify-center rounded-full w-8 h-8 "
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingInvites;
