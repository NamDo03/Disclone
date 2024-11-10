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

export default function VideoCall() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const clientRef = useRef(null);
  const hasJoinedCall = useRef(false);
  const [call, setCall] = useState(null);
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();

  useEffect(() => {
    if (!serverId || !channelId) {
      navigate("/page-not-found");
      return;
    }

    const fetchData = async () => {
      try {
        const serverData = await getServerById(serverId);
        const foundChannel = serverData.channels.find(
          (channel) => channel.id === Number(channelId)
        );
        if (!foundChannel) {
          navigate("/page-not-found");
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
    return clientRef.current;
  };

  useEffect(() => {
    const handleGetCall = ({ apiKey, callId, token, user }) => {
      if (!hasJoinedCall.current) {
        const client = getOrCreateInstance(apiKey, token, user);
        const callInstance = client.call('default', callId);
        callInstance.join({ create: true });
        setCall(callInstance);
        hasJoinedCall.current = true;
      }
    };

    socket.on("getCall", handleGetCall);
    socket.emit('joinCall', { serverId, channelId, currentUser });

    return () => {
      if (call) {
        call.leave();
      }
      socket.off("getCall", handleGetCall);
      setCall(null);
      hasJoinedCall.current = false;
    };
  }, [currentUser, serverId, channelId]);

  return (
    clientRef.current && call ? (
      <StreamVideo client={clientRef.current}>
        <StreamTheme>
          <StreamCall call={call}>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls onLeave={() => {
              if (call) {
                call.leave();
              }
              setCall(null);
              clientRef.current = null;
              hasJoinedCall.current = false;
              navigate('/');
            }}/>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    ) : (
      <div>Loading Call...</div>
    )
  );
}