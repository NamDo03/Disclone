import React, { useEffect, useState } from "react";
import ServerHeader from "./ServerHeader";
import ServerSection from "./ServerSection";
import { PiHashBold } from "react-icons/pi";
import { BiSolidVolumeFull } from "react-icons/bi";
import { useParams } from "react-router-dom";
import UserControls from "./UserControls";
import ChannelItem from "./ChannelItem";
import { getServerById } from "../../api/serverService";
import { useDispatch, useSelector } from "react-redux";
import { setChannels } from "../../redux/channelSlice";

const ServerSideBar = () => {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const [isTextChannelsExpanded, setTextChannelsExpanded] = useState(true);
  const [isVoiceChannelsExpanded, setVoiceChannelsExpanded] = useState(true);

  const toggleTextChannels = () =>
    setTextChannelsExpanded(!isTextChannelsExpanded);
  const toggleVoiceChannels = () =>
    setVoiceChannelsExpanded(!isVoiceChannelsExpanded);

  useEffect(() => {
    const fetchServerById = async () => {
      try {
        const serverData = await getServerById(serverId);
        dispatch(setChannels(serverData.channels));
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    };
    fetchServerById();
  }, [serverId]);


  return (
    <div className="flex flex-col bg-primary-2 h-full w-full text-white">
      <ServerHeader />
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="m-2">
          <ServerSection
            name="Text channels"
            isExpanded={isTextChannelsExpanded}
            toggleExpand={toggleTextChannels}
          />
          {isTextChannelsExpanded && (
            <>
              {channels
                .filter((channel) => channel.type === "TEXT")
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    name={channel.channel_name}
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
              {channels
                .filter((channel) => channel.type === "VOICE")
                .map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    name={channel.channel_name}
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
