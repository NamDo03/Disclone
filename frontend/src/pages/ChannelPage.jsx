import React, { useState } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import servers from "../fakeApi";
import { useParams } from "react-router-dom";
import ChatInput from "../components/Chat/ChatInput";
import ChatMessages from "../components/Chat/ChatMessages";
import MemberList from "../components/MemberList/MemberList";

const ChannelPage = () => {
  const { serverId, channelId } = useParams();
  const [showMemberList, setShowMemberList] = useState(false);

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
    <div className="bg-primary-1 h-screen text-white flex">
      <div className="flex flex-col flex-grow pr-1">
        <ChatHeader
          type={channel.type}
          name={channel.name}
          showMemberList={showMemberList}
          onToggleMemberList={() => setShowMemberList(!showMemberList)}
        />
        <ChatMessages
          type={channel.type}
          name={channel.name}
          messages={channel.messages}
        />
        <ChatInput type={channel.type} name={channel.name} />
      </div>
      {showMemberList && (
        <div className="w-[240px] bg-[#2B2D31] overflow-y-auto transition">
          <MemberList members={server.members} />
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
