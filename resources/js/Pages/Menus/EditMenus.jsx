import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { NavbarContext } from "../../Context/NavbarContext";
import TableButton from '../../Components/Table/Buttons/TableButton';
import { Link } from '@inertiajs/react';
import InputComponent from '../../Components/Forms/Input';
import AppContent from '../../Layouts/layout/AppContent';
import DissapearingToast from '../../Components/Toast/DissapearingToast';

const EditMenu = ({ menus, privileges, menuData }) => {
    const { setTitle } = useContext(NavbarContext);
    const [loading, setLoading] = useState(false);
    const [privilegesId, setPrivilegesId] = useState([]);
    const [menuName, setMenuName] = useState(menus.name);
    const [slug, setSlug] = useState(menus.slug);
    const [icon, setIcon] = useState(menus.icon);
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setTimeout(()=>{
            setTitle("Edit Menus");
        },5);

        setPrivilegesId(menuData.map(priv => priv.id));
    }, [menuData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`/menu_management/edit-menu-save/${menus.id}`, {
                menu_name: menuName,
                slug: slug,
                icon: icon,
                privileges_id: privilegesId,
            });
            if (response.data.type == "success") {
                setFormMessage(response.data.message);
                setMessageType(response.data.type);
                setTimeout(() => setFormMessage(""), 3000);
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

    const handlePrivilegesChange = (selectedOptions) => {
        setPrivilegesId(selectedOptions.map(option => option.value));
    };
    
    return (
        <AppContent>
                <DissapearingToast type={messageType} message={formMessage} />
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    Edit Menus
                </div>
                <div className='panel-body'>
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                        <input type="hidden" name="menu_id" value={menus.id} />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="w-full max-w-xs">
                                    <label for="select-multiple" className="block text-sm font-medium text-gray-700"> Privilege</label>
                                    <Select
                                        isMulti
                                        name="privileges_id"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={privileges.filter(priv => privilegesId.includes(priv.id)).map(priv => ({ value: priv.id, label: priv.name }))}
                                        onChange={handlePrivilegesChange}
                                        options={privileges.map(priv => ({ value: priv.id, label: priv.name }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <InputComponent
                                        type="text"
                                        name="menu_name"
                                        value={menuName}
                                        onChange={(e) => setMenuName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <InputComponent
                                        type="text"
                                        name="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <InputComponent
                                        type="text"
                                        name="icon"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                    />
                                </div>
                            </div><br />
                            <div className="mt-5 flex justify-between">
                            <Link href="/privileges" as="button">
                                <TableButton>Back</TableButton>
                            </Link>
                            <TableButton type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</TableButton>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppContent>
    );
};

export default EditMenu;
