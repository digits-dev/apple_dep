import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import axios from "axios";

const AppSidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [open, setOpen] = useState(true);
    const [links, setLinks] = useState([]);
    const toggleMenu = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };

    useEffect(() => {
        axios
            .get("/sidebar")
            .then((response) => {
                setLinks(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the sidebar data!",
                    error
                );
            });
    }, []);

    return (
        <div
            className={`${
                open ? "w-72" : "w-20"
            } duration-300 p-5 pt-5 h-full relative`}
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
            <ul
                className={`mt-20 max-h-[500px] overflow-x-hidden ${
                    open ? "overflow-y-auto" : "overflow-y-hidden"
                }`}
            >
                <Link href="dashboard">
                    <li className="text-white text-sm flex items-center gap-x-4 cursor-pointer px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] mb-2 active">
                        <img
                            src="/images/navigation/dashboard-icon.png"
                            className="w-[24px] h-[24px]"
                        />
                        <p
                            className={`font-nunito-sans font-semibold ${
                                !open && "scale-0"
                            }`}
                        >
                            Dashboard
                        </p>
                    </li>
                </Link>

                {links.map((menu, index) => (
                    <Link href={menu.url}>
                        <li
                            key={index}
                            className="text-white text-sm flex items-center gap-x-4 cursor-pointer px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] mb-2"
                        >
                            <img
                                src={menu.icon}
                                className="w-[24px] h-[24px]"
                            />
                            <p
                                className={`font-nunito-sans font-semibold ${
                                    !open && "scale-0"
                                }`}
                            >
                                {menu.name}
                            </p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default AppSidebar;
