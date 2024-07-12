import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import axios from "axios";
import DissapearingToast from "../../Components/Toast/DissapearingToast";
const MenusIndex = ({ menu_active, menu_inactive, privileges,  queryParams }) => {
   
    const [menuActive, setMenuActive] = useState(menu_active);
    const [menuInactive, setMenuInactive] = useState(menu_inactive);
    const [draggingItem, setDraggingItem] = useState(null);
    const [draggingOverItem, setDraggingOverItem] = useState(null);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // useEffect(() => {
      
    // }, []);

    const handleDragStart = (e, menu) => {
        setDraggingItem(menu);
    };

    const handleDragOver = (e, menu) => {
        e.preventDefault();
        setDraggingOverItem(menu);
    };

    const handleDrop = async (e, isActive) => {
        e.preventDefault();
        if (draggingItem && draggingOverItem) {
            const draggedIndex = menuActive.findIndex(menu => menu.id === draggingItem.id);
            const targetIndex = menuActive.findIndex(menu => menu.id === draggingOverItem.id);
            
            let updatedMenus;
            if (isActive) {
                updatedMenus = [...menuActive];
                updatedMenus.splice(draggedIndex, 1);
                updatedMenus.splice(targetIndex, 0, draggingItem);
                setMenuActive(updatedMenus);
            } else {
                updatedMenus = [...menuInactive];
                updatedMenus.splice(draggedIndex, 1);
                updatedMenus.splice(targetIndex, 0, draggingItem);
                setMenuInactive(updatedMenus);
            }

            handleSaveMenu(updatedMenus, isActive);
            setDraggingItem(null);
            setDraggingOverItem(null);
        }
    };

    const handleSaveMenu = async (menus, isActive) => {
        try {
            const response = await axios.post('/menu_management/add', {
                menus: JSON.stringify(menus),
                isActive
            });
            setFormMessage(response.data.message);
            setMessageType(response.data.type);
        } catch (error) {
            console.error('Error saving menu:', error);
        }
    };


    return (
        <div>
            <Head title="Menu Management" />
            <AppContent>
            <DissapearingToast type={messageType} message={formMessage} />
                <ContentPanel>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <strong>Menu Order (Active)</strong> <span id='menu-saved-info' style={{ display: 'none' }} className='pull-right text-success'><i
                                        className='fa fa-check'></i> Menu Saved !</span>
                                </div>
                                <div className="panel-body clearfix">
                                    <ul className='draggable-menu draggable-menu-active list-disc space-y-2'>
                                        {menuActive.map((menu, index) => (
                                            <li key={menu.id} data-id={menu.id} data-name={menu.name}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, menu)}
                                                onDragOver={(e) => handleDragOver(e, menu)}
                                                onDrop={(e) => handleDrop(e, true)}>
                                                <div className={menu.is_dashboard ? "is-dashboard" : ""} title={menu.is_dashboard ? 'This is setted as Dashboard' : ''}>
                                                    <i className={menu.is_dashboard ? "icon-is-dashboard fa fa-dashboard" : menu.icon}></i> {menu.name} <span
                                                        className='pull-right'>
                                                        <a className='fa fa-pencil' title='Edit' href={`/menu_management/edit/${menu.id}`}></a>
                                                        &nbsp;&nbsp;
                                                        <a title='Delete' className='fa fa-trash' onClick={() => handleDelete(menu.id)} href='javascript:void(0)'></a>
                                                    </span>
                                                    <br /><em className="text-muted">
                                                        {/* <small><i className="fa fa-users"></i> &nbsp; {menu.privileges.join(', ')}</small> */}
                                                    </em>
                                                </div>
                                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                                    {menu.children && menu.children.map(child => (
                                                        <li key={child.id} data-id={child.id} data-name={child.name}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, child)}
                                                            onDragOver={(e) => handleDragOver(e, child)}
                                                            onDrop={(e) => handleDrop(e, true)}>
                                                            <div className={child.is_dashboard ? "is-dashboard" : ""} title={child.is_dashboard ? 'This is setted as Dashboard' : ''}>
                                                                <i className={child.is_dashboard ? "icon-is-dashboard fa fa-dashboard" : child.icon}></i> {child.name}
                                                                <span className='pull-right'>
                                                                    <a className='fa fa-pencil' title='Edit' href={`/menu_management/edit/${child.id}`}></a>
                                                                    &nbsp;&nbsp;
                                                                    <a title="Delete" className='fa fa-trash' onClick={() => handleDelete(child.id)} href='javascript:void(0)'></a>
                                                                </span>
                                                                <br /><em className="text-muted">
                                                                    {/* <small><i className="fa fa-users"></i> &nbsp; {child.privileges.join(', ')}</small> */}
                                                                </em>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                    {menuActive.length === 0 && <div align="center">Active menu is empty, please add new menu</div>}
                                </div>
                            </div>

                            <div className="panel panel-danger">
                                <div className="panel-heading">
                                    <strong>Menu Order (Inactive)</strong>
                                </div>
                                <div className="panel-body clearfix">
                                    <ul className='draggable-menu draggable-menu-inactive'>
                                        {menuInactive.map((menu, index) => (
                                            <li key={menu.id} data-id={menu.id} data-name={menu.name}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, menu)}
                                                onDragOver={(e) => handleDragOver(e, menu)}
                                                onDrop={(e) => handleDrop(e, false)}>
                                                <div>
                                                    <i className={menu.icon}></i> {menu.name} <span className='pull-right'>
                                                        <a className='fa fa-pencil' title='Edit' href={`/menu_management/edit/${menu.id}`}></a>
                                                        &nbsp;&nbsp;
                                                        <a title='Delete' className='fa fa-trash' onClick={() => handleDelete(menu.id)} href='javascript:void(0)'></a>
                                                    </span>
                                                </div>
                                                <ul>
                                                    {menu.children && menu.children.map(child => (
                                                        <li key={child.id} data-id={child.id} data-name={child.name}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, child)}
                                                            onDragOver={(e) => handleDragOver(e, child)}
                                                            onDrop={(e) => handleDrop(e, false)}>
                                                            <div>
                                                                <i className={child.icon}></i> {child.name} <span className='pull-right'>
                                                                    <a className='fa fa-pencil' title='Edit' href={`/menu_management/edit/${child.id}`}></a>
                                                                    &nbsp;&nbsp;
                                                                    <a title="Delete" className='fa fa-trash' onClick={() => handleDelete(child.id)} href='javascript:void(0)'></a>
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                    {menuInactive.length === 0 && <div align="center" id='inactive_text' className='text-muted'>Inactive menu is empty</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentPanel>
            </AppContent>
        </div>
    );
};

export default MenusIndex;
