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
import DissapearingToast from "../../Components/Toast/DissapearingToast";

const AddPrivileges = ({modules, row, role_data}) => {
    const { setTitle } = useContext(NavbarContext);
    const [roles, setRoles] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [clearErrors, setClearErrors] = useState({});
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectAll, setSelectAll] = useState({
        is_visible: false,
        is_create: false,
        is_read: false,
        is_edit: false,
        is_delete: false,
    });

    const [forms, setForms] = useState({
        name: "",
        is_superadmin: "",
        privileges: {},
        theme_color: ""
    });

    useEffect(()=>{
        setTitle('Add Privileges');
        setRoles(role_data);
        setRows(row);
    },[]);

    const handleSelectAll = (e,permission) => {
        const { type, checked } = e.target;
        const actualValue = type === 'checkbox' ? (checked ? "1" : "") : value;
        // Update roles state based on new select all state
        modules.map((item) => {
            setRoles((prevRoles) => ({
                ...prevRoles,
                [item.id]: {
                    [permission]: !prevRoles[item.id]?.[permission],
                },
            }));

            setForms({
                ...forms,
                privileges: {
                    ...forms.privileges,
                    [item.id]: {
                        ...forms.privileges[item.id],
                        [permission]: actualValue
                    }
                }      
            });
        });

        setSelectAll((prevState) => ({
            ...prevState,
            [permission]: !prevState[permission],
        }));
    };

    const handleCheckboxChange = (e, moduleId, permission) => {
        const { name, value, type, checked } = e.target;
        const actualValue = type === 'checkbox' ? (checked ? "1" : "") : value;
        const nameParts = name.split(/[\[\]]/).filter(Boolean);
        if (nameParts.length === 3) {
            setForms({
                ...forms,
                privileges: {
                    ...forms.privileges,
                    [nameParts[1]]: {
                        ...forms.privileges[nameParts[1]],
                        [nameParts[2]]: actualValue
                    }
                }
            });
        } 
        // Update roles based on the changed permissions
        setRoles((prevRoles) => ({
            ...prevRoles,
            [moduleId]: {
                ...prevRoles[moduleId],
                [permission]: !prevRoles[moduleId]?.[permission],
            },
        }));
    };

    const handleSelectHorizontal = (e,moduleId) => {
        const { type, checked } = e.target;
        const actualValue = type === 'checkbox' ? (checked ? "1" : "0") : value;

        const isChecked = !roles[moduleId]?.is_visible;
        setRoles((prevRoles) => ({
            ...prevRoles,
            [moduleId]: {
                is_visible: isChecked,
                is_create: isChecked,
                is_read: isChecked,
                is_edit: isChecked,
                is_delete: isChecked,
            },
        }));

        setForms({
            ...forms,
            privileges: {
                ...forms.privileges,
                [moduleId]: {
                    ...forms.privileges[moduleId],
                    is_visible: actualValue,
                    is_create: actualValue,
                    is_read: actualValue,
                    is_edit: actualValue,
                    is_delete: actualValue,
                }
            }      
        });
    };

    //INPUTS
    function handleInputChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setForms((forms) => ({
            ...forms,
            [key]: value,
        }));
        setClearErrors(key);
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!forms.name) newErrors.name = "Name is required";
        if (!forms.is_superadmin) newErrors.is_superadmin = "Choose privilege!";
        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setLoading(true);
            try {
                const response = await axios.post("/privilege/postAddSave", forms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type == "success") {
                    setFormMessage(response.data.message);
                    setMessageType(response.data.type);
                    setTimeout(() => setFormMessage(""), 3000);
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

    const handleSetAsSuperadmin = (e) => {
        console.log(e.target.value);
    }

    const handleEdit = async (e) => {
        e.preventDefault();
    };

    return(
    <>
         <AppContent>
            <DissapearingToast type={messageType} message={formMessage} />
            <ContentPanel>
            <form onSubmit={rows ? handleCreate : handleEdit}>
                <InputComponent  type="text" name="name" inputChange={handleInputChange} displayName="Privilege Name" placeholder="Privilege Name" value={rows ? rows.name : forms.name}></InputComponent>
                {(errors.name) && (
                    <div className="font-nunito-sans font-bold text-red-600">
                        {errors.name}
                    </div>
                )}
                <div id='set_as_superadmin' onClick={handleSetAsSuperadmin}>
                    <label>Set as Superadmin</label>
                    <InputComponent inputChange={handleInputChange} checked={rows.is_superadmin} type="radio" name="is_superadmin" displayName="Yes" value="1"></InputComponent>
                    <InputComponent inputChange={handleInputChange} checked={rows.is_superadmin} type="radio" name="is_superadmin" displayName="No" value="0"></InputComponent>
                    {(errors.is_superadmin) && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.is_superadmin}
                        </div>
                    )}
                </div>
                <Select onChange={handleInputChange} name="theme_color" options={themeColor} />
                <div id='privileges_configuration'>
                    <label> Privileges Configuration</label>
                    <table >
                        <thead>
                            <tr>
                                <th width='3%'> No.</th>
                                <th width='60%'> Module's Name</th>
                                <th>&nbsp;</th>
                                <th>View</th>
                                <th>Create</th>
                                <th>Read</th>
                                <th>Update</th>
                                <th>Delete</th>
                                <th>&nbsp;</th>
                            </tr>
                            <tr>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_visible' 
                                        isChecked={selectAll.is_visible} 
                                        handleClick={(e) => handleSelectAll(e,'is_visible')}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_create' 
                                        isChecked={selectAll.is_create}
                                        handleClick={(e) => handleSelectAll(e,'is_create')}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_read' 
                                        isChecked={selectAll.is_read}
                                        handleClick={(e) => handleSelectAll(e,'is_read')}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_edit' 
                                        isChecked={selectAll.is_edit}
                                        handleClick={(e) => handleSelectAll(e,'is_edit')}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_delete' 
                                        isChecked={selectAll.is_delete}
                                        handleClick={(e) => handleSelectAll(e,'is_delete')}
                                    />
                                </td>
                                <td></td>

                            </tr>
                        </thead>
                        <tbody>
                        {modules.map((modul, index) => {
                            return (
                                <tr key={modul.id}>
                                    <td>{index + 1}</td>
                                    <td>{modul.name}</td>
                                    <td className='info'>
                                        <Checkbox
                                            type='checkbox'
                                            title='Check All Horizontal'
                                            isChecked={roles[modul.id]?.is_visible && roles[modul.id]?.is_create && roles[modul.id]?.is_read && roles[modul.id]?.is_edit && roles[modul.id]?.is_delete} 
                                            handleClick={(e) => handleSelectHorizontal(e,modul.id)}
                                            className='select_horizontal'
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_visible'
                                            id='is_visible' 
                                            name={`privileges[${modul.id}][is_visible]`}
                                            isChecked={roles[modul.id]?.is_visible || false} 
                                            handleClick={(e) => handleCheckboxChange(e,modul.id, 'is_visible')}
                                            value='1'
                                        />
                                    </td>
                                    <td className='warning'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_create'
                                            id='is_create'
                                            name={`privileges[${modul.id}][is_create]`}
                                            isChecked={roles[modul.id]?.is_create || false} 
                                            handleClick={(e) => handleCheckboxChange(e,modul.id, 'is_create')}
                                            value='1'
                                        />
                                    </td>
                                    <td className='info'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_read'
                                            name={`privileges[${modul.id}][is_read]`}
                                            isChecked={roles[modul.id]?.is_read || false} 
                                            handleClick={(e) => handleCheckboxChange(e,modul.id, 'is_read')}
                                            value='1'
                                        />
                                    </td>
                                    <td className='success'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_edit'
                                            name={`privileges[${modul.id}][is_edit]`}
                                            isChecked={roles[modul.id]?.is_edit || false} 
                                            handleClick={(e) => handleCheckboxChange(e,modul.id, 'is_edit')}
                                            value='1'
                                        />
                                    </td>
                                    <td className='danger'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_delete'
                                            name={`privileges[${modul.id}][is_delete]`}
                                            isChecked={roles[modul.id]?.is_delete || false} 
                                            handleClick={(e) => handleCheckboxChange(e,modul.id, 'is_delete')}
                                            value='1'
                                        />
                                    </td>
                                </tr>
                            );
                        })}                        
                        </tbody>
                    </table>
                </div>
                <TableButton type="submit">
                    Save
                </TableButton>
             </form>
            </ContentPanel>
         </AppContent>
    </>
    );
}

export default AddPrivileges;