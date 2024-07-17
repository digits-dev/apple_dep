import React from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head } from "@inertiajs/react";

const ProfilePage = ({ user }) => {
    return (
        <>
            <Head title="Profile" />
            <ContentPanel>
                <div className="flex flex-col justify-center items-center p-10 font-nunito-sans">
                    <div className="w-52 h-52 border-4 border-secondary rounded-full overflow-hidden mb-5">
                        <img
                            src="/images/navigation/user-icon.png"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="font-extrabold text-2xl">{user.name}</p>
                        <p className="text-md">{user.email}</p>
                        <p className="text-md text-red-500">
                            {user.privilege_name}
                        </p>
                    </div>
                </div>
            </ContentPanel>
        </>
    );
};

export default ProfilePage;
