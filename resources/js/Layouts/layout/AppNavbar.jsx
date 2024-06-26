import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

const AppNavbar = () => {
    const { auth } = usePage().props;
    const [showMenu, setShowMenu] = useState(false);
    const handleLogout = (e) => {
        e.preventDefault();
        router.post("logout");
    };

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    useEffect(()=>{
        console.log(auth)
    })

    return (
        <div className="bg-white h-[70px] flex items-center justify-between mx-10">
            <p className="font-nunito-sans font-extrabold text-[20px]">
                Dashboard
            </p>
            <img
                src="/images/navigation/user-icon.png"
                className="w-10 h-10 cursor-pointer"
                onClick={handleToggle}
            />
            {showMenu && (
                <div className="absolute right-6 top-[65px] bg-white py-3 rounded-[5px] pop-up-boxshadow">
                    <div className="flex items-center gap-5 border-b-[1px] px-5 pb-2">
                        <img
                            src="/images/navigation/user-icon.png"
                            className="w-10 h-10"
                        />
                        <p className="font-nunito-sans font-semibold">
                            {auth.user.name}
                        </p>
                    </div>
                    <div className="px-5 py-2">Profile</div>
                    <div className="px-5 py-2">Change Password</div>
                    <div className="border-t-[1px] px-5 pt-2">
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="font-nunito-sans">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppNavbar;
