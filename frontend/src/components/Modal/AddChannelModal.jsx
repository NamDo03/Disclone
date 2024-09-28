import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiHashBold } from "react-icons/pi";
import { BiSolidVolumeFull } from "react-icons/bi";


const AddChannelModal = ({ toggleModal }) => {
    const[serverType, setServerType] = useState("text");
    const[serverName, setServerName] = useState("");
    const handleAddServer = () => {console.log(serverType,serverName)}
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="max-w-[400px] w-full bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-zinc-200">Create Channel</h2>
            <button
              onClick={toggleModal}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div>
            <div>
                <p className="text-zinc-400 text-xs mt-4 mb-2 uppercase font-semibold">
                Channel Type
                </p>
                <div className={`flex gap-x-3 items-center justify-between px-3 py-[10px]  rounded-[4px] hover:bg-[#393c41] mb-1 ${serverType==="text" ? " bg-zinc-700":"bg-primary-2"}`}>
                    <PiHashBold size={24}/>
                    <div>
                        <h2 className="text-sm">Text</h2>
                        <p className="text-xs text-zinc-400">Send messages, images, GIFs, emoji and opinions</p>
                    </div>
                    <div className="inline-flex items-center">
                        <label className="relative flex items-center cursor-pointer" htmlFor="text-channel">
                        <input              
                            checked={serverType==="text"}
                            onChange={()=>setServerType("text")}
                            value="text"
                            name="channeltype"
                            type="radio"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-white checked:border-white transition-all"
                            id="text-channel"
                        />
                        <span className="absolute bg-white w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                        </label>
                    </div>
                </div>
                <div className={`flex gap-x-3 items-center justify-between px-3 py-[10px]  rounded-[4px] hover:bg-[#393c41] mb-1 ${serverType==="voice" ? " bg-zinc-700":"bg-primary-2"}`}>
                    <BiSolidVolumeFull size={24}/>
                    <div>
                        <h2 className="text-sm">Voice</h2>
                        <p className="text-xs text-zinc-400">Hangout together with voice, video and scree share</p>
                    </div>
                    <div className="inline-flex items-center">
                        <label className="relative flex items-center cursor-pointer" htmlFor="voice-channel">
                        <input
                            checked={serverType==="voice"}
                            onChange={()=>setServerType("voice")}
                            value="voice"
                            name="channeltype"
                            type="radio"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-white checked:border-white transition-all"
                            id="voice-channel"
                        />
                        <span className="absolute bg-white w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mb-3"> 
                <p className="text-zinc-400 text-xs mt-4 mb-2 uppercase font-semibold">
                Channel Name
                </p>
                <div className="relative text-zinc-300">
                    <input type="text" className="w-full bg-primary-3 py-2 rounded-sm px-7" placeholder="new-channel"
                        onChange={(e)=>setServerName(e.target.value)}
                    />
                    <PiHashBold size={15} className="absolute top-3 left-2 text-zinc-400"/>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <div
            onClick={toggleModal}
            className="hover:underline px-4 py-1 text-sm cursor-pointer"
          >
            Cancel
          </div>
          <button className="px-4 py-1 bg-main rounded-sm cursor-pointer hover:bg-main/85" onClick={handleAddServer}>
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;