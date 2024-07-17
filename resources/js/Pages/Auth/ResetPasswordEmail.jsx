import React from "react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import { router, useForm } from "@inertiajs/react";

const ResetPasswordEmail = ({ email }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || "",
        new_password: "",
        confirm_password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/send_resetpass_email/reset", {
            onSuccess: () => {
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
            },
        });
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
                        onChange={(e) =>
                            setData("new_password", e.target.value)
                        }
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
                        onChange={(e) =>
                            setData("confirm_password", e.target.value)
                        }
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
                        disabled={processing}
                    >
                        {processing ? "Please Wait..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordEmail;
