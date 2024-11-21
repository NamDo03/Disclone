import React, { useEffect, useState } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import { useParams } from "react-router-dom";
import { getDMById, getUserById } from "../api/userService";
import { useSelector } from "react-redux";
import { socket } from "./ChannelPage";
import * as crypto from '../utils/crypto';

const PersonalMessage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { directMessageId } = useParams();
  const [friend, setFriend] = useState({});
  const [messages, setMessages] = useState([]);
  const [directKey, setKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const DM = await getDMById(directMessageId);
        let otherUserId =
          DM.sender_id === currentUser.id ? DM.receiver_id : DM.sender_id;
        const friendDM = await getUserById(otherUserId);
        setFriend(friendDM);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    const initializeKey = async () => {
      if (!directKey) {
        const newKey = await crypto.generateSymmetricKey();
        setKey(newKey);
      }
    };
    initializeKey();

    if (currentUser.id && directMessageId) {
      socket.emit("joinDirectMessage", {
        directMessageId,
      });
    }
    socket.on("directMessage", async (newMessage) => {
      if (directKey) {
        const decryptedMessage = await crypto.decryptWithSymmetricKey(directKey, newMessage.content, newMessage.iv);
        setMessages(prevMessages => [{ ...newMessage, content: decryptedMessage }, ...prevMessages]);
      } else {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    });

    socket.on("previousDirectMessages", async (previousMessages) => {
      if (directKey) {
        const decryptedMessages = await Promise.all(
          previousMessages.map(async (msg) => {
            const decrypted = await crypto.decryptWithSymmetricKey(directKey, msg.content, msg.iv);
            return { ...msg, content: decrypted };
          })
        );
        setMessages(decryptedMessages);
      } else {
        setMessages(previousMessages);
      }
    });

    return () => {
      socket.off("directMessage");
      socket.off("previousDirectMessages");
    };
  }, [currentUser.id, directMessageId, directKey]);

  return (
    <div className="flex flex-col flex-grow pr-1 bg-primary-1 h-screen text-white">
      <ChatHeader type="DM" name={friend.username} />
      <ChatMessages
        type="DM"
        name={friend.username}
        messages={messages}
        owner={currentUser.id}
        directMessageId={directMessageId}
        groupKey={directKey}
      />
      <ChatInput
        type="DM"
        channelId={directMessageId}
        name={friend.username}
        socket={socket}
        directMessageId={directMessageId}
        groupKey={directKey}
      />
    </div>
  );
};

export default PersonalMessage;
