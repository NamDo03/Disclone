import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

export const CustomToggleAudioPublishingButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <>
      <button
        onClick={() => microphone.toggle()}
        className="p-1.5 hover:bg-zinc-700 rounded"
        data-tooltip-id="microphone"
        data-tooltip-content={
          isMute ? "Turn On Microphone" : "Turn Off Microphone"
        }
        data-tooltip-place="top"
      >
        {isMute ? (
          <FaMicrophoneSlash size={20} className="text-red-500" />
        ) : (
          <FaMicrophone size={18} className="text-zinc-300" />
        )}
      </button>
      <Tooltip
        id="microphone"
        className="text-xs"
        style={{ backgroundColor: "#111214", color: "#fff" }}
      />
    </>
  );
};
