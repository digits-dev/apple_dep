import React, { useEffect, useState, useContext } from "react";
import { Link, usePage } from "@inertiajs/react";
import { NavbarContext } from "../../Context/NavbarContext";
import SidebarAccordion from "../../Components/Sidebar/SidebarAccordion";

const AppSidebar = () => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOpen(false);
            }else{
                setOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={`${
                open ? "w-72" : "w-20"
            } duration-300 p-5 pt-5 h-full relative select-none`}
        >
            {/* BUTTON */}
            <div
                className="bg-login-bg-color absolute cursor-pointer rounded-full -right-3 top-[20px] border-2 border-black p-2 flex items-center justify-center"
                onClick={() => setOpen(!open)}
            >
                <img
                    src="/images/navigation/dashboard-arrow-icon.png"
                    className={`w-2 ${!open && "rotate-180"}`}
                />
            </div>
            {/* LOGO */}
            <div className="flex gap-x-4 items-center">
                <img
                    src="/images/login-page/btb-logo-white.png"
                    className={`w-10 cursor-pointer duration-500 ${
                        open && "rotate-[360deg]"
                    }`}
                />
                <div
                    className={`text-white origin-left font-medium flex items-center ${
                        !open && "scale-0"
                    }`}
                >
                    <div className="h-[50px] w-[1.5px] bg-white"></div>
                    <p className="ml-5 font-semibold text-[25px]">DEP</p>
                </div>
            </div>

            {/* SIDEBAR */}
            <SidebarAccordion open={open} />
        </div>
    );
};

export default AppSidebar;
