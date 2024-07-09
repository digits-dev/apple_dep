import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import DropdownSelect from "../../Components/Dropdown/Dropdown";

const CreateUserForm = ({ onClose }) => {
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [clearErrors, setClearErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [forms, setforms] = useState({
        name: "",
        path: "",
        controller: "",
        type: "",
    });

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setforms((forms) => ({
            ...forms,
            [key]: value,
        }));
        setClearErrors(key);
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!forms.name) newErrors.name = "Name is required";
        if (!forms.email) newErrors.email = "Email is required";
        if (!forms.privilege_id)
            newErrors.privilege_id = "Privilege is required";
        if (!forms.password) newErrors.password = "Password is required";
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
                const response = await axios.post("/postAddSave", forms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type == "success") {
                    setFormMessage(response.data.message);
                    setMessageType(response.data.type);
                    setTimeout(() => setFormMessage(""), 3000);
                    setShowCreateModal(false);
                    router.reload({ only: ["users"] });
                } else {
                    setErrorMessage(response.data.message);
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
        <form onSubmit={handleSubmit} className="p-2">
            {errorMessage && (
                <div style={{ color: "red" }}>{errorMessage}</div>
            )}
            <div className="flex flex-col mb-3 w-full">
                <label className="font-nunito-sans font-semibold">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={forms.name}
                    onChange={handleChange}
                />
                {(errors.name || serverErrors.name) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.name || serverErrors.name}
                    </div>
                )}
            </div>

            <div className="flex flex-col mb-3 w-full">
                <label className="font-nunito-sans font-semibold">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={forms.email}
                    onChange={handleChange}
                />
                {(errors.email || serverErrors.email) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.email || serverErrors.email}
                    </div>
                )}
            </div>
         
            <div className="flex flex-col mb-3 w-full">
                <label className="font-nunito-sans font-semibold">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={forms.password}
                    onChange={handleChange}
                />
                {(errors.password || serverErrors.password) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.password || serverErrors.password}
                    </div>
                )}
            </div>
            <button
                type="submit"
                className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70"
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};

export default CreateUserForm;