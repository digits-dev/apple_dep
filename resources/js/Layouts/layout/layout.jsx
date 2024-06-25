import React, { useContext, useEffect, useRef } from "react";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppNavbar from "@/Layouts/layout/AppNavbar.jsx";
import AppContent from "@/Layouts/layout/AppContent.jsx";
const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div>
                <AppNavbar />
                <AppSidebar />
                <AppContent>{children}</AppContent>
                <AppFooter />
            </div>
        </React.Fragment>
    );
};

export default Layout;
