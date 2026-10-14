import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = () => (
  <div className="min-h-dvh overflow-x-clip bg-page lg:flex">
    <Sidebar />
    <main className="min-h-[calc(100dvh-4rem)] min-w-0 flex-1 pb-24 lg:min-h-dvh lg:pb-0">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9 2xl:px-10">
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
