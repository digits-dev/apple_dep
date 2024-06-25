import React, { useContext, useEffect, useRef } from "react";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppNavbar from "@/Layouts/layout/AppNavbar.jsx";

const Layout = ()=>{
    return(
      <React.Fragment>
        <div>
            <AppNavbar />
            <AppSidebar />
            <AppFooter />
        </div>
      </React.Fragment>
    );
}

export default Layout