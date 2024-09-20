import React, { useContext, useEffect, useState } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head, Link, router, useForm } from "@inertiajs/react";
import animationData from '../../../../public/animations/password-anim.json'
import InputWithLogo from "../../Components/Forms/InputWithLogo";
import { useToast } from "../../Context/ToastContext";
import { NavbarContext } from "../../Context/NavbarContext";
import Lottie from 'lottie-react';
import Checkbox from "../../Components/Checkbox/Checkbox";
const ChangePassword = () => {
    const { handleToast } = useToast();
    const { setTitle } = useContext(NavbarContext);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isCorrectLength, setIsCorrectLength] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    

    const { data, setData, processing, reset, post, errors } = useForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        setTimeout(() => {
            setTitle("Change Password");
        }, 5);
    }, []);

  
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Change Password?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",      
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                post("/postChangePassword", {
                    onSuccess: (data) => {
                        const { message, success } = data.props.auth.sessions;
                        handleToast(message, success);
                        setIsFieldDisabled(true);
                        setTimeout(() => router.post("logout"), 3000);
                    },
                    onError: (newErrors) => {
                        console.log(newErrors);
                    }
                }); 
            }
        });
        
        
    };

    return (
        <>
            <Head title="Change Password" />
            <ContentPanel>
                <form onSubmit={handleSubmit} className="h-full flex font-nunito-sans items-center flex-col md:flex-row">
                    <div className="h-full w-full md:w-1/2">
                        <Lottie animationData={animationData} loop={true} style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="h-full w-full md:w-1/2 p-5">
                        <p className="mb-5 text-sm md:text-base"><span className="text-red-500 font-bold">Note: </span>If you would like to update your account password, please provide your current password, followed by your new desired password. To confirm the change, kindly re-enter the new password to ensure accuracy and completion of the update process.</p>
                        <div className="w-full h-full border-2 rounded-xl px-6 py-7">
                            <InputWithLogo
                                label="Current Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Enter Current Password"
                                name="current_password"
                                disabled={isFieldDisabled}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                            />
                            {errors.current_password && (
                                <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                                    {errors.current_password}
                                </span>
                            )}
                            <InputWithLogo
                                label="New Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Enter New Password"
                                marginTop={3}
                                name="new_password"
                                disabled={isFieldDisabled}
                                type={showPassword ? "text" : "password"}
                                onChange={handlePasswordChange}
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
                                        <div className={`${isUpperCase && 'text-green-500'}`}><i className={`${isUpperCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Must include at least one uppercase letter</span></div>
                                        <div className={`${isLowerCase && 'text-green-500'}`}><i className={`${isLowerCase ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Must include at least one uppercase letter</span></div>
                                        <div className={`${isCorrectLength && 'text-green-500'}`}><i className={`${isCorrectLength ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Minimum length of 8 characters</span></div>
                                        <div className={`${isSpecialChar && 'text-green-500'}`}><i className={`${isSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Must include at least one special character (e.g., @$;!%*#?&)</span></div>
                                        <div className={`${isNumber && 'text-green-500'}`}><i className={`${isNumber ? 'fa-solid fa-check' : 'fa-solid fa-circle-info text-xs'} mr-1`}></i><span>Must contain at least one number</span></div>
                                    </div>
                                </div>
                            )}
                            {errors.new_password && (
                                <span className=" inline-block text-red-500 font-base mt-2 text-xs md:text-sm">
                                    {errors.new_password}
                                </span>
                            )}
                            <InputWithLogo
                                label="Confirm Password"
                                logo="images/login-page/password-icon.png"
                                placeholder="Confirm Password"
                                marginTop={3}
                                disabled={isFieldDisabled}
                                name="confirm_password"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setData("confirm_password", e.target.value)
                                }
                            />
                            {errors.confirm_password && (
                                <span className="mt-1 inline-block text-red-500 font-base text-xs md:text-sm">
                                    {errors.confirm_password}
                                </span>
                            )}
                            <div className="mt-3">
                                <div className="flex items-center justify-end">
                                    <Checkbox type="checkbox" isChecked={showPassword} handleClick={togglePasswordVisibility}/>
                                    <span className="text-xs md:text-sm font-semibold mr-3">Show Password</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-primary w-full text-white font-nunito-sans py-3 text-xs md:text-sm font-bold rounded-md mt-5 hover:opacity-70"
                                disabled={isDisabled || processing}
                            >
                                {processing
                                    ? "Please Wait..."
                                    : "Change Password"}
                            </button>

                        </div>
                    </div>
                </form>
            </ContentPanel>
        </>
    );
};

export default ChangePassword;
