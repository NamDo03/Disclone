import React, { useEffect, useState, useEffect } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import { useParams } from "react-router-dom";
import ChatInput from "../components/Chat/ChatInput";
import ChatMessages from "../components/Chat/ChatMessages";
import MemberList from "../components/MemberList/MemberList";
import Cookies from "js-cookie";
import { getChannelById } from "../api/channelService";
import { getListOfMembers } from "../api/serverService";
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const socket = io(BACKEND_URL);
const ChannelPage = () => {
  const token = Cookies.get("token");

  const { serverId, channelId } = useParams();
  const [showMemberList, setShowMemberList] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelData = await getChannelById(channelId, token);
        const membersData = await getListOfMembers(serverId, token);
        setChannel(channelData);
        setMemberList(membersData.members);
      } catch (err) {
        throw err.message;
      }
    };

    fetchData();
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
  
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('previousMessages', (msgs) => {
      console.log(msgs)
      setMessages(msgs);
    });

    socket.on('message', (msg) => {
      console.log(msg)
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('previousMessages');
      socket.off('message');
    };
  }, []);

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
          // messages={channel.messages}
        />
        <ChatInput type={channel.type} name={channel.channel_name} socket={socket} />
      </div>
      {showMemberList && (
        <div className="w-[240px] bg-[#2B2D31] overflow-y-auto transition">
          <MemberList
            members={memberList}
            onMemberDeleted={handleMemberDeleted}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
