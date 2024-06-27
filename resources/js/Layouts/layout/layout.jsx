import React, { useContext, useEffect, useRef, useState } from "react";
import AppFooter from "@/Layouts/layout/AppFooter.jsx";
import AppSidebar from "@/Layouts/layout/AppSidebar.jsx";
import AppNavbar from "@/Layouts/layout/AppNavbar.jsx";
import AppContent from "@/Layouts/layout/AppContent.jsx";


const Layout = ({ children }) => {
    
    return (
        <div className="h-screen bg-mobile-gradient flex">
            <AppSidebar />
            <div className="bg-red-100 w-full flex flex-col">
                <AppNavbar />
                <div className="bg-white flex-1 w-full flex flex-col overflow-auto">
                    <div className="flex-1">
                        <AppContent>{children}</AppContent>
                    </div>
                    <AppFooter />
                </div>
            </div>
        </div>
    );
};

export default Layout;
