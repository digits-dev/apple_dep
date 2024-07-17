import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useContext, useEffect, useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import InputComponent from "../../Components/Forms/Input";
import { NavbarContext } from "../../Context/NavbarContext";
import Select from "../../Components/Forms/Select";
import themeColor from "./ThemeColor";
import Checkbox from "../../Components/Checkbox/Checkbox";
import TableButton from "../../Components/Table/Buttons/TableButton";
import axios from "axios";
import RadioButton from "../../Components/Checkbox/RadioButton";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import { useToast } from "../../Context/ToastContext";

const AddPrivileges = ({ moduleses, row }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();
    const [roles, setRoles] = useState({ is_superadmin: '0',});
    const [modules, setModules] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [clearErrors, setClearErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [showPriv, setShowPriv] = useState(true);
    const [selectAll, setSelectAll] = useState({
        is_visible: false,
        is_create: false,
        is_read: false,
        is_edit: false,
        is_delete: false,
        is_void: false,
        is_override: false
    });

    const [forms, setForms] = useState({
        header_id: "",
        name:  "",
        is_superadmin: "",
        privileges: {},
        theme_color: "",
    });

    useEffect(() => {
        setTimeout(()=>{
            setTitle("Add Privileges");
        },5);
        setModules(moduleses);
        setRows(row);
        setForms(row);
        if(row.is_superadmin == 1){
            setShowPriv(false);
        }else{
            setShowPriv(true);
        }

    }, []);
    
    const handleSelectAll = (e, permission) => {
        const { type, checked } = e.target;
        const actualValue = type === "checkbox" ? (checked ? "1" : "") : value;
        setSelectAll((prevState) => ({
            ...prevState,
            [permission]: !prevState[permission],
        }));
        // Update roles state based on new select all state
        modules.map((item) => {
            const isChecked = !roles[item.id]?.is_visible;
            setRoles((prevRoles) => ({
                ...prevRoles,
                [item.id]: {
                    [permission]: isChecked,
                },
            }));

            setForms({
                ...forms,
                privileges: {
                    ...forms.privileges,
                    [item.id]: {
                        ...forms.privileges[item.id],
                        [permission]: actualValue,
                    },
                },
            });
        });
    };

    const handleCheckboxChange = (e, moduleId, permission) => {
        const { name, value, type, checked } = e.target;
        const actualValue = type === "checkbox" ? (checked ? "1" : "") : value;
        const nameParts = name.split(/[\[\]]/).filter(Boolean);
        if (nameParts.length === 3) {
            setForms({
                ...forms,
                privileges: {
                    ...forms.privileges,
                    [nameParts[1]]: {
                        ...forms.privileges?.[nameParts[1]],
                        [nameParts[2]]: actualValue,
                    },
                },
            });
        }

        setModules(modules.map(modul => {
            if (modul.id === moduleId) {
                return {
                    ...modul,
                    roles: {
                        ...modul.roles,
                        [permission]: checked
                    }
                };
            }
            return modul;
        }));
    };

    const handleSelectHorizontal = (e, moduleId) => {
        const { type, checked } = e.target;
        const actualValue = type === "checkbox" ? (checked ? "1" : "0") : value;

        setModules(modules.map(modul => {
            if (modul.id === moduleId) {
                return {
                    ...modul,
                    roles: {
                        ...modul.roles,
                        is_visible: checked,
                        is_create: checked,
                        is_read: checked,
                        is_edit: checked,
                        is_delete: checked,
                        is_void: checked,
                        is_override: checked
                    }
                };
            }
            return modul;
        }));

        setForms({
            ...forms,
            privileges: {
                ...forms.privileges,
                [moduleId]: {
                    ...forms.privileges?.[moduleId],
                    is_visible: actualValue,
                    is_create: actualValue,
                    is_read: actualValue,
                    is_edit: actualValue,
                    is_delete: actualValue,
                    is_void: actualValue,
                    is_override: actualValue
                },
            },
        });
    };

    //INPUTS
    function handleInputChange(e) {
        const key =  e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        console.log(key,value)
        setForms((forms) => ({
            ...forms,
            [key]: value,
        }));
        setRows({
            ...rows,
            [key]: value,
        });

        setClearErrors(key);
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
 
    const validate = () => {
        const newErrors = {};
        if (!forms.name) newErrors.name = "Name is required";
        if (!forms.is_superadmin) newErrors.is_superadmin = "Choose privilege!";
        return newErrors;
    };

    //Convert
    const convertText = (input) => {
        return input
        .split('-') // Split the string by '-'
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words with a space
    }
 
    const handleCreate = async (e) => {
        e.preventDefault();
    
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setLoading(true);
            try {
                const response = await axios.post(
                    "/privilege/postAddSave",
                    forms,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.type == "success") {
                    handleToast(response.data.message, response.data.type);
                    window.history.back();
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

    function handleSetAsSuperadmin(e) {
        const {key, value} = e.target;
        setRows({
            ...rows,
            [key]: value,
        });

        if(value == 1){
            setShowPriv(false)
        }else{
            setShowPriv(true)
        }

    };
   
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
            try {
                const response = await axios.post("/privilege/postEditSave", forms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type === "success") {
                    handleToast(response.data.message, response.data.type);
                    window.history.back();
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
    };
 
    return (
        <>
            <AppContent>
                <form onSubmit={row.length === 0 ? handleCreate : handleEdit}>
                    <ContentPanel marginBottom={2}>
                        <input
                            type="hidden"
                            name="header_id"
                            value={rows.id}
                            onChange={handleInputChange}
                        />
                        <InputComponent
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            displayName="Privilege Name"
                            placeholder="Privilege Name"
                            value={rows.name ?? forms.name}
                        ></InputComponent>
                        {errors.name && (
                            <div className="font-nunito-sans font-bold text-red-600 text-sm mt-1">
                                {errors.name}
                            </div>
                        )}
                        <div
                            id="set_as_superadmin"
                            onClick={handleSetAsSuperadmin}
                            className="mb-2"
                        >
                            <label className="block text-sm font-bold text-gray-700 font-nunito-sans mt-2">
                                Set as Superadmin
                            </label>
                            <RadioButton
                                label="Yes"
                                onChange={handleInputChange}
                                checked={rows.is_superadmin}
                                name="is_superadmin"
                                displayName="Yes"
                                value="1"
                            />
                            <RadioButton
                                label="No"
                                onChange={handleInputChange}
                                checked={rows.is_superadmin}
                                type="radio"
                                name="is_superadmin"
                                displayName="No"
                                value="0"
                            />

                            {errors.is_superadmin && (
                                <div className="font-nunito-sans font-bold text-red-600 text-sm mt-1">
                                    {errors.is_superadmin}
                                </div>
                            )}
                        </div>
                        <DropdownSelect
                            placeholder="Choose theme color"
                            selectType="react-select"
                            defaultSelect="Select them color"
                            onChange={handleInputChange}
                            name="theme_color"
                            options={themeColor}
                            value={ row.theme_color ? {label: convertText(row.theme_color) , value: row.theme_color ?? forms.theme_color} : row.theme_color ?? forms.theme_color}
                        />
                    </ContentPanel>
                    <ContentPanel>
                        {showPriv ?          
                            <div className="privilege_configuration">
                                <label className="block text-sm font-bold text-gray-700 font-nunito-sans mb-2">
                                    Privileges Configuration
                                </label>
                                <div
                                    id="privileges_configuration"
                                    className="flex flex-col mt-5 ml-2 overflow-x-auto overflow-y-hidden"
                                >
                                    <table>
                                        <thead>
                                            <tr className="font-nunito-sans font-extrabold h-12 text-white">
                                                <th width="3%" className="bg-gray-500">
                                                    No.
                                                </th>
                                                <th width="60%" className="bg-gray-500">
                                                    Module's Name
                                                </th>
                                                <th className="bg-gray-500">&nbsp;</th>
                                                <th className="bg-gray-500">View</th>
                                                <th className="bg-gray-500">Create</th>
                                                <th className="bg-gray-500">Read</th>
                                                <th className="bg-gray-500">Update</th>
                                                <th className="bg-gray-500">Delete</th>
                                                <th className="bg-gray-500">Void</th>
                                                <th className="bg-gray-500">Override</th>
                                            </tr>
                                            <tr>
                                                <th className="bg-blue-100">&nbsp;</th>
                                                <th className="bg-blue-100">&nbsp;</th>
                                                <th className="bg-blue-100 ">&nbsp;</th>
                                                <td className="bg-blue-100 flex justify-center">
                                                    <Checkbox
                                                        name="Check all vertical"
                                                        type="checkbox"
                                                        id="is_visible"
                                                        isChecked={selectAll.is_visible}
                                                        handleClick={(e) =>
                                                            handleSelectAll(
                                                                e,
                                                                "is_visible"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="bg-blue-100">
                                                    <div className="bg-blue-100 bg- flex justify-center">
                                                        <Checkbox
                                                            name="Check all vertical"
                                                            type="checkbox"
                                                            id="is_create"
                                                            isChecked={
                                                                selectAll.is_create
                                                            }
                                                            handleClick={(e) =>
                                                                handleSelectAll(
                                                                    e,
                                                                    "is_create"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className="bg-blue-100 bg- flex justify-center">
                                                    <Checkbox
                                                        name="Check all vertical"
                                                        type="checkbox"
                                                        id="is_read"
                                                        isChecked={selectAll.is_read}
                                                        handleClick={(e) =>
                                                            handleSelectAll(
                                                                e,
                                                                "is_read"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="bg-blue-100">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            name="Check all vertical"
                                                            type="checkbox"
                                                            id="is_edit"
                                                            isChecked={
                                                                selectAll.is_edit
                                                            }
                                                            handleClick={(e) =>
                                                                handleSelectAll(
                                                                    e,
                                                                    "is_edit"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className="flex justify-center bg-blue-100">
                                                    <Checkbox
                                                        name="Check all vertical"
                                                        type="checkbox"
                                                        id="is_delete"
                                                        isChecked={selectAll.is_delete}
                                                        handleClick={(e) =>
                                                            handleSelectAll(
                                                                e,
                                                                "is_delete"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="bg-blue-100">
                                                    <Checkbox
                                                        name="Check all vertical"
                                                        type="checkbox"
                                                        id="is_void"
                                                        isChecked={selectAll.is_void}
                                                        handleClick={(e) =>
                                                            handleSelectAll(
                                                                e,
                                                                "is_void"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="bg-blue-100 flex justify-center">
                                                    <Checkbox
                                                        name="Check all vertical"
                                                        type="checkbox"
                                                        id="is_override"
                                                        isChecked={selectAll.is_override}
                                                        handleClick={(e) =>
                                                            handleSelectAll(
                                                                e,
                                                                "is_override"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                modules.map((modul, index) => {                                          
                                                    return (
                                                        <tr key={modul.id}>
                                                            <td className="text-center font-nunito-sans font-semibold">
                                                                {index + 1}
                                                            </td>
                                                            <td className="text-center font-nunito-sans font-semibold">
                                                                {modul.name}
                                                            </td>
                                                            <td className="info bg-blue-100">
                                                                <div className="flex justify-center ">
                                                                    <Checkbox
                                                                        type="checkbox"
                                                                        title="Check All Horizontal"
                                                                        isChecked={
                                                                            modul.roles
                                                                                ?.is_visible &&
                                                                            modul.roles
                                                                                ?.is_create &&
                                                                            modul.roles
                                                                                ?.is_read &&
                                                                            modul.roles
                                                                                ?.is_edit &&
                                                                            modul.roles
                                                                                ?.is_delete &&
                                                                            modul.roles
                                                                                ?.is_void &&
                                                                            modul.roles
                                                                                ?.is_override
                                                                        }
                                                                        handleClick={(e) =>
                                                                            handleSelectHorizontal(
                                                                                e,
                                                                                modul.id
                                                                            )
                                                                        }
                                                                        className="select_horizontal"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="bg-gray-100 flex justify-center ">
                                                                <Checkbox
                                                                    type="checkbox"
                                                                    className="is_visible"
                                                                    id="is_visible"
                                                                    name={`privileges[${modul.id}][is_visible]`}
                                                                    isChecked={
                                                                        modul.roles
                                                                            ?.is_visible ||
                                                                        false
                                                                    }
                                                                    handleClick={(e) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            modul.id,
                                                                            "is_visible"
                                                                        )
                                                                    }
                                                                    value="1"
                                                                />
                                                            </td>
                                                            <td className="warning bg-yellow-100">
                                                                <div className="flex justify-center ">
                                                                    <Checkbox
                                                                        type="checkbox"
                                                                        className="is_create"
                                                                        id="is_create"
                                                                        name={`privileges[${modul.id}][is_create]`}
                                                                        isChecked={
                                                                            modul.roles
                                                                                ?.is_create ||
                                                                            false
                                                                        }
                                                                        handleClick={(e) =>
                                                                            handleCheckboxChange(
                                                                                e,
                                                                                modul.id,
                                                                                "is_create"
                                                                            )
                                                                        }
                                                                        value="1"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="info flex justify-center bg-indigo-200">
                                                                <Checkbox
                                                                    type="checkbox"
                                                                    className="is_read"
                                                                    name={`privileges[${modul.id}][is_read]`}
                                                                    isChecked={
                                                                        modul.roles
                                                                            ?.is_read ||
                                                                        false
                                                                    }
                                                                    handleClick={(e) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            modul.id,
                                                                            "is_read"
                                                                        )
                                                                    }
                                                                    value="1"
                                                                />
                                                            </td>
                                                            <td className="success bg-green-200">
                                                                <div className="flex justify-center">
                                                                    <Checkbox
                                                                        type="checkbox"
                                                                        className="is_edit"
                                                                        name={`privileges[${modul.id}][is_edit]`}
                                                                        isChecked={
                                                                            modul.roles
                                                                                ?.is_edit ||
                                                                            false
                                                                        }
                                                                        handleClick={(e) =>
                                                                            handleCheckboxChange(
                                                                                e,
                                                                                modul.id,
                                                                                "is_edit"
                                                                            )
                                                                        }
                                                                        value="1"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="danger bg-red-200 flex justify-center">
                                                                <Checkbox
                                                                    type="checkbox"
                                                                    className="is_delete"
                                                                    name={`privileges[${modul.id}][is_delete]`}
                                                                    isChecked={
                                                                        modul.roles
                                                                            ?.is_delete ||
                                                                        false
                                                                    }
                                                                    handleClick={(e) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            modul.id,
                                                                            "is_delete"
                                                                        )
                                                                    }
                                                                    value="1"
                                                                />
                                                            </td>
                                                            <td className="danger bg-red-200">
                                                                <Checkbox
                                                                    type="checkbox"
                                                                    className="is_void"
                                                                    name={`privileges[${modul.id}][is_void]`}
                                                                    isChecked={
                                                                        modul.roles
                                                                            ?.is_void ||
                                                                        false
                                                                    }
                                                                    handleClick={(e) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            modul.id,
                                                                            "is_void"
                                                                        )
                                                                    }
                                                                    value="1"
                                                                />
                                                            </td>
                                                            <td className="success bg-green-200 flex justify-center">
                                                                <Checkbox
                                                                    type="checkbox"
                                                                    className="is_override"
                                                                    name={`privileges[${modul.id}][is_override]`}
                                                                    isChecked={
                                                                        modul.roles
                                                                            ?.is_override ||
                                                                        false
                                                                    }
                                                                    handleClick={(e) =>
                                                                        handleCheckboxChange(
                                                                            e,
                                                                            modul.id,
                                                                            "is_override"
                                                                        )
                                                                    }
                                                                    value="1"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );                                     
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                         : '' }
                        <div className="mt-5 flex justify-between">
                            <Link href="/privileges" as="button">
                                <TableButton>Back</TableButton>
                            </Link>
                            <TableButton type="submit">Save</TableButton>
                        </div>
                    </ContentPanel>
                </form>
            </AppContent>
        </>
    );
};

export default AddPrivileges;
