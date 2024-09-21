import React from "react";
import SideBar from "../components/SideBar/SideBar";
import ServerSideBar from "../components/ServerSideBar/ServerSideBar";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="hidden md:flex h-full w-[72px] z-[100] flex-col fixed inset-y-0">
        <SideBar />
      </div>
      <div className="md:pl-[72px] h-full">
        <div className="hidden md:flex h-full w-60 z-30 flex-col fixed inset-y-0">
          <ServerSideBar />
        </div>
        <main className="md:pl-60">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
