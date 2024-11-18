import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiMiniCamera } from "react-icons/hi2";
import { PiHashBold } from "react-icons/pi";
import { createPortal } from "react-dom";
import { getChannelById, updateChannel } from "../../api/channelService";
import { getServerById, updateServer } from "../../api/serverService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateServerDetails } from "../../redux/serverSlice";
import { updateChannelDetails } from "../../redux/channelSlice";
import { socket } from "../../pages/ChannelPage";

const EditModal = ({ type, toggleModal, serverId, channelId }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const inputRef = useRef();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type.toLowerCase() === "server" && serverId) {
          const serverData = await getServerById(serverId);
          setName(serverData.server_name);
          setImage(serverData.image_url);
        } else if (type.toLowerCase() === "channel" && channelId) {
          const channelData = await getChannelById(channelId);
          setName(channelData.channel_name);
        }
      } catch (error) {
        toast.error("Failed to load data:" + error.message);
      }
    };

    fetchData();
  }, [type, serverId, channelId]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = () => {
    setImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type.toLowerCase() === "server") {
        const updatedServer = await updateServer(
          serverId,
          name,
          image,
          currentUser.id
        );
        dispatch(updateServerDetails(updatedServer.server));
        toast.success("Server updated successfully");
      } else if (type.toLowerCase() === "channel") {
        const updatedChannel = await updateChannel(
          channelId,
          name,
          currentUser.id
        );
        toast.success("Channel updated successfully");

        socket.emit("updateChannel", {
          updatedChannel: updatedChannel.channel,
          serverId: serverId,
        });
      }

      setTimeout(() => {
        setLoading(toggleModal());
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="min-w-[450px] max-w-[580px] bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-zinc-200 font-semibold capitalize">
              Edit {type}
            </h2>
            <button
              onClick={toggleModal}
              className="text-zinc-400 hover:text-zinc-200 flex justify-end items-center"
            >
              <IoClose size={24} />
            </button>
          </div>

          <form>
            <div className="py-5">
              {type.toLowerCase() === "server" && (
                <div className="flex items-center justify-center text-center my-5">
                  {image ? (
                    <div className="relative">
                      <img
                        className="w-[100px] h-[100px] rounded-full object-cover"
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt="serverImg"
                      />
                      <IoClose
                        size={24}
                        onClick={handleImageRemove}
                        className="bg-red-500 rounded-full cursor-pointer absolute top-0 right-0"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={handleImageClick}
                      className="w-[100px] h-[100px] p-8 flex flex-col justify-center items-center rounded-full border-dashed border-2 bg-zinc-600 cursor-pointer"
                    >
                      <input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col justify-center items-center gap-1 text-zinc-300">
                        <HiMiniCamera size={30} />
                        <p className="uppercase text-xs font-semibold">
                          Upload
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor="input"
                  className="uppercase text-xs font-bold text-zinc-400"
                >
                  {type} name
                </label>
                <input
                  id="input"
                  type="text"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-primary-3/80 py-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-300 outline-none rounded
                    ${type.toLowerCase() === "channel" ? "pl-8" : "px-3"}
                    `}
                  placeholder={`Enter ${type} name`}
                />
                {type.toLowerCase() === "channel" && (
                  <PiHashBold
                    size={18}
                    className="absolute text-zinc-400 bottom-3 left-2"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <div
            onClick={toggleModal}
            className="hover:underline px-4 py-1 text-sm cursor-pointer"
          >
            Cancel
          </div>
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded font-semibold text-sm ${
              name && (type.toLowerCase() === "server" ? image : true)
                ? "bg-main cursor-pointer hover:bg-main/85 text-white"
                : "bg-main/50 cursor-not-allowed text-zinc-400"
            } 
            ${loading && "bg-main/50 cursor-not-allowed text-zinc-400"}
            `}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default EditModal;
