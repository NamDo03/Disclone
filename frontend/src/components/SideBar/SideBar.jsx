import React from "react";
import SideBarAction from "./SideBarAction";
import SideBarItem from "./SideBarItem";
import { FaPlus } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import useModal from "../../hooks/useModal";
import LogoutModal from "../Modal/LogoutModal";
import servers from "../../fakeApi";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { isOpenModal, toggleModal } = useModal();
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex flex-col justify-between items-center bg-primary-3 text-white shadow-lg py-3">
      <div className="space-y-4">
        <SideBarAction
          name="home"
          content="Home"
          Icon={FaHome}
          handleAction={() => navigate("/servers/@me")}
        />

        <div className="h-[2px] bg-primary-1 rounded-md w-10 mx-auto" />

        <div className="flex flex-col gap-5 w-full">
          {servers.map((server) => (
            <SideBarItem
              key={server.id}
              id={server.id}
              name={server.name}
              imgUrl={server.imageUrl}
              channels={server.channels}
            />
          ))}
        </div>

        <div className="h-[2px] bg-primary-1 rounded-md w-10 mx-auto" />

        <SideBarAction
          name="plus"
          content="Add a Server"
          Icon={FaPlus}
          handleAction={() => console.log("Add a Server")}
        />
      </div>

      <div className="pb-3 flex items-center flex-col gap-y-4">
        <SideBarAction
          name="logout"
          content="Logout"
          Icon={MdLogout}
          bgColor="group-hover:bg-red-1"
          textColor="text-red-1"
          handleAction={toggleModal}
        />
      </div>
      {isOpenModal && <LogoutModal toggleModal={toggleModal} />}
    </div>
  );
};

export default SideBar;
