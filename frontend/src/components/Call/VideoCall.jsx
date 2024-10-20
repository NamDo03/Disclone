import { StreamCall, StreamVideo, StreamVideoClient, StreamTheme, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './style.css';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const apiKey = 'mmhfdzb5evj2';
const token = import.meta.env.VITE_CALL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0JpYl9Gb3J0dW5hIiwidXNlcl9pZCI6IkJpYl9Gb3J0dW5hIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MjkzOTc4NTIsImV4cCI6MTczMDAwMjY1Mn0.woEePdddpfjywYDSqKWoxPFeaFINMads7effB6rKcm4';
const callId = 'yFYamwIDNPtJ';
const userId = 'Bib_Fortuna';

export default function VideoCall() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [client, setClient] = useState();
  const [call, setCall] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const user = {
      id: userId || currentUser.id,
      name: currentUser.username,
      image: currentUser.avatar_url,
    };
    
    const client = new StreamVideoClient({ apiKey, user, token });
    setClient(client)
    const call = client.call('default', callId);
    setCall(call)
    call.join({ create: true });

    return () => {
      client.disconnectUser();
      setClient(undefined);
    };
  },[currentUser])

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout participantsBarPosition='bottom' />
          <CallControls onLeave={() => {client.disconnectUser(); setClient(undefined); navigate('/')}}/>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

