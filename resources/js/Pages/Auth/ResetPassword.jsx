import React from "react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import { router, useForm } from "@inertiajs/react";

const ResetPassword = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/send_resetpass_email", {
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
                    title: "Email sent, Please check your email",
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
                    Forgot Password
                </p>
                <form className="py-2 px-5" onSubmit={handleSubmit}>
                    <p className="text-red-500 my-2 text-sm">
                        *will send instructions by your email
                    </p>
                    <InputWithLogo
                        label="Enter your Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        logo="images/login-page/email-icon.png"
                        placeholder="Enter Email"
                        marginTop={2}
                    />
                    {errors.email && (
                        <div className="text-red-500 font-base mt-2">
                            {errors.email}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-primary w-full text-white font-nunito-sans  py-3 text-sm font-bold rounded-md my-4 hover:opacity-70"
                        disabled={processing}
                    >
                        {processing ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
