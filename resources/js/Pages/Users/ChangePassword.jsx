import React from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head } from "@inertiajs/react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import TableButton from "../../Components/Table/Buttons/TableButton";

const ChangePassword = () => {
    return (
        <>
            <Head title="Change Password" />
            <AppContent>
                <ContentPanel>
                    <div className="flex justify-center my-16 font-nunito-sans gap-x-16 gap-y-5 items-center flex-wrap m-5">
                        <img
                            src="images/others/changepass-image.png"
                            className="w-80"
                        />
                        <div className="max-w-md">
                            <p className="mb-5">
                                If you wish to change the account password,
                                kindly fill in the current password, new
                                password, and re-type new password.
                            </p>

                            <InputWithLogo
                                label="Current Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Enter Current Password"
                                type="password"
                                marginBottom={3}
                            />
                            <InputWithLogo
                                label="New Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Enter New Password"
                                type="password"
                                marginBottom={3}
                            />
                            <InputWithLogo
                                label="Confirm Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Confirm New Password"
                                type="password"
                                marginBottom={8}
                            />

                            <div className="flex justify-between">
                                <TableButton>Cancel</TableButton>
                                <TableButton>Save Changes</TableButton>
                            </div>
                        </div>
                    </div>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default ChangePassword;
