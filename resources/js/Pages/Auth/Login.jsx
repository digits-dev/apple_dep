import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Slider from "../../Components/LoginPage/Slider";

const LoginPage = () => {
    const { errors } = usePage().props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(
            "login-save",
            {
                email,
                password,
            },
            {
                onError: (errors) => {
                    if (errors.email) {
                        setEmail("");
                    }
                    if (errors.password) {
                        setPassword("");
                    }
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <div className="bg-white md:bg-login-bg-color h-screen flex items-center justify-center">
            {/* MAIN CONTAINER */}
            <div className="max-w-[900px] max-h-[600px] w-full h-full bg-white rounded-lg flex overflow-hidden p-5">
                {/* CONTAINER 1 */}
                <div className="h-full hidden md:block">
                    <div className="h-full w-[300px] bg-white border-8 border-black rounded-[40px] overflow-hidden flex flex-col">
                        <div className="bg-white w-full p-2 flex items-center justify-between relative px-5">
                            <div className="font-nunito-sans text-[13px] font-semibold ml-3">
                                {formatTime(currentTime)}
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <div className="bg-black w-24 p-1 rounded-[50px] flex justify-end px-2">
                                    <div className="size-4 bg-camera-color rounded-[50px]"></div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <img
                                    src="/images/login-page/network-icon.png"
                                    className="w-[17px] h-[10px]"
                                />
                                <img
                                    src="/images/login-page/wifi-icon.png"
                                    className="w-[13px] h-[10px]"
                                />
                                <img
                                    src="/images/login-page/battery-icon.png"
                                    className="w-[21px] h-[10px]"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Slider />
                        </div>
                        <div className="bg-white w-full p-2 flex justify-center">
                            <div className="bg-black h-1 w-24 rounded-[50px]"></div>
                        </div>
                    </div>
                </div>
                {/* CONTAINER 2 */}
                <div className="h-full w-full flex items-center justify-center md:p-[30px]">
                    <div className="bg-white h-full w-full flex flex-col justify-center p-10 border-[1px] border-black rounded-[10px]">
                        <div className="flex flex-col item-center justify-center mb-10 md:hidden">
                            <div className="flex justify-center">
                                <img
                                    src="/images/login-page/btb-logo-black.png"
                                    className="w-[63px] h-63px]"
                                />
                                <div className="h-[57px] w-[2px] bg-black ml-[9px] mr-[18px]"></div>
                                <img
                                    src="/images/login-page/digits-logo-colored.png"
                                    className="w-[48px] h-[57px]"
                                />
                            </div>
                            <p className="text-black font-nunito-sans font-bold text-[18px] text-center">
                                Device Enrollment Program
                            </p>
                        </div>
                        <div className="font-nunito-sans font-extrabold text-[24px] mb-10 text-center">
                            Sign In
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* EMAIL */}
                            <div className="flex flex-col mb-1 w-full">
                                <label className="font-nunito-sans font-semibold">
                                    Email
                                </label>
                                <div className="border-2 border-black rounded-[10px] overflow-hidden flex items-center">
                                    <div className="border-r-2 h-full p-[10px] border-black">
                                        <img
                                            src="/images/login-page/email-icon.png"
                                            className="w-[22px] h-[22px]"
                                        />
                                    </div>
                                    <input
                                        className="flex-1 mx-2 outline-none "
                                        type="email"
                                        value={email}
                                        placeholder="Enter Email"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                {errors.email && (
                                    <div className="font-nunito-sans text-center my-2 font-bold text-red-600">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            {/* PASSWORD */}
                            <div className="flex flex-col">
                                <label className="font-nunito-sans font-semibold">
                                    Password
                                </label>
                                <div className="border-2 border-black rounded-[10px] overflow-hidden flex items-center">
                                    <div className="border-r-2 h-full p-[10px] border-black">
                                        <img
                                            src="/images/login-page/password-icon.png"
                                            className="w-[22px] h-[22px]"
                                        />
                                    </div>
                                    <input
                                        className="flex-1 mx-2 outline-none"
                                        type="password"
                                        value={password}
                                        placeholder="Enter Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                {errors.password && (
                                    <div className="font-nunito-sans text-center my-3 font-bold text-red-600">
                                        {errors.password}
                                    </div>
                                )}
                                {errors.no_datas && (
                                    <div className="font-nunito-sans text-center my-3 font-bold text-red-600">
                                        {errors.no_datas}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70"
                            >
                                {loading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
