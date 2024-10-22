import React from "react";
import DMItem from "./DMItem";

const DMList = ({ listFriend }) => {
  return (
    <div className=" overflow-y-auto px-2">
      {listFriend.map((friend) => (
        <DMItem avatar={friend.avatar} name={friend.username} key={friend.id} id={friend.id} conversationId={friend.conversationId}/>
      ))}
    </div>
  );
};

export default DMList;
