import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavbarContext } from "../../Context/NavbarContext";

const SidebarAccordion = ({ open }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const { setTitle } = useContext(NavbarContext);
    const { auth } = usePage().props;

    const SuperAdminMenus = [
        {
            title: "Privileges",
            url: "privileges",
            image: "/images/navigation/privileges-icon.png",
        },
        {
            title: "User Management",
            url: "users",
            image: "/images/navigation/user-management-icon.png",
        },
        {
            title: "Menu Management",
            url: "menu_management",
            image: "/images/navigation/user-management-icon.png",
        },
        {
            title: "Module Generator",
            url: "module_generator",
            image: "/images/navigation/user-management-icon.png",
        },
    ];

    useEffect(() => {
        if (!open) {
            setIsOpen(false);
        }
    }, [open]);

    const handleToggle = (index) => {
        if (activeIndex === index) {
            setIsOpen(!isOpen);
        } else {
            setActiveIndex(index);
            setIsOpen(true);
        }
    };

    const formatActiveSlug = (pathname) => {
        const segments = pathname.split("/");
        const lastSegment = segments.pop() || segments.pop();
        return lastSegment;
    };

    useEffect(() => {
        axios
            .get("/sidebar")
            .then((response) => {
                setLinks(response.data);
                setIsOpen(true);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the sidebar data!",
                    error
                );
            });
    }, []);
    console.log(links);
    const handleMenuClick = (newTitle) => {
        setTitle(newTitle);
    };

    return (
        <div
            className={`mt-20 max-h-[calc(100%_-_10rem)] overflow-x-hidden ${
                open ? "overflow-y-auto" : "overflow-y-hidden"
            }`}
        >
            <ul>
                <Link
                    href={`${window.location.origin}/dashboard`}
                    onClick={() => {
                        handleMenuClick("Dashboard");
                        setIsOpen(false);
                    }}
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
            {links.map((item, index) => (
                <div
                    key={index}
                    className=" text-white text-[14px] font-nunito-sans mb-2"
                >
                    {item.children ? (
                        <div
                            className={`flex cursor-pointer items-center justify-between px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px]`}
                            onClick={() => handleToggle(index)}
                        >
                            <i
                                className={`w-[24px] h-[24px] ${item.icon} text-[24px]`}
                            ></i>
                            <span
                                className={`pl-4 flex-1 font-semibold  ${
                                    !open && "hidden"
                                } `}
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item.name}
                            </span>
                            <div className="mr-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
                                    className={`h-1 w-2 transition-transform duration-300 ${
                                        activeIndex === index && isOpen
                                            ? "rotate-180"
                                            : ""
                                    } ${!open && "hidden"} ${
                                        item.children ? "" : "hidden"
                                    }`}
                                    alt="toggle icon"
                                />
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={item.url}
                            onClick={() => handleMenuClick(item.name)}
                        >
                            <div
                                className={`relative flex cursor-pointer items-center justify-between px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] ${
                                    formatActiveSlug(
                                        window.location.pathname
                                    ) === item.slug
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleToggle(index)}
                            >
                                <i
                                    className={`w-[24px] h-[24px] ${item.icon} text-[24px] text-center`}
                                ></i>
                                <span
                                    className={`pl-4 flex-1 font-semibold single-lines ${
                                        !open && "hidden"
                                    } `}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {item.name}
                                </span>
                                <div className="mr-2">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
                                        className={`h-1 w-2 transition-transform duration-300 ${
                                            activeIndex === index && isOpen
                                                ? "rotate-180"
                                                : ""
                                        } ${!open && "hidden"} ${
                                            item.children ? "" : "hidden"
                                        }`}
                                        alt="toggle icon"
                                    />
                                </div>
                            </div>
                        </Link>
                    )}

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            activeIndex === index && isOpen
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        {item.children && (
                            <div>
                                {item.children.map((child, childIndex) => (
                                    <Link
                                        href={child.url}
                                        onClick={() =>
                                            handleMenuClick(
                                                item.name + " - " + child.name
                                            )
                                        }
                                        key={childIndex}
                                    >
                                        <div
                                            className={` ml-3  transition-opacity duration-500 flex relative ${
                                                isOpen
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                            key={childIndex}
                                        >
                                            <div
                                                className={`h-full w-2 absolute  ${
                                                    item.children.length ==
                                                    childIndex + 1
                                                        ? ""
                                                        : "border-l-2"
                                                }`}
                                            ></div>
                                            <div className="flex flex-col last:border-none">
                                                <div className="border-l-2 border-b-2 rounded-bl-[5px] flex-1 w-5 "></div>
                                                <div className="border-l-none flex-1 w-2 "></div>
                                            </div>
                                            <div
                                                className={`p-2 flex flex-1 rounded-[5px] my-1 hover:bg-sidebar-hover-color cursor-pointer ${
                                                    open &&
                                                    formatActiveSlug(
                                                        window.location.pathname
                                                    ) === child.slug
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <i
                                                    className={`w-[18px] h-[18px] ${
                                                        child.icon
                                                    } text-[18px] text-center  ${
                                                        !open && "hidden"
                                                    }`}
                                                ></i>
                                                <p
                                                    className={`text-[12px] scale-0`}
                                                >
                                                    I
                                                </p>
                                                <p
                                                    className={`text-[12px] ml-2 ${
                                                        !open && "hidden"
                                                    } `}
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {child.name}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* SUPER ADMIN SIDE */}
            {auth.sessions.admin_is_superadmin ? (
                <div className="text-white border-t mt-10 border-white ">
                    <div
                        className={`font-nunito-sans text-[14px] mt-5 ${
                            !open ? "text-center" : ""
                        }`}
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {open ? <div>Super Admin</div> : <div>S-Ad</div>}
                    </div>
                    {/* MENUS */}
                    <ul className="mt-5">
                        {SuperAdminMenus.map((menu, index) => (
                            <Link
                                href={`/${menu.url}`}
                                onClick={() => {
                                    handleMenuClick(menu.title);
                                    setIsOpen(false);
                                }}
                                key={index}
                            >
                                <li
                                    className={`text-white text-sm flex items-center gap-x-4 cursor-pointer px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] mb-2 ${
                                        formatActiveSlug(
                                            window.location.pathname
                                        ) === menu.url
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={menu.image}
                                        className="w-[24px] h-[24px]"
                                    />
                                    <p
                                        className={`font-nunito-sans font-semibold single-line ${
                                            !open && "hidden"
                                        } `}
                                    >
                                        {menu.title}
                                    </p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default SidebarAccordion;
