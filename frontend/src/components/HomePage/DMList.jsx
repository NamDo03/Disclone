import React from "react";
import DMItem from "./DMItem";

const DMList = ({ listFriend }) => {
  return (
    <div className=" overflow-y-auto px-2">
      {listFriend.map((friend) => (
        <DMItem
          avatar={friend.user.avatar_url}
          name={friend.user.username}
          key={friend.user.id}
          conversationId={friend.id}
        />
      ))}
    </div>
  );
};

export default DMList;
