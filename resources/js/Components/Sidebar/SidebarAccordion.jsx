import { Link } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavbarContext } from "../../Context/NavbarContext";
const SidebarAccordion = ({ open }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const { setTitle } = useContext(NavbarContext);

    const handleToggle = (index) => {
        if (activeIndex === index) {
            setIsOpen(!isOpen);
        } else {
            setActiveIndex(index);
            setIsOpen(true);
        }
    };

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

    const formatSlug = (pathname) => {
        const segments = pathname.split("/");
        const lastSegment = segments.pop() || segments.pop();
        return capitalizeWords(lastSegment);
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

    const handleMenuClick = (newTitle) => {
        setTitle(newTitle);
    };

    return (
        <div>
            {links.map((item, index) => (
                <div
                    key={index}
                    className=" text-white text-[14px] font-nunito-sans mb-2"
                >
             
                    <Link
                        href={item.url}
                        onClick={() => handleMenuClick(formatSlug(item.slug))}
                    >
                        <div
                            className="flex cursor-pointer items-center justify-between px-2 py-3 hover:bg-sidebar-hover-color rounded-[10px] "
                            onClick={() => handleToggle(index)}
                        >
                            <img
                                src="/images/navigation/dashboard-icon.png"
                                className="w-[24px] h-[24px]"
                            />
                            <span
                                className={`pl-4 flex-1 font-semibold single-lines ${
                                    !open && "hidden"
                                } `}
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
                                    <div
                                        className={` ml-3  transition-opacity duration-500 flex relative ${
                                            isOpen ? "opacity-100" : "opacity-0"
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
                                        <div className="p-2 flex flex-1 rounded-[5px] my-1 hover:bg-sidebar-hover-color cursor-pointer">
                                            <img
                                                src="/images/navigation/dashboard-icon.png"
                                                className="w-[18px] h-[18px]"
                                            />
                                            <p className="text-[12px] ml-3">
                                                {child.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SidebarAccordion;
