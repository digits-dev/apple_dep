import React, { useState } from "react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";

const ResetPasswordEmail = ({ email }) => {
    const { data, setData, reset } = useForm({
        email: email || "",
        new_password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setData((resetPasswordData) => ({
            ...resetPasswordData,
            [key]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!data.new_password)
            newErrors.new_password = "New Password is required";
        if (!data.confirm_password)
            newErrors.confirm_password = "Confirm Password is required";
        if (data.new_password != data.confirm_password) {
            newErrors.confirm_password = "Passwords not Match";
        }

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
                const response = await axios.post(
                    "/send_resetpass_email/reset",
                    data
                );
                if (response.data.type == "success") {
                    reset();
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Password Reset Successful!",
                    }).then(() => {
                        router.visit("/login");
                    });
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                    Toast.fire({
                        icon: "error",
                        title: "Request expired, please request another one",
                    }).then(() => {
                        reset();
                    });
                }
            } catch (error) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "error",
                    title: "An error occurred. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-login-bg-color h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center items-center space-y-1 mb-5">
                <div className="flex">
                    <img
                        src="/images/login-page/btb-logo-white.png"
                        className="w-[63px] h-63px]"
                    />
                    <div className="h-[57px] w-[2px] bg-white ml-[9px] mr-[18px]"></div>
                    <img
                        src="/images/login-page/digits-logo.png"
                        className="w-[48px] h-[57px]"
                    />
                </div>
                <p className="text-white font-nunito-sans font-bold text-[20px] text-center">
                    Device Enrollment Program
                </p>
            </div>
            <div className="bg-white rounded-lg max-w-lg w-full font-nunito-sans">
                <p className="p-4 border-b-2 text-center font-bold">
                    Reset Password
                </p>
                <form className="py-2 px-5" onSubmit={handleSubmit}>
                    <p className="text-red-500 my-2 text-sm">
                        *Please fill all the fields
                    </p>
                    <InputWithLogo
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={data.new_password}
                        onChange={handleChange}
                        logo="/images/login-page/password-icon.png"
                        placeholder="Enter New Password"
                        marginTop={2}
                    />
                    {errors.new_password && (
                        <div className="text-red-500 font-base mt-2">
                            {errors.new_password}
                        </div>
                    )}
                    <InputWithLogo
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"
                        value={data.confirm_password}
                        onChange={handleChange}
                        logo="/images/login-page/password-icon.png"
                        placeholder="Confirm Password"
                        marginTop={2}
                    />
                    {errors.confirm_password && (
                        <div className="text-red-500 font-base mt-2">
                            {errors.confirm_password}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-primary w-full text-white font-nunito-sans  py-3 text-sm font-bold rounded-md my-4 hover:opacity-70"
                        disabled={loading}
                    >
                        {loading ? "Please Wait..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordEmail;
