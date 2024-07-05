import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useContext, useEffect, useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import InputComponent from "../../Components/Forms/Input";
import { NavbarContext } from "../../Context/NavbarContext";
import Select from "../../Components/Forms/Select";
import themeColor from "./ThemeColor";
import Checkbox from "../../Components/Checkbox/Checkbox";

const AddPrivileges = ({modules, row, role_data}) => {
    const { setTitle } = useContext(NavbarContext);
    const [roles, setRoles] = useState({});
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    useEffect(()=>{
        setTitle('Add Privileges');
        setRoles(role_data);
    },[]);

    //CHECKBOX
    const handleSelectAll = (e) => {
        const name = e.target.id;
        setIsCheckAll(!isCheckAll);
        setIsCheck(name);
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
        console.log(id)
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        // if (Object.keys(newErrors).length > 0) {
        //     setErrors(newErrors);
        // } else {
        //     setLoading(true);
        //     try {
        //         const response = await axios.post("/postAddSave", forms, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data",
        //             },
        //         });
        //         if (response.data.type == "success") {
        //             setFormMessage(response.data.message);
        //             setMessageType(response.data.type);
        //             setTimeout(() => setFormMessage(""), 3000);
        //             setShowCreateModal(false);
        //             router.reload({ only: ["users"] });
        //         } else {
        //             setErrorMessage(response.data.message);
        //         }
        //     } catch (error) {
        //         if (error.response && error.response.status === 422) {
        //             setErrors(error.response.data.errors);
        //         } else {
        //             setErrors({
        //                 general: "An error occurred. Please try again.",
        //             });
        //         }
        //     } finally {
        //         setLoading(false);
        //     }
        // }
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
            <ContentPanel>
            <form onSubmit={row ? handleCreate : handleEdit}>
                <InputComponent type="text" name="name" displayName="Privilege Name" placeholder="Privilege Name" value={row ? row.name : ''}></InputComponent>
                <div id='set_as_superadmin' onClick={handleSetAsSuperadmin}>
                    <label>Set as Superadmin</label>
                    <InputComponent checked={row.is_superadmin} type="radio" name="is_superadmin" displayName="Yes" value="1"></InputComponent>
                    <InputComponent checked={row.is_superadmin} type="radio" name="is_superadmin" displayName="No" value="0"></InputComponent>
                </div>
                <Select name="theme_color" options={themeColor} />
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
                                        handleClick={handleSelectAll}
                                        isChecked={isCheck}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_create' 
                                        handleClick={handleSelectAll}
                                        isChecked={isCheck}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_read' 
                                        handleClick={handleSelectAll}
                                        isChecked={isCheck}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_edit' 
                                        handleClick={handleSelectAll}
                                        isChecked={isCheck}
                                    />
                                </td>
                                <td>
                                    <Checkbox 
                                        name='Check all vertical' 
                                        type='checkbox' 
                                        id='is_delete' 
                                        handleClick={handleSelectAll}
                                        isChecked={isCheck}
                                    />
                                </td>
                                <td></td>

                            </tr>
                        </thead>
                        <tbody>
                        {modules.map((modul, index) => {
                            const role = roles[modul.id] ? roles[modul.id][0] : {};
                            return (
                                <tr key={modul.id}>
                                    <td>{index + 1}</td>
                                    <td>{modul.name}</td>
                                    <td className='info'>
                                        <Checkbox
                                            type='checkbox'
                                            title='Check All Horizontal'
                                            handleClick={handleSelectAll}
                                            isChecked={isCheck}
                                            className='select_horizontal'
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_visible'
                                            name={`roles[${modul.id}][is_visible]`}
                                            isChecked={isCheck.includes('is_visible')}
                                            handleClick={handleClick}
                                            value='1'
                                        />
                                    </td>
                                    <td className='warning'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_create'
                                            name={`roles[${modul.id}][is_create]`}
                                            isChecked={isCheck.includes('is_create')}
                                            handleClick={handleClick}
                                            value='1'
                                        />
                                    </td>
                                    <td className='info'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_read'
                                            name={`roles[${modul.id}][is_read]`}
                                            isChecked={isCheck.includes('is_read')}
                                            handleClick={handleClick}
                                            value='1'
                                        />
                                    </td>
                                    <td className='success'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_edit'
                                            name={`roles[${modul.id}][is_edit]`}
                                            isChecked={isCheck.includes('is_edit')}
                                            handleClick={handleClick}
                                            value='1'
                                        />
                                    </td>
                                    <td className='danger'>
                                        <Checkbox
                                            type='checkbox'
                                            className='is_delete'
                                            name={`roles[${modul.id}][is_delete]`}
                                            isChecked={isCheck.includes('is_delete')}
                                            handleClick={handleClick}
                                            value='1'
                                        />
                                    </td>
                                </tr>
                            );
                        })}                        
                        </tbody>
                    </table>

                </div>
             </form>
            </ContentPanel>
         </AppContent>
    </>
    );
}

export default AddPrivileges;