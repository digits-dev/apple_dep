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
                    className="w-10 cursor-pointer duration-500"
                />
                <p
                    className={`text-white origin-left font-medium text-[24px] ${
                        !open && "scale-0"
                    }`}
                >
                    DEP
                </p>
            </div>
            <ul className="bg-white mt-10">
                <li>
                    <Link href="dashboard">Dashboard</Link>
                </li>
                {links.map((menu, index) => (
                    <li key={index}>
                        {menu.children ? (
                            <>
                                <div onClick={() => toggleMenu(index)}>
                                    {menu.name}
                                </div>
                                <ul
                                    className={`submenu ${
                                        openMenu === index ? "open" : ""
                                    }`}
                                >
                                    {menu.children.map((submenu, subIndex) => (
                                        <li key={subIndex}>
                                            <Link href={submenu.url}>
                                                {submenu.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <Link href={menu.url}>{menu.name}</Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppSidebar;
