import Navbar from "./Navbar";
import { Outlet } from "react-router";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
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
