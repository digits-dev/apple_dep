import React, { useEffect, useState, useContext } from "react";
import { Link } from "@inertiajs/react";
import { NavbarContext } from "../../Context/NavbarContext";
import SidebarAccordion from "../../Components/Sidebar/SidebarAccordion";

const capitalizeWords = (str) => {
    const smallWords = [
        "a",
        "an",
        "and",
        "as",
        "at",
        "but",
        "by",
        "for",
        "if",
        "in",
        "nor",
        "of",
        "on",
        "or",
        "so",
        "the",
        "to",
        "up",
        "yet",
    ];

    return str
        .split("_")
        .map((word, index) => {
            if (index === 0 && word === word.toUpperCase()) {
                return word;
            } else if (!smallWords.includes(word.toLowerCase())) {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            } else {
                return word.toLowerCase();
            }
        })
        .join(" ");
};

const formatActiveSlug = (pathname) => {
    const segments = pathname.split("/");
    const lastSegment = segments.pop() || segments.pop();
    return lastSegment;
};

const formatSlug = (pathname) => {
    const segments = pathname.split("/");
    const lastSegment = segments.pop() || segments.pop();
    return capitalizeWords(lastSegment);
};

const AppSidebar = () => {
    const [open, setOpen] = useState(true);

    const { setTitle } = useContext(NavbarContext);

    const handleMenuClick = (newTitle) => {
        setTitle(newTitle);
    };

    // console.log(links);

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
                <Link
                    href="dashboard"
                    onClick={() => handleMenuClick("Dashboard")}
                >
                    <li
                        className={`text-white text-sm flex items-center gap-x-4 cursor-pointer px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] mb-2 ${
                            formatActiveSlug(window.location.pathname) ===
                            "dashboard"
                                ? "active"
                                : ""
                        }`}
                    >
                        <img
                            src="/images/navigation/dashboard-icon.png"
                            className="w-[24px] h-[24px]"
                        />
                        <p
                            className={`font-nunito-sans font-semibold single-line ${
                                !open && "hidden"
                            } `}
                        >
                            Dashboard
                        </p>
                    </li>
                </Link>
            </ul>
            <SidebarAccordion open={open} />
        </div>
    );
};

export default AppSidebar;
