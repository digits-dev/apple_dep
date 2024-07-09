import React, { useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head } from "@inertiajs/react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import TableButton from "../../Components/Table/Buttons/TableButton";
import DissapearingToast from "../../Components/Toast/DissapearingToast";
import axios from "axios";
const ChangePassword = () => {
    const [data, setData] = useState({
        current_password: "",
        new_password: "",
        confirmation_password: "",
    });
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setData((changePasswordData) => ({
            ...changePasswordData,
            [key]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!data.current_password)
            newErrors.current_password = "Current Password is required";
        if (!data.new_password)
            newErrors.new_password = "New Password is required";
        if (!data.confirmation_password)
            newErrors.confirmation_password = "Confirm Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setLoading(true);
            try {
                const response = await axios.post("/postChangePassword", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type == "success") {
                    setFormMessage(response.data.message);
                    setMessageType(response.data.type);
                    setTimeout(() => setFormMessage(""), 3000);
                } else {
                     setErrors(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general: "An error occurred. Please try again.",
                    });
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Head title="Change Password" />
            <AppContent>
                <DissapearingToast type={messageType} message={formMessage} />
                <ContentPanel>
                    <form
                        onSubmit={handleSubmit}
                        className="flex justify-center my-16 font-nunito-sans gap-x-16 gap-y-5 items-center flex-wrap m-5"
                    >
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
                                onChange={handleChange}
                                name="current_password"
                                value={data.current_password}
                            />
                            {errors.current_password && (
                                <div className="font-nunito-sans font-bold text-red-600">
                                    {errors.current_password}
                                </div>
                            )}
                            <InputWithLogo
                                label="New Password"
                                name="new_password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Enter New Password"
                                type="password"
                                marginBottom={3}
                                onChange={handleChange}
                                value={data.new_password}
                            />
                              {errors.new_password && (
                                <div className="font-nunito-sans font-bold text-red-600">
                                    {errors.new_password}
                                </div>
                            )}
                            <InputWithLogo
                                label="Confirm Password"
                                name="confirmation_password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Confirm New Password"
                                type="password"
                                marginBottom={8}
                                onChange={handleChange}
                                value={data.confirmation_password}
                            />
                            {errors.confirmation_password && (
                                <div className="font-nunito-sans font-bold text-red-600">
                                    {errors.confirmation_password}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <TableButton>Cancel</TableButton>
                                <TableButton type="submit">
                                    {loading ? "Saving..." : "Save Changes"}
                                </TableButton>
                            </div>
                        </div>
                    </form>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default ChangePassword;
