import React, { useState } from "react";
import InputComponent from "../../Components/Forms/Input";
import Checkbox from "../../Components/Checkbox/Checkbox";
import { useForm } from "@inertiajs/react";

const NotificationsModal = ({
    show,
    onClose,
    width = "lg",
    email
}) => {
    if (!show) {
        return null;
    }

    const { data, setData, processing, reset, post, errors } = useForm({
        email: email || "",
        new_password: "",
        confirm_password: "",
    });

    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData("new_password", newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

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
        if (password.length >= 6) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
        return (strength / 5) * 100; 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/update-password-login", {
            onSuccess: (data) => {
                const { message } = data.props.auth.sessions;
                
            },
        });
        
    };

    return (
        <>
            <div className="modal-backdrop z-[100]">
                <div
                    className={`bg-white rounded-lg shadow-custom ${maxWidth} w-full m-5  max-h-[90vh]`}
                >
                    <div className="flex justify-between p-5 border-b-2 items-center">
                        <p className="font-nunito-sans font-extrabold text-lg w-full text-center">
                            Change Password
                        </p>
                    </div>
                    <main className="pb-3 px-5 font-nunito-sans">
                        <p className="text-sm py-3 "><span className="text-red-500 font-semibold">Warning:</span> We have detected that your password is still set to the default, posing a security risk, and recommend updating it immediately to a strong, unique password </p>
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
                                    <div className="text-sm mt-1">
                                        {passwordStrength < 40
                                            ? 'Weak Password'
                                            : passwordStrength < 70
                                            ? 'Medium Password'
                                            : 'Strong Password'}
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

                            <button
                                type="submit"
                                className="bg-primary w-full text-white font-nunito-sans  py-3 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                                disabled={processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit"}
                            </button>
                        </form>
                    </main>
                </div>
            </div>
        </>
    );
};

export default NotificationsModal;
