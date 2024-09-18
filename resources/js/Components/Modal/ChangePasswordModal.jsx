import React, { useState } from "react";
import InputComponent from "../../Components/Forms/Input";
import Checkbox from "../../Components/Checkbox/Checkbox";
import { useForm } from "@inertiajs/react";

const NotificationsModal = ({
    show,
    width = "lg",
    email,
    note,
    isThreeMonths,
    pp,
}) => {
    if (!show) {
        return null;
    }

    const { data, setData, processing, reset, post, errors } = useForm({
        pp: pp || "",
        email: email || "",
        new_password: "",
        confirm_password: "",
        is_waive: "",
    });


    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isCorrectLength, setIsCorrectLength] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDisabledWaive, setIsDisabledWaive] = useState(false);
    const [waiveMessage, setWaiveMessage] = useState('');

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData("new_password", newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };[]

    const maxWidth = {
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
    }[width];

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
    

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/update-password-login", {
            onSuccess: (data) => {
                const { message } = data.props.auth.sessions;
                
            },
            onError: (newErrors) => {
                console.log(newErrors);
                if (newErrors.message){
                    setWaiveMessage(newErrors.message);
                    setIsDisabledWaive(true);
                    reset();
                }
            }
        });
        
    };

    return (
        <>
            <div className="modal-backdrop z-[100] overflow-y-auto h-screen">
                <div
                    className={`bg-white rounded-lg shadow-custom ${maxWidth} w-full m-5 max-h-fit`}
                >
                    <div className="flex justify-between p-5 border-b-2 items-center">
                        <p className="font-nunito-sans font-extrabold text-lg w-full text-center">
                            Change Password
                        </p>
                    </div>
                    <main className="pb-3 px-5 font-nunito-sans">
                        <p className="text-sm py-3 "><span className="text-red-500 font-semibold">Warning: </span>{note}</p>
                        <form onSubmit={handleSubmit} className="whitespace-pre-line leading-loose text-sm border p-5 rounded-lg overflow-y-auto" action="POST">
                            <InputComponent
                                name="new_password"
                                value={data.new_password}
                                onChange={handlePasswordChange}
                                type={showPassword ? "text" : "password"}
                            />
                            {/* Password strength indicator */}
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
                                <span className=" inline-block text-red-500 font-base">
                                    {errors.new_password}
                                </span>
                            )}
                            {errors.error_qwerty && (
                                <span className=" inline-block text-red-500 font-base">
                                    {errors.error_qwerty}
                                </span>
                            )}
                            <InputComponent
                                name="confirm_password"
                                value={data.confirm_password}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setData("confirm_password", e.target.value)
                                }
                                extendedClass="mt-3"
                               
                            />
                            {errors.confirm_password && (
                                <span className="mt-1 inline-block text-red-500 font-base">
                                    {errors.confirm_password}
                                </span>
                            )}

                            <div className="mt-3">
                                <div className="flex items-center justify-end">
                                    <Checkbox type="checkbox" isChecked={showPassword} handleClick={togglePasswordVisibility}/>
                                    <span className="text-sm font-semibold mr-3">Show Password</span>
                                </div>
                            </div>

                            {waiveMessage && (
                                <span className="mt-1 inline-block w-full text-center text-red-500 font-base">
                                    {waiveMessage}
                                </span>
                            )}

                            <div className="flex space-x-2">
                            {isThreeMonths && (
                                <button
                                    type="submit"
                                    className="bg-green-800 w-full text-white font-nunito-sans  py-3 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                                    disabled={isDisabledWaive || processing}
                                    onClick={() => setData({ is_waive: '1', email: email, pp: pp })}
                                >
                                    Waive
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-primary w-full text-white font-nunito-sans  py-3 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                                disabled={isDisabled || processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit"}
                            </button>
                            </div>
                            
                        </form>
                    </main>
                </div>
            </div>
        </>
    );
};

export default NotificationsModal;
