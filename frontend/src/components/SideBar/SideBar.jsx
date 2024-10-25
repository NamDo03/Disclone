import React, { useEffect, useState } from "react";
import SideBarAction from "./SideBarAction";
import SideBarItem from "./SideBarItem";
import { FaPlus } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import useModal from "../../hooks/useModal";
import LogoutModal from "../Modal/LogoutModal";
import { useNavigate } from "react-router-dom";
import AddServerModal from "../Modal/AddServerModal";
import { getListOfServers } from "../../api/userService";
import { getListOfChannels } from "../../api/serverService";
import { useDispatch, useSelector } from "react-redux";
import { setServers } from "../../redux/serverSlice";

const SideBar = () => {
  const { isOpenModal: isLogoutModalOpen, toggleModal: toggleLogoutModal } =
    useModal();
  const {
    isOpenModal: isAddServerModalOpen,
    toggleModal: toggleAddServerModal,
  } = useModal();

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const servers = useSelector((state) => state.servers);
  const dispatch = useDispatch();
  const [serverChannels, setServerChannels] = useState({});
  
  const getListServer = async () => {
    try {
      const fetchedServers = await getListOfServers(currentUser.id);
      dispatch(setServers(fetchedServers));
      const channelsData = {};
      for (const server of fetchedServers) {
        try {
          const channels = await getListOfChannels(server.id);
          channelsData[server.id] = channels[0] || null;
        } catch (error) {
          console.error(
            `Error fetching channels for server ${server.id}:`,
            error
          );
        }
      }
      setServerChannels(channelsData);
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  useEffect(() => {
    getListServer();
  }, [currentUser.id]);
  return (
    <div className="h-full w-full flex flex-col justify-between items-center bg-primary-3 text-white shadow-lg py-3">
      <div className="space-y-4">
        <SideBarAction
          name="home"
          content="Home"
          Icon={FaHome}
          handleAction={() => navigate("/")}
        />

        <div className="h-[2px] bg-primary-1 rounded-md w-10 mx-auto" />

        <div className="flex flex-col gap-5 w-full max-h-96 overflow-y-auto scrollbar-hide">
          {servers.map((server) => (
            <SideBarItem
              key={server.id}
              serverId={server.id}
              name={server.server_name}
              imgUrl={server.image_url}
              channels={serverChannels[server.id] || []}
            />
          ))}
        </div>

        <SideBarAction
          name="plus"
          content="Add a Server"
          Icon={FaPlus}
          handleAction={toggleAddServerModal}
        />
      </div>

      <div className="pb-3 flex items-center flex-col gap-y-4">
        <SideBarAction
          name="logout"
          content="Logout"
          Icon={MdLogout}
          bgColor="group-hover:bg-red-1"
          textColor="text-red-1"
          handleAction={toggleLogoutModal}
        />
      </div>
      {isLogoutModalOpen && <LogoutModal toggleModal={toggleLogoutModal} />}

      {isAddServerModalOpen && (
        <AddServerModal
          toggleModal={toggleAddServerModal}
          onServerAdded={getListServer}
        />
      )}
    </div>
  );
};

export default SideBar;
