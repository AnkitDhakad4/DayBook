import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = () => (
  <div className="min-h-screen bg-page lg:flex">
    <Sidebar />
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
