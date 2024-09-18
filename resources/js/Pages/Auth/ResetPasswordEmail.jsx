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
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isCorrectLength, setIsCorrectLength] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setData((resetPasswordData) => ({
            ...resetPasswordData,
            [key]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData("new_password", newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };[]

    const checkPasswordStrength = (password) => {
        let strength = 0;
    
        // 8 characters
        setIsCorrectLength(password.length >= 8);
        strength += password.length >= 8 ? 1 : 0;

        // is Uppercase
        setIsUpperCase(/[A-Z]/.test(password));
        strength += /[A-Z]/.test(password) ? 1 : 0;
        
        // is Lowercase
        setIsLowerCase(/[a-z]/.test(password));
        strength += /[a-z]/.test(password) ? 1 : 0;
        
        // is Number
        setIsNumber(/[0-9]/.test(password));
        strength += /[0-9]/.test(password) ? 1 : 0;
        
        // is Special Char
        setIsSpecialChar(/[^A-Za-z0-9]/.test(password));
        strength += /[^A-Za-z0-9]/.test(password) ? 1 : 0;

        if (strength == 5){
            setIsDisabled(false)
        }
        else {
            setIsDisabled(true)
        }
    
        return (strength / 5) * 100;
    };

    const validate = () => {
        const newErrors = {};
        if (!data.new_password){
            newErrors.new_password = "New Password is required";
        }
        else {
            const password = data.new_password;
            // Validate password length (at least 8 characters)
            if (password.length < 8) {
                newErrors.new_password = "Password must be at least 8 characters long";
            }
            // Validate at least one uppercase letter
            if (!/[A-Z]/.test(password)) {
                newErrors.new_password = "Password must contain at least one uppercase letter";
            }
            // Validate at least one lowercase letter
            if (!/[a-z]/.test(password)) {
                newErrors.new_password = "Password must contain at least one lowercase letter";
            }
            // Validate at least one number
            if (!/[0-9]/.test(password)) {
                newErrors.new_password = "Password must contain at least one number";
            }
            // Validate at least one special character
            if (!/[@$!%*#?&]/.test(password)) {
                newErrors.new_password = "Password must contain at least one special character";
            }
        }
           
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
        <div className="bg-login-bg-color h-screen flex flex-col items-center justify-center p-5">
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
                        onChange={handlePasswordChange}
                        logo="/images/login-page/password-icon.png"
                        placeholder="Enter New Password"
                        marginTop={2}
                    />
                    {data.new_password && (
                                <div className="mt-3">
                                    <div className="relative w-full h-3 bg-gray-200 rounded">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded transition-all ${passwordStrength < 40 ? 'bg-red-500': passwordStrength < 70 ? 'bg-yellow-400': 'bg-green-500'}`}
                                            style={{
                                                width: `${passwordStrength}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs mt-1">
                                        {passwordStrength < 40
                                            ? 'Weak Password'
                                            : passwordStrength < 70
                                            ? 'Medium Password'
                                            : 'Strong Password'}
                                    </div>
                                    <div className="text-xs mt-1 text-gray-500">
                                        <div className={`${isUpperCase && 'text-green-500'}`}><i className={`${isUpperCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Uppercase Letter</span></div>
                                        <div className={`${isLowerCase && 'text-green-500'}`}><i className={`${isLowerCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Lowercase Letter</span></div>
                                        <div className={`${isCorrectLength && 'text-green-500'}`}><i className={`${isCorrectLength ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 8 Characters Long</span></div>
                                        <div className={`${isSpecialChar && 'text-green-500'}`}><i className={`${isSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Special Character</span></div>
                                        <div className={`${isNumber && 'text-green-500'}`}><i className={`${isNumber ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Atleast 1 Number</span></div>
                                    </div>
                                </div>
                            )}
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
                        disabled={isDisabled || loading}
                    >
                        {loading ? "Please Wait..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordEmail;
