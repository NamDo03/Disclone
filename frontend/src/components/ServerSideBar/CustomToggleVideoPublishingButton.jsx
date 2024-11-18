import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { Tooltip } from "react-tooltip";

export const CustomToggleVideoPublishingButton = () => {
  const { useCameraState } = useCallStateHooks();
  const { camera, isMute } = useCameraState();
  return (
    <>
      <button
        onClick={() => camera.toggle()}
        className="p-1.5 hover:bg-zinc-700 rounded"
        data-tooltip-id="video"
        data-tooltip-content={isMute ? "On Camera" : "Off Camera"}
        data-tooltip-place="top"
      >
        {isMute ? (
          <HiVideoCameraSlash size={22} className="text-red-500" />
        ) : (
          <HiVideoCamera size={22} className="text-zinc-300" />
        )}
      </button>
      <Tooltip
        id="video"
        className="text-xs"
        style={{ backgroundColor: "#111214", color: "#fff" }}
      />
    </>
  );
};
