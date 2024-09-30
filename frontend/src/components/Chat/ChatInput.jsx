import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
const ChatInput = ({ type, name, socket }) => {
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    e.preventDefault();
    const newMessage = {
      name,
      content: message,
    };
    console.log(newMessage)
    socket.emit('newMessage', newMessage);
    setMessage('');
  };
  return (
    <form className="w-full" onSubmit={sendMessage}>
      <div className="relative p-4 pb-6">
        <button
          onClick={() => {}}
          className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
        >
          <FaPlus size={30} className="text-primary-1" />
        </button>
        <input
          type="text"
          placeholder={`Message ${type === " text" ? name : "#" + name}`}
          className="w-full px-14 py-3 bg-zinc-700/75 border-none border-0 
          focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 outline-none placeholder-zinc-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="absolute top-7 right-8">
          <BsEmojiSmile size={24} />
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
