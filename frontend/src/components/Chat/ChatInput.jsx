import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({ type, channelId, name, socket }) => {
  const [fileName, setFileName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [content, setContent] = useState("");
  const author_id = useSelector((state) => state.user.currentUser.id);

  const handleEmojiClick = (emojiObject) => {
    setContent((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content || content.trim() == "") {
      return
    }
    const newMessage = {
      content,
      channelId,
      author_id
    };
    socket.emit('newMessage', newMessage);
    setContent('');
  };

  return (
    <form className="w-full" onSubmit={sendMessage}>
      <div className="relative p-4 pb-6">
        <button
          type="button"
          onClick={handleFileClick}
          className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
        >
          <ImAttachment size={30} className="text-primary-1" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="text"
          placeholder={`Message ${type === "TEXT" ? "#" + name : name}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
