import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ type, name }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };  

  return (
    <form className="w-full" onSubmit={(e) => e.preventDefault()}>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-14 py-3 bg-zinc-700/75 border-none border-0 
          focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 outline-none placeholder-zinc-500"
        />
        <div className="absolute top-7 right-8">
          <BsEmojiSmile
            size={24}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="cursor-pointer"
          />
          {showEmojiPicker && (
            <div className="absolute bottom-10 right-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} 
              theme = 'dark'/>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
