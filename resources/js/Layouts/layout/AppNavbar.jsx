import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { NavbarContext } from "../../Context/NavbarContext";
import NotificationsModal from "../../Components/Modal/NotificationModal";
import axios from "axios";

const AppNavbar = () => {
    const { title } = useContext(NavbarContext);
    const { auth } = usePage().props;
    const [showMenu, setShowMenu] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState({
        id: '',
        title: '',
        subject: '',
        content: ''
    });
    const [notifications, setNotification] = useState([]);

    const menuRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/notifications");
                setNotification(response.data);
            } catch (error) {
                console.error("There was an error fetching the Notification data!", error);
            }
        };

        fetchNotifications();

    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
            setShowNotif(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Do you want to Logout</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.post("/logout");
            }
        });
    };

    const handleToggle = () => {
        setShowMenu(!showMenu);

        if (!showMenu) {
            setShowNotif(false);
        }
    };
    const handleNotif = () => {
        setShowNotif(!showNotif);

        if (!showNotif) {
            setShowMenu(false);
        }
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    }

    return (
        <div
            className="bg-white h-[70px] flex items-center justify-between px-10 py-5 select-none"
            ref={menuRef}
        >
            <p className="font-nunito-sans font-extrabold text-[20px]">
                {title}
            </p>
            <div className="flex">
                <div className="w-10 h-10 hover:bg-zinc-200 flex cursor-pointer select-none text-zinc-700 items-center justify-center rounded-full mr-5" onClick={handleNotif}>
                    <i className="fa-solid fa-bell text-xl"></i>
                </div>
                <img
                    src="/images/navigation/user-icon.png"
                    className="w-10 h-10 cursor-pointer"
                    onClick={handleToggle}
                />
            </div>

            {showNotif && (
                <div className="absolute right-28 top-[65px] bg-white py-3 rounded-[5px] pop-up-boxshadow z-[100] ">
                    <div className="flex items-center gap-5 border-b-[1px] px-5 pb-2 min-w-72">
                        <p className="font-nunito-sans font-semibold">
                            Notifications
                        </p>
                    </div>
                    {notifications &&
                        <div className="max-h-36 overflow-y-auto">
                            {notifications.map((item, index) => (
                            <div className="font-nunito-sans flex hover:bg-zinc-200 cursor-pointer px-1" key={index} 
                                onClick={()=> {
                                    handleModalToggle();  
                                    setSelectedNotif({
                                        id: item.id,
                                        title: item.title,
                                        subject: item.subject,
                                        content: item.content
                                    });
                                }
                            }>
                                <i className="fa-solid fa-circle-info text-zinc-500 p-5"></i>
                                <div className="overflow-hidden py-2 max-w-[300px] ">
                                    <p className="font-bold text-sm">{item.title}</p>
                                    <p className="text-xs">{item.subject}</p>
                                </div>
                            </div>
                            ))}
                            {notifications?.length == 0 && (
                                <div className="font-nunito-sans flex cursor-pointer px-1">
                                    <i className="fa-solid fa-circle-info text-gray-500 p-5"></i>
                                    <div className="overflow-hidden flex items-center max-w-[300px] ">
                                        <p className="font-bold text-sm text-gray-500">You have no Notification</p>
                                    </div>
                                </div>
                            )

                            }
                        </div> 
                          }
                    
                
                 
                </div>
            )}
            {showMenu && (
                <div className="absolute right-6 top-[65px] bg-white py-3 rounded-[5px] pop-up-boxshadow z-[100] ">
                    <div className="flex items-center gap-5 border-b-[1px] px-5 pb-2 min-w-72 max-w-[300px]">
                        <img
                            src="/images/navigation/user-icon.png"
                            className="w-10 h-10"
                        />
                        <p className="font-nunito-sans font-semibold">
                            {auth.user.name}
                        </p>
                    </div>
                    <Link
                        href="/profile"
                        className="px-5 py-2 flex items-center hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                            setShowMenu(false);
                        }}
                    >
                        <img
                            src="/images/navigation/profile-icon.png"
                            className="w-[22px] h-[22px] mr-3"
                        />
                        <span className="font-nunito-sans text-[16px]">
                            Profile
                        </span>
                    </Link>
                    <Link
                        href="/change_password"
                        className="px-5 py-2 flex items-center hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                            setShowMenu(false);
                        }}
                    >
                        <img
                            src="/images/navigation/lock-icon.png"
                            className="w-[22px] h-[22px] mr-3"
                        />
                        <span className="font-nunito-sans">
                            Change Password
                        </span>
                    </Link>
                    <div
                        className="border-t-[1px]  pt-2 "
                        onClick={handleLogout}
                    >
                        <div className="px-5 py-2 flex items-center hover:bg-gray-200 cursor-pointer">
                            <img
                                src="/images/navigation/logout-icon.png"
                                className="w-[22px] h-[22px] mr-3"
                            />
                            <span className="font-nunito-sans">Logout</span>
                        </div>
                    </div>
                </div>
            )}
            <NotificationsModal show={showModal} onClose={handleModalToggle} title={selectedNotif.title} subject={selectedNotif.subject} content={selectedNotif.content} width="3xl"/>
        </div>
    );
};

export default AppNavbar;
