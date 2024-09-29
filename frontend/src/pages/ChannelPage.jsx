import React from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import servers from "../fakeApi";
import { useParams } from "react-router-dom";
import ChatInput from "../components/Chat/ChatInput";
import ChatMessages from "../components/Chat/ChatMessages";

const ChannelPage = () => {
  const { serverId, channelId } = useParams();
  const server = servers.find((server) => server.id === serverId);

  const channel = server?.channels.find((channel) => channel.id === channelId);

  if (!server || !channel) {
    return (
      <div className="bg-primary-1 h-screen text-white flex items-center justify-center">
        Channel or Server not found
      </div>
    );
  }
  return (
    <div className="bg-primary-1 h-screen text-white flex flex-col">
      <ChatHeader type={channel.type} name={channel.name} />
      <ChatMessages
        type={channel.type}
        name={channel.name}
        messages={channel.messages}
      />
      <ChatInput type={channel.type} name={channel.name} />
    </div>
  );
};

export default ChannelPage;
