import Navbar from "./Navbar";
import { Outlet } from "react-router";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <>
      <div className="relative">
        <div className="fixed top-0 w-full z-100">
          <Navbar />
        </div>
        <main className="">
          <Outlet />
        </main>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
