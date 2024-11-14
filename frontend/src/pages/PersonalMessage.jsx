import React, { useEffect, useState } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import { useParams } from "react-router-dom";
import { getDMById, getUserById } from "../api/userService";
import { useSelector } from "react-redux";
import { socket } from "./ChannelPage";

const PersonalMessage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { directMessageId } = useParams();
  const [friend, setFriend] = useState({});
  const [messages, setMessages] = useState([]);

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

    if (currentUser.id && directMessageId) {
      socket.emit("joinDirectMessage", {
        directMessageId,
      });
    }
    socket.on("directMessage", (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    socket.on("previousDirectMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    return () => {
      socket.off("directMessage");
      socket.off("previousDirectMessages");
    };
  }, [currentUser.id, directMessageId]);

  return (
    <div className="flex flex-col flex-grow pr-1 bg-primary-1 h-screen text-white">
      <ChatHeader type="TEXT" name={friend.username} />
      <ChatMessages
        type="TEXT"
        name={friend.username}
        messages={messages}
        owner={currentUser.id}
      />
      <ChatInput
        type="DM"
        channelId={directMessageId}
        name={friend.username}
        socket={socket}
        directMessageId={directMessageId}
      />
    </div>
  );
};

export default PersonalMessage;
