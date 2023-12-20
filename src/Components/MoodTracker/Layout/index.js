import React from "react";
import Header from "../Header";
import Footer from "../Footer";

import "./index.scss";

const Layout = (props) => {
  return (
    <>
      <Header />
      <main className="mt-24 mx-2 lg:mx-auto max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8 min-h-85 flex flex-col">
        {props.children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
