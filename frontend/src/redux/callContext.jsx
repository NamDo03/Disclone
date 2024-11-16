import React, { createContext, useContext, useState } from "react";

const CallContext = createContext();

export const useCall = () => {
  return useContext(CallContext);
};

export const CallProvider = ({ children }) => {
  const [callVideo, setCallVideo] = useState(null);
  const [client, setClient] = useState(null);
  const [channelId, setChannelId] = useState(null);

  return (
    <CallContext.Provider
      value={{
        callVideo,
        setCallVideo,
        client,
        setClient,
        channelId,
        setChannelId,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
