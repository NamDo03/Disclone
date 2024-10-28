import React, { useState } from "react";
import ChatWelcome from "./ChatWelcome";
import { LuServerCrash } from "react-icons/lu";
import ChatItem from "./ChatItem";
import useScrollToBottom from "../../hooks/useScrollToBottom";

const ChatMessages = ({ type, name, messages }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useScrollToBottom(messages);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="animate-spin h-10 w-10 my-4 border-4 border-t-primary-1 border-zinc-500 rounded-full"></div>
        <p className="text-xs text-zinc-400">Something went wrong!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <LuServerCrash className="h-10 w-10 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-400">Failed to load messages</p>
      </div>
    );
  }
  return (
    <div
      ref={messagesEndRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto"
    >
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto gap-y-2">
        {messages &&
          messages.length > 0 &&
          messages.map((message) => (
            <ChatItem
              key={message.id}
              authorId={message.user.id}
              authorName={message.user.username}
              authorAvatar={message.user.avatar_url}
              content={message.content}
              timestamp={new Date(message.created_at).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
              })}
            />
          ))}
      </div>
    </div>
  );
};

export default ChatMessages;
