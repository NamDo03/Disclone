import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BsEmojiSmile } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import { ImAttachment } from "react-icons/im";
import EmojiPicker from "emoji-picker-react";
import * as crypto from "../../utils/crypto.js";
import { toast } from "react-toastify";

const CLOUDINARY_URL =
  import.meta.env.VITE_CLOUDINARY_URL ||
  "https://api.cloudinary.com/v1_1/dyzlyiggq/image/upload";

const ChatInput = ({
  type,
  channelId,
  name,
  socket,
  directMessageId,
  groupKey,
}) => {
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
    if (!groupKey) {
      toast.error("Missing group key! Can't send message");
    }
    const imageUrls = await uploadFiles();

    if (type === "DM") {
      if (content) {
        const { iv, ciphertext } = await crypto.encryptWithSymmetricKey(
          groupKey,
          content
        );
        const newMessage = {
          content: ciphertext,
          iv,
          direct_message_id: directMessageId,
          author_id,
        };
        socket.emit("newDirectMessage", newMessage);
      }
      for (const url of imageUrls) {
        const { iv, ciphertext } = await crypto.encryptWithSymmetricKey(
          groupKey,
          url
        );
        const imageMessage = {
          content: ciphertext,
          iv,
          direct_message_id: directMessageId,
          author_id,
        };
        socket.emit("newDirectMessage", imageMessage);
      }
    } else if (type === "TEXT") {
      if (content) {
        const { iv, ciphertext } = await crypto.encryptWithSymmetricKey(
          groupKey,
          content
        );
        const newMessage = {
          content: ciphertext,
          iv,
          channelId,
          author_id,
        };
        socket.emit("newMessage", newMessage);
      }
      for (const url of imageUrls) {
        const { iv, ciphertext } = await crypto.encryptWithSymmetricKey(
          groupKey,
          url
        );
        const imageMessage = {
          content: ciphertext,
          iv,
          channelId,
          author_id,
        };
        socket.emit("newMessage", imageMessage);
      }
    }

    setContent("");
    setUploadedFiles([]);
  };

  const uploadFiles = async () => {
    const uploadedUrls = [];

    for (const file of uploadedFiles) {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("upload_preset", "Upload-img");

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    return uploadedUrls;
  };

  const handleFileUpload = (e) => {
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
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <form
      className="w-full"
      onSubmit={sendMessage}
      onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
    >
      {/* File Previews */}
      {uploadedFiles.length > 0 && (
        <div className="p-4 flex gap-3 mx-4 overflow-x-auto bg-zinc-700/75 rounded-t">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="relative bg-zinc-800/55 rounded p-2 w-32 flex flex-col items-center justify-center"
            >
              <img
                src={file.url}
                alt={`Uploaded Preview ${index + 1}`}
                className="w-21 h-20 object-cover"
              />
              <span className="block text-center text-xs text-white mt-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {file.name}
              </span>
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
          placeholder={`Message ${
            type === "TEXT" ? "#" + name : type === "DM" ? "DM" : name
          }`}
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
