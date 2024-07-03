import React, { useContext, useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { NavbarContext } from "../../Context/NavbarContext";

const AppNavbar = () => {
    const { title } = useContext(NavbarContext);
    const { auth } = usePage().props;
    const [showMenu, setShowMenu] = useState(false);
    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Do you want to Logout</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.post("logout");
            }
        });
    };

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className="bg-white h-[70px] flex items-center justify-between px-10 py-5 select-none">
            <p className="font-nunito-sans font-extrabold text-[20px]">
                {title}
            </p>
            <img
                src="/images/navigation/user-icon.png"
                className="w-10 h-10 cursor-pointer"
                onClick={handleToggle}
            />
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
                    <div className="px-5 py-2 flex items-center hover:bg-gray-200 cursor-pointer">
                        <img
                            src="/images/navigation/profile-icon.png"
                            className="w-[22px] h-[22px] mr-3"
                        />
                        <span className="font-nunito-sans text-[16px]">
                            Profile
                        </span>
                    </div>
                    <div className="px-5 py-2 flex items-center hover:bg-gray-200 cursor-pointer">
                        <img
                            src="/images/navigation/lock-icon.png"
                            className="w-[22px] h-[22px] mr-3"
                        />
                        <span className="font-nunito-sans">
                            Change Password
                        </span>
                    </div>
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
        </div>
    );
};

export default AppNavbar;
