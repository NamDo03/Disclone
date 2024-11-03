import React, { useState, useEffect } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import { useNavigate, useParams } from "react-router-dom";
import ChatInput from "../components/Chat/ChatInput";
import ChatMessages from "../components/Chat/ChatMessages";
import MemberList from "../components/MemberList/MemberList";
import { getServerById } from "../api/serverService";
import { io } from "socket.io-client";
import { getUserById } from "../api/userService";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const socket = io(BACKEND_URL);
const ChannelPage = () => {

  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const [showMemberList, setShowMemberList] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [owner, setOwner] = useState({});
  useEffect(() => {
    if (!serverId || !channelId) {
      navigate("/page-not-found");
      return;
    }
    const fetchData = async () => {
      try {
        const serverData = await getServerById(serverId);
        const foundChannel = serverData.channels.find(
          (channel) => channel.id === Number(channelId)
        );
        if (!foundChannel) {
          navigate("/page-not-found");
          return;
        }
        const ownerServer = await getUserById(serverData.user_id);
        setOwner(ownerServer);
        setMemberList(serverData.members);
        setChannel(foundChannel);
      } catch (err) {
        if (err.message.includes("Server not found")) {
          navigate("/page-not-found");
        } else {
          console.log(err.message);
        }
      }
    };

    fetchData();

    if (serverId && channelId) {
      socket.emit('joinServer', { serverId, channelId });
    }

    socket.on('previousMessages', (msgs) => {
      setMessages(msgs);
    });

    socket.on('message', (msg) => {
      setMessages(prevMessages => [msg, ...prevMessages]);
    });

    return () => {
      socket.off('previousMessages');
      socket.off('message');
    };
  }, [serverId, channelId]);

  const handleMemberDeleted = (userId) => {
    setMemberList((prevMembers) =>
      prevMembers.filter((member) => member.id !== userId)
    );
  };
  if (!channel) {
    return (
      <div className="bg-primary-1 h-screen text-white flex items-center justify-center">
        Channel not found
      </div>
    );
  }

  return (
    <div className="bg-primary-1 h-screen text-white flex">
      <div className="flex flex-col flex-grow pr-1">
        <ChatHeader
          type={channel.type}
          name={channel.channel_name}
          showMemberList={showMemberList}
          onToggleMemberList={() => setShowMemberList(!showMemberList)}
        />
        <ChatMessages
          type={channel.type}
          name={channel.channel_name}
          messages={messages}
          owner={owner}
        />
        <ChatInput
          type={channel.type}
          channelId={channel.id}
          name={channel.channel_name}
          socket={socket}
        />
      </div>
      {showMemberList && (
        <div className="w-[240px] bg-[#2B2D31] overflow-y-auto transition">
          <MemberList
            owner={owner}
            members={memberList}
            onMemberDeleted={handleMemberDeleted}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
