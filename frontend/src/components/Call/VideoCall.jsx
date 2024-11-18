import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../pages/ChannelPage";
import { getServerById } from "../../api/serverService";
import { useCall } from "../../redux/callContext";

export default function VideoCall() {
  const { setCallVideo, setClient, setChannelId } = useCall();
  const currentUser = useSelector((state) => state.user.currentUser);
  const clientRef = useRef(null);
  const hasJoinedCall = useRef(false);
  const [call, setCall] = useState(null);
  const [firstChannelId, setFirstChannelId] = useState(null);
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();
  useEffect(() => {
    if (!serverId) {
      navigate("/page-not-found");
      return;
    }
    const fetchData = async () => {
      try {
        const serverData = await getServerById(serverId);
        setFirstChannelId(serverData.channels[0].id)
        const foundChannel = serverData.channels.find(
          (channel) => channel.id === Number(channelId)
        );
        if (!foundChannel) {
          navigate(`/servers/${serverId}/channels/${firstChannelId}`);
          return;
        }
      } catch (err) {
        if (err.message.includes("Server not found")) {
          navigate("/page-not-found");
        } else {
          console.log(err.message);
        }
      }
    };
    setChannelId(channelId);
    fetchData();
    return () => {
      if (call) {
        call.leave();
      }
      clientRef.current = null;
      hasJoinedCall.current = false;
    };
  }, [serverId, channelId, call]);

  const getOrCreateInstance = (apiKey, token, user) => {
    if (!clientRef.current) {
      clientRef.current = new StreamVideoClient({ apiKey, user, token });
    }
    setClient(clientRef.current);
    return clientRef.current;
  };

  useEffect(() => {
    const handleGetCall = ({ apiKey, callId, token, user }) => {
      if (!hasJoinedCall.current) {
        const client = getOrCreateInstance(apiKey, token, user);
        const callInstance = client.call("default", callId);
        callInstance.join({ create: true });
        setCall(callInstance);
        setCallVideo(callInstance);
        hasJoinedCall.current = true;
      }
    };

    socket.on("getCall", handleGetCall);
    socket.emit("joinCall", { serverId, channelId, currentUser });
    return () => {
      if (call) {
        call.leave();
      }
      socket.off("getCall", handleGetCall);
      setCall(null);
      setCallVideo(null);
      hasJoinedCall.current = false;
      clientRef.current = null;
    };
  }, [currentUser, serverId, channelId]);

  return clientRef.current && call ? (
    <StreamVideo client={clientRef.current}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout participantsBarPosition="bottom" />
          <CallControls
            onLeave={() => {
              if (call) {
                call.leave();
              }
              setCall(null);
              clientRef.current = null;
              hasJoinedCall.current = false;
              navigate(`/servers/${serverId}/channels/${firstChannelId}`);
            }}
          />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  ) : (
    <div>Loading Call...</div>
  );
}
