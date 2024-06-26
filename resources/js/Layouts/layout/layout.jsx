import React, { useContext, useEffect, useRef } from "react";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppNavbar from "@/Layouts/layout/AppNavbar.jsx";
import AppContent from "@/Layouts/layout/AppContent.jsx";
const Layout = ({ children }) => {
    return (
        <>
            <div className="h-screen bg-mobile-gradient flex">
                <AppSidebar />
                <div className="bg-white w-full flex flex-col">
                    <AppNavbar />
                    <AppContent>{children}</AppContent>
                    <AppFooter />
                </div>
            </div>
        </>
    );
};

export default Layout;
