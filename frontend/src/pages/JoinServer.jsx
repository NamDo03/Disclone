import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import img from "../assets/bg.webp";
import { toast } from "react-toastify";
import { getServerById, joinServer } from "../api/serverService";

const JoinServer = () => {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [server, setServer] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverData = await getServerById(serverId);
        if (serverData && serverData.channels) {
          setServer(serverData);
        } else {
          throw new Error("Server data is incomplete.");
        }
      } catch (error) {
        toast.error("Failed to load data:" + error.message);
      }
    };

    fetchData();
  }, [serverId]);
  const isMember = server?.members?.some((member) => member.user_id === currentUser.id);
  const handleJoinServer = async () => {
    if (isMember) {
      navigate(`/servers/${server.id}/channels/${server.channels[0].id}`);
    } else {
      try {
        const response = await joinServer(currentUser.id, serverId);
        toast.success(response.message);
        navigate(`/servers/${server.id}/channels/${server.channels[0].id}`);
      } catch (error) {
        toast.error("Failed to join server: " + error.message);
      }
    }
  };
  return (
    <div className="relative h-screen w-screen">
      <img
        src={img}
        className="h-screen w-screen object-cover fixed top-0 left-0"
        alt=""
      />
      <div className="absolute min-h-[580px] h-full w-full flex items-center justify-center">
        <div className=" bg-primary-1 p-8 rounded min-w-[480px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <div className="flex flex-row items-center justify-center gap-2">
            <img
              src={server.image_url}
              alt="server_avatar"
              className=" object-cover h-10 w-10 rounded-lg"
            />
            <h1 className="text-zinc-200 font-semibold text-xl">
              {server.server_name}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 inline-block"></span>
            <span className="text-zinc-200">
              {server.members?.length || 0} members
            </span>
          </div>
          <button
            onClick={handleJoinServer}
            className="w-full bg-main hover:bg-main/85 text-white rounded-[3px] p-2.5 mt-8"
          >
            Accept Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinServer;
