import React, { useEffect, useState } from "react";
import ServerHeader from "./ServerHeader";
import ServerSection from "./ServerSection";
import { PiHashBold } from "react-icons/pi";
import { BiSolidVolumeFull } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import UserControls from "./UserControls";
import ChannelItem from "./ChannelItem";
import { getServerById } from "../../api/serverService";
import { useDispatch, useSelector } from "react-redux";
import {
  removeChannel,
  setChannels,
  addChannel,
  updateChannelDetails,
} from "../../redux/channelSlice";
import { socket } from "../../pages/ChannelPage";

const ServerSideBar = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const [isTextChannelsExpanded, setTextChannelsExpanded] = useState(true);
  const [isVoiceChannelsExpanded, setVoiceChannelsExpanded] = useState(true);
  const [firstChannel, setFirstChannel] = useState(null);

  const toggleTextChannels = () =>
    setTextChannelsExpanded(!isTextChannelsExpanded);
  const toggleVoiceChannels = () =>
    setVoiceChannelsExpanded(!isVoiceChannelsExpanded);

  useEffect(() => {
    const fetchServerById = async () => {
      try {
        const serverData = await getServerById(serverId);
        setFirstChannel(serverData.channels[0].id);
        dispatch(setChannels(serverData.channels));
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    };
    fetchServerById();

    socket.on("channelCreated", (newChannel) => {
      dispatch(addChannel(newChannel));
    });

    socket.on("channelUpdated", (updatedChannel) => {
      dispatch(updateChannelDetails(updatedChannel));
    });

    socket.on("channelDeleted", (channelId) => {
      dispatch(removeChannel({ id: channelId }));
      navigate(`/servers/${serverId}/channels/${firstChannel}`);
    });

    return () => {
      socket.off("channelCreated");
      socket.off("channelUpdated");
      socket.off("channelDeleted");
    };
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
                .map((channel, index) => (
                  <ChannelItem
                    key={channel.id}
                    index={index}
                    id={channel.id}
                    type={channel.type}
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
                .map((channel, index) => (
                  <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    index={index}
                    name={channel.channel_name}
                    type={channel.type}
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
