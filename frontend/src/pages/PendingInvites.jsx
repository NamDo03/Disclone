import React, { useEffect, useState } from "react";
import {
  getPendingInvites,
  acceptFriendInvite,
  rejectFriendInvite,
} from "../api/userService";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

const PendingInvites = () => {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      try {
        const token = Cookies.get("token");
        const invites = await getPendingInvites(token);
        setPendingInvites(invites);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInvites();
  }, []);

  const handleAccept = async (inviteId) => {
    const token = Cookies.get("token");
    try {
      await acceptFriendInvite(inviteId, token);
      setPendingInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
      );
      setMessage("Friend invite accepted successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReject = async (inviteId) => {
    const token = Cookies.get("token");
    try {
      await rejectFriendInvite(inviteId, token);
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
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {pendingInvites.length === 0 ? (
            <p>No pending invites.</p>
          ) : (
            <div className="w-full">
              <p className="mb-4">PENDING - {pendingInvites.length}</p>
              <ul className="space-y-2">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="border-t-[1px] border-t-zinc-500 p-4  flex justify-between items-center"
                  >
                    <span>
                      <strong style={{ fontSize: "larger" }}>
                        {invite.sender.username}
                      </strong>
                      <br />
                      Incoming Friend Request
                    </span>

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
