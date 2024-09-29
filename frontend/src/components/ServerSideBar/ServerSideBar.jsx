import React, { useEffect, useState } from "react";
import ServerHeader from "./ServerHeader";
import ServerSection from "./ServerSection";
import { PiHashBold } from "react-icons/pi";
import { BiSolidVolumeFull } from "react-icons/bi";
import { useParams } from "react-router-dom";
import servers from "../../fakeApi";
import UserControls from "./UserControls";
import ChannelItem from "./ChannelItem";

const ServerSideBar = () => {
  const { serverId } = useParams();
  const [serverData, setServerData] = useState(null);
  const [isTextChannelsExpanded, setTextChannelsExpanded] = useState(true);
  const [isVoiceChannelsExpanded, setVoiceChannelsExpanded] = useState(true);

  const toggleTextChannels = () =>
    setTextChannelsExpanded(!isTextChannelsExpanded);
  const toggleVoiceChannels = () =>
    setVoiceChannelsExpanded(!isVoiceChannelsExpanded);

  useEffect(() => {
    const server = servers.find((server) => server.id === serverId);
    setServerData(server);
  }, [serverId]);

  if (!serverData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col bg-primary-2 h-full w-full text-white">
      <ServerHeader name={serverData.name} />
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="m-2">
          <ServerSection
            name="Text channels"
            isExpanded={isTextChannelsExpanded}
            toggleExpand={toggleTextChannels}
          />
          {isTextChannelsExpanded && (
            <>
              {serverData.channels
                .filter((channel) => channel.type === "text")
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    name={channel.name}
                    Icon={PiHashBold}
                  />
                ))}
            </>
          )}
        </div>
        <div className="m-2">
          <ServerSection
            name="Voice channels"
            isExpanded={isVoiceChannelsExpanded}
            toggleExpand={toggleVoiceChannels}
          />
          {isVoiceChannelsExpanded && (
            <>
              {serverData.channels
                .filter((channel) => channel.type === "voice")
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    name={channel.name}
                    Icon={BiSolidVolumeFull}
                  />
                ))}
            </>
          )}
        </div>
      </div>
      <UserControls />
    </div>
  );
};

export default ServerSideBar;
