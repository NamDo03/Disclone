import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DMItem = ({ avatar, name, conversationId}) => {
  const param = useParams();
  const navigate = useNavigate();
  return (
    <div
      onClick={()=>navigate(`/dm/${conversationId}`)}
      className={`flex justify-between items-center px-3 py-2 rounded group hover:bg-zinc-700/50 cursor-pointer group ${
        param.conversationId == conversationId && "bg-zinc-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <img className="w-9 h-9 object-cover rounded-full" src={avatar} />
        <p className="text-zinc-400 font-semibold group-hover:text-zinc-300">
          {name}
        </p>
      </div>
    </div>
  );
};

export default DMItem;
