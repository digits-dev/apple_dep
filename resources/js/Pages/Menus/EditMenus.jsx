import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { NavbarContext } from "../../Context/NavbarContext";
import TableButton from '../../Components/Table/Buttons/TableButton';
import { Link } from '@inertiajs/react';
import InputComponent from '../../Components/Forms/Input';
import AppContent from '../../Layouts/layout/AppContent';
import ContentPanel from '../../Components/Table/ContentPanel';
import { useToast } from "../../Context/ToastContext";


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
    const { handleToast } = useToast();

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
                handleToast(response.data.message, response.data.type);
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

    const colourStyles = {
        multiValue: (styles, { data }) => {
          const color = data.color;
          return {
            ...styles,
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: data.color,
          ':hover': {
            backgroundColor: data.color,
            color: 'white',
          },
          backgroundColor: 'black',
          color: 'white',
        }),
    };
    
    return (
        <div>
            <AppContent>
                <ContentPanel>
                    {/* <div className="bg-mobile-gradient p-3 rounded-tl-lg rounded-tr-lg">
                        <p className="text-white font-extrabold text-center">
                            Edit Menus
                        </p>
                    </div> */}
                   
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                        <input type="hidden" name="menu_id" value={menus.id} />
                            <div className="w-full">
                                <label for="select-multiple" className="block text-sm font-medium text-gray-700"> Privilege</label>
                                <Select
                                    isMulti
                                    name="privileges_id"
                                    className="block w-full py-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={privileges.filter(priv => privilegesId.includes(priv.id)).map(priv => ({ value: priv.id, label: priv.name }))}
                                    onChange={handlePrivilegesChange}
                                    options={privileges.map(priv => ({ value: priv.id, label: priv.name }))}
                                    styles={colourStyles}
                                    
                                />
                            </div>
                            <div className="w-full">
                                <InputComponent
                                    type="text"
                                    name="menu_name"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <InputComponent
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <InputComponent
                                    type="text"
                                    name="icon"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                />
                            </div>

                            <div className="mt-5 flex justify-between">
                                <Link href="/menu_management" as="button">
                                    <TableButton>Back</TableButton>
                                </Link>
                                <TableButton type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</TableButton>
                            </div>
                    </form>
                </ContentPanel>
            </AppContent>
        </div>
    );
};

export default EditMenu;
