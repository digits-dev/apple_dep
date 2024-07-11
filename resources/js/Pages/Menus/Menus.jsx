import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import Sortable from "react-sortablejs";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";


const MenusIndex = ({ menu_active, menu_inactive, privileges,  queryParams }) => {
    queryParams = queryParams || {};
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    const [activeMenus, setActiveMenus] = useState(menu_active);
    const [inactiveMenus, setInactiveMenus] = useState(menu_inactive);

    const handleMenuSave = (menus, isActive) => {
        axios.post('/menu_management/add', {
            menus: JSON.stringify(menus),
            isActive: isActive
        })
        .then(response => {
            console.log('Menu Saved!');
        })
        .catch(error => {
            console.error('There was an error saving the menu!', error);
        });
    };
    console.log(activeMenus);
    return (
        <>
            <Head title="Menu Management" />
            <AppContent>
                <ContentPanel>
                <div className="row">
                    <div className="col-sm-5">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <strong>Menu Order (Active)</strong>
                                <span id="menu-saved-info" className="pull-right text-success" style={{ display: 'none' }}>
                                    <i className="fa fa-check"></i> Menu Saved!
                                </span>
                            </div>
                            <div className="panel-body clearfix">
                                <Sortable 
                                    tag="ul" // Defaults to "div"
                                    onChange={(order) => {
                                        handleMenuSave(order);
                                    }}
                                 >

                           
                                {/* <Sortable
                                    className="draggable-menu draggable-menu-active list-disc space-y-2"
                                    onChange={(order, sortable, evt) => {
                                        // setActiveMenus(order);
                                        handleMenuSave(order);
                                    }}
                                > */}
                                    {activeMenus.map(menu => (
                                        <li key={menu.id} data-id={menu.id} data-name={menu.name}>
                                            <div className={menu.is_dashboard ? "is-dashboard" : ""} title={menu.is_dashboard ? "This is set as Dashboard" : ""}>
                                                <i className={menu.is_dashboard ? "icon-is-dashboard fa fa-dashboard" : menu.icon}></i> {menu.name}
                                                <span className="pull-right">
                                                    <a className="fa fa-pencil" title="Edit" href={`/path/to/edit/menu/${menu.id}`}></a>
                                                    <a className="fa fa-trash" title="Delete" onClick={() => handleDelete(menu.id)} href="javascript:void(0)"></a>
                                                </span>
                                                <br />
                                                <em className="text-muted">
                                                    {/* <small><i className="fa fa-users"></i> &nbsp; {menu.privileges.join(', ')}</small> */}
                                                </em>
                                            </div>
                                            {menu.children && (
                                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                                    {menu.children.map(child => (
                                                        <li key={child.id} data-id={child.id} data-name={child.name} className="space-x-6">
                                                            <div className={child.is_dashboard ? "is-dashboard" : ""} title={child.is_dashboard ? "This is set as Dashboard" : ""}>
                                                                <i className={child.is_dashboard ? "icon-is-dashboard fa fa-dashboard" : child.icon}></i> {child.name}
                                                                <span className="pull-right">
                                                                    <a className="fa fa-pencil" title="Edit" href={`/path/to/edit/menu/${child.id}`}></a>
                                                                    <a className="fa fa-trash" title="Delete" onClick={() => handleDelete(child.id)} href="javascript:void(0)"></a>
                                                                </span>
                                                                <br />
                                                                <em className="text-muted">
                                                                    {/* <small><i className="fa fa-users"></i> &nbsp; {child.privileges.join(', ')}</small> */}
                                                                </em>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </Sortable>
                                {/* </Sortable> */}
                                {activeMenus.length === 0 && <div align="center">Active menu is empty, please add new menu</div>}
                            </div>
                        </div>

                        <div className="panel panel-danger">
                            <div className="panel-heading">
                                <strong>Menu Order (Inactive)</strong>
                            </div>
                            <div className="panel-body clearfix">
                                {/* <Sortable
                                    className="draggable-menu draggable-menu-inactive"
                                    onChange={(order, sortable, evt) => {
                                        setInactiveMenus(order);
                                        handleMenuSave(order);
                                    }}
                                > */}
                                    {inactiveMenus.map(menu => (
                                        <li key={menu.id} data-id={menu.id} data-name={menu.name}>
                                            <div>
                                                <i className={menu.icon}></i> {menu.name}
                                                <span className="pull-right">
                                                    <a className="fa fa-pencil" title="Edit" href={`/path/to/edit/menu/${menu.id}`}></a>
                                                    <a className="fa fa-trash" title="Delete" onClick={() => handleDelete(menu.id)} href="javascript:void(0)"></a>
                                                </span>
                                            </div>
                                            {menu.children && (
                                                <ul>
                                                    {menu.children.map(child => (
                                                        <li key={child.id} data-id={child.id} data-name={child.name}>
                                                            <div>
                                                                <i className={child.icon}></i> {child.name}
                                                                <span className="pull-right">
                                                                    <a className="fa fa-pencil" title="Edit" href={`/path/to/edit/menu/${child.id}`}></a>
                                                                    <a className="fa fa-trash" title="Delete" onClick={() => handleDelete(child.id)} href="javascript:void(0)"></a>
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                {/* </Sortable> */}
                                {inactiveMenus.length === 0 && <div align="center" id="inactive_text" className="text-muted">Inactive menu is empty</div>}
                            </div>
                        </div>
                    </div>
                  
                </div>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default MenusIndex;
