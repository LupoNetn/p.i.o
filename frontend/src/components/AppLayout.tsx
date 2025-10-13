import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <main>
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
