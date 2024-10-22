import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsEmojiSmile } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import { ImAttachment } from "react-icons/im";
import EmojiPicker from 'emoji-picker-react';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dyzlyiggq/image/upload";

const ChatInput = ({ type, channelId, name, socket }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [content, setContent] = useState("");
  const author_id = useSelector((state) => state.user.currentUser.id);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const handleEmojiClick = (emojiObject) => {
    setContent((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content && uploadedFiles.length === 0) {
      return;
    }
    const newMessage = {
      content,
      channelId,
      author_id
    };
    socket.emit('newMessage', newMessage);
    setContent('');
    setUploadedFiles([]);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        url: isImage ? URL.createObjectURL(file) : null,
        name: file.name,
        file, 
        isImage,
      };
    });
    setUploadedFiles((prevFiles) => [...prevFiles, ...filePreviews]);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Upload-img'); 
  
      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData
        });
  
        const data = await response.json();
        if (data.secure_url) {
          setUploadedFiles((prevFiles) => 
            prevFiles.map((prevFile) => 
              prevFile.file === file ? { ...prevFile, cloudinaryUrl: data.secure_url } : prevFile
            )
          );
        }
        setContent(data.secure_url)
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <form className="w-full" onSubmit={sendMessage} onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}>
      {/* File Previews */}
      {uploadedFiles.length > 0 && (
        <div className="p-4 flex space-x-4 mb-4 overflow-x-auto">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative border border-gray-600 rounded p-2 w-32">
              <img
                src={file.url}
                alt={`Uploaded Preview ${index + 1}`}
                className="w-21 h-20 object-fit"
              />
              <span className="block text-center text-xs text-white mt-1 overflow-hidden whitespace-nowrap text-ellipsis">{file.name}</span>
              <button
                onClick={() => handleFileRemove(index)}
                className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
              >
                <FaTrash size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="relative p-4 pb-6">
        {/* File Upload Button */}
        <label className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center cursor-pointer">
          <ImAttachment size={30} className="text-primary-1" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple
            accept="image/*"
          />
        </label>

        {/* Message Input */}
        <input
          type="text"
          placeholder={`Message ${type === "TEXT" ? "#" + name : name}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-14 py-3 bg-zinc-700/75 border-none border-0 
          focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 outline-none placeholder-zinc-500"
        />

        {/* Emoji Picker */}
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