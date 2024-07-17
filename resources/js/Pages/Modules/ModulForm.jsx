import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import InputComponent from "../../Components/Forms/Input";
import RouteType from "./RouteTypes";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";

const CreateUserForm = ({ onClose }) => {
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [clearErrors, setClearErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isRoute, setIsRoute] = useState(false);
    const { handleToast } = useToast();
    const [forms, setForms] = useState({
        name: "",
        path: "",
        icon: "",
        type: "",
        controller: ""
    });
    
    function handleChange(e) {
        const key = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setForms((forms) => ({
            ...forms,
            [key]: value,
        }));
        if(e.name){
            value === 'route' ?  setIsRoute(true) : setIsRoute(false);
        }
        
        setClearErrors(key);
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!forms.name) newErrors.name = "Name is required";
        if (!forms.path) newErrors.path = "Path is required";
        if (!forms.icon) newErrors.icon = "Icon is required";
        if (!forms.type) newErrors.type = "Type is required";
        if(isRoute){
            if (!forms.controller) newErrors.controller = "Controller is required";
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
                const response = await axios.post("/module_generator/postAddSave", forms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type == "success") {
                    handleToast(response.data.message, response.data.type);
                    router.reload({ only: ["modules"] });
                    
                } else {
                    handleToast(response.data.message, response.data.type);
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
                    placeholder="Choose type"
                    selectType="select2"
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
            {isRoute 
            ? 
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
            : ''}
           
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