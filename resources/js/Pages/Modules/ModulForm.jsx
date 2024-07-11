import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import InputComponent from "../../Components/Forms/Input";
import RouteType from "./RouteTypes";
import axios from "axios";

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
        icon: "",
        controller: "",
        type: "",
    });
    console.log(RouteType);
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
        if (!forms.path) newErrors.path = "Path is required";
        if (!forms.icon) newErrors.icon = "Icon is required";
        if (!forms.type) newErrors.type = "Type is required";
        if (!forms.type) newErrors.type = "Type is required";
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
                const response = await axios.post("/module_generator/postAddSave", forms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type == "success") {
                    setFormMessage(response.data.message);
                    setMessageType(response.data.type);
                    setTimeout(() => setFormMessage(""), 3000);
                    onClose
                    router.reload({ only: ["Modules"] });
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
                <InputComponent
                    type="text"
                    name="name"
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
                <InputComponent
                    type="text"
                    name="path"
                    value={forms.path}
                    onChange={handleChange}
                />
                {(errors.path || serverErrors.path) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.path || serverErrors.path}
                    </div>
                )}
            </div>
         
            <div className="flex flex-col mb-3 w-full">
                <InputComponent
                    type="text"
                    name="icon"
                    value={forms.icon}
                    onChange={handleChange}
                />
                {(errors.icon || serverErrors.icon) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.icon || serverErrors.icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col mb-3 w-full">
                <DropdownSelect
                    defaultSelect="Select a Type"
                    name="type"
                    options={RouteType}
                    value={forms.type}
                    onChange={handleChange}
                />
                {(errors.type || serverErrors.type) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.type || serverErrors.type}
                    </div>
                )}
            </div>
            <div className="flex flex-col mb-3 w-full">
                <InputComponent
                    type="text"
                    name="controller"
                    value={forms.controller}
                    onChange={handleChange}
                />
                {(errors.controller || serverErrors.controller) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.controller || serverErrors.controller}
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