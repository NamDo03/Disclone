import React from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import { useParams } from "react-router-dom";
import { directMessages } from "../fakeApi";

const PersonalMessage = () => {
  const { conversationId } = useParams();
  const myId = "1";
  const conversation = directMessages.find((dm) => dm.id === conversationId);
  const participant = conversation.participants.find(
    (participant) => participant.id !== myId
  );
  return (
    <div className="flex flex-col flex-grow pr-1 bg-primary-1 h-screen text-white">
      <ChatHeader
        type="TEXT"
        name={participant.username}
        // showMemberList={showMemberList}
        // onToggleMemberList={() => setShowMemberList(!showMemberList)}
      />
      <ChatMessages
        type="TEXT"
        name={participant.username}
        messages={conversation.messages}
      />
      {/* <ChatInput 
        type="TEXT" channelId={channel.id} name={user.name} socket={socket} 
        /> */}
    </div>
  );
};

export default PersonalMessage;
