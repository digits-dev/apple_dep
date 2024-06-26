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
            } duration-300 p-5 pt-8 h-screen relative`}
        >
            <div
                className="bg-login-bg-color absolute cursor-pointer rounded-full -right-3 top-[20px] border-2 border-black p-2 flex items-center justify-center"
                onClick={() => setOpen(!open)}
            >
                <img
                    src="/images/navigation/dashboard-arrow-icon.png"
                    className={`w-2 ${!open && "rotate-180"}`}
                />
            </div>
            <div className="flex gap-x-4 items-center">
                <img
                    src="/images/login-page/btb-logo-white.png"
                    className="w-10 cursor-pointer duration-500"
                />
                <p
                    className={`text-white origin-left font-medium text-xl ${
                        !open && "scale-0"
                    }`}
                >
                    DEP
                </p>
            </div>
        </div>
    );
};

export default AppSidebar;
