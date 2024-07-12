import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import axios from "axios";
import DissapearingToast from "../../Components/Toast/DissapearingToast";
const MenusIndex = ({
    menu_active,
    menu_inactive,
    privileges,
    queryParams,
}) => {
    const [menuActive, setMenuActive] = useState(menu_active);
    const [menuInactive, setMenuInactive] = useState(menu_inactive);
    const [draggingItem, setDraggingItem] = useState(null);
    const [draggingOverItem, setDraggingOverItem] = useState(null);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleDragStart = (e, item, parentIndex, isActive, index) => {
        e.stopPropagation(parentIndex);
        console.log();
        setDraggingItem({ item, parentIndex, isActive, index });
    };

    const handleDragOver = (e, targetIndex, targetParentIndex) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOverItem({ targetIndex, targetParentIndex });
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggingItem && draggingOverItem) {
            try {
                let updatedMenus = draggingItem.isActive
                    ? [...menuActive]
                    : [...menuInactive];
                const {
                    item: draggedItem,
                    parentIndex: sourceParentIndex,
                    isActive,
                    index: draggedIndex,
                } = draggingItem;
                const { targetIndex, targetParentIndex } = draggingOverItem;

                const sourceParent = updatedMenus[sourceParentIndex];
                const targetParent =
                    targetParentIndex !== undefined
                        ? updatedMenus[targetParentIndex]
                        : null;

                // Remove the dragged item from its current position
                if (sourceParent) {
                    if (sourceParent.children) {
                        sourceParent.children = sourceParent.children.filter(
                            (_, i) => i !== draggedIndex
                        );
                    }
                } else {
                    updatedMenus = updatedMenus.filter(
                        (_, i) => i !== draggedIndex
                    );
                }

                // Insert the dragged item into the new position
                if (targetParent) {
                    if (!targetParent.children) targetParent.children = [];
                    targetParent.children.splice(targetIndex, 0, draggedItem);
                } else {
                    updatedMenus.splice(targetIndex, 0, draggedItem);
                }

                // Update the state and save the menu
                if (isActive) {
                    setMenuActive(updatedMenus);
                    handleSaveMenu(updatedMenus, true);
                } else {
                    setMenuInactive(updatedMenus);
                    handleSaveMenu(updatedMenus, false);
                }

                // Clear dragging states
                setDraggingItem(null);
                setDraggingOverItem(null);
            } catch (error) {
                console.error("Error updating menu order:", error);
            }
        }
    };

    const handleSaveMenu = async (menus, isActive) => {
        console.log(menus);
        try {
            const response = await axios.post("/menu_management/add", {
                menus: JSON.stringify(menus),
                isActive,
            });
            setFormMessage(response.data.message);
            setMessageType(response.data.type);
            router.reload({ only: ["Menus"] });
        } catch (error) {
            console.error("Error saving menu:", error);
        }
    };

    const renderMenuItems = (menus, isActive, parentIndex = null) => {
        return menus.map((menu, index) => (
            <div
                key={menu.id}
                data-id={menu.id}
                data-name={menu.name}
                draggable
                onDragStart={(e) =>
                    handleDragStart(e, menu, parentIndex, isActive, index)
                }
                onDragOver={(e) => handleDragOver(e, index, parentIndex)}
                onDrop={handleDrop}
                className="draggable-item"
            >
                <div
                    className={menu.is_dashboard ? "is-dashboard" : ""}
                    title={menu.is_dashboard ? "This is set as Dashboard" : ""}
                >
                    <i
                        className={
                            menu.is_dashboard
                                ? "icon-is-dashboard fa fa-dashboard"
                                : menu.icon
                        }
                    ></i>{" "}
                    {menu.name}
                    <span className="pull-right">
                        <a
                            className="fa fa-pencil"
                            title="Edit"
                            href={`/menu_management/edit/${menu.id}`}
                        ></a>
                        &nbsp;&nbsp;
                        <a
                            title="Delete"
                            className="fa fa-trash"
                            onClick={() => handleDelete(menu.id)}
                            href="javascript:void(0)"
                        ></a>
                    </span>
                    <br />
                    <em className="text-muted">
                        {/* <small><i className="fa fa-users"></i> &nbsp; {menu.privileges.join(', ')}</small> */}
                    </em>
                </div>
                {menu.children && menu.children.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        {renderMenuItems(menu.children, isActive, index)}
                    </ul>
                )}
            </div>
        ));
    };

    return (
        <div>
            <Head title="Menu Management" />
            <AppContent>
                <DissapearingToast type={messageType} message={formMessage} />
                <ContentPanel>
                    {/* MENU ORDER ACTIVE */}
                    <div className="panel panel-default border-2 border-green-500">
                        <div className="panel-heading">
                            <strong>Menu Order (Active)</strong>
                            <span
                                id="menu-saved-info"
                                style={{ display: "none" }}
                                className="pull-right text-success"
                            >
                                <i className="fa fa-check"></i> Menu Saved !
                            </span>
                        </div>
                        <div className="panel-body clearfix">
                            <ul className="draggable-menu draggable-menu-active list-disc space-y-2">
                                {renderMenuItems(menuActive, true)}
                            </ul>
                            {menuActive.length === 0 && (
                                <div align="center">
                                    Active menu is empty, please add new menu
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MENU ORDER INACTIVE */}
                    <div className="panel panel-danger border-2 border-red-500">
                        <div className="panel-heading">
                            <strong>Menu Order (Inactive)</strong>
                        </div>
                        <div className="panel-body clearfix">
                            <ul className="draggable-menu draggable-menu-inactive">
                                {renderMenuItems(menuInactive, false)}
                            </ul>
                            {menuInactive.length === 0 && (
                                <div
                                    align="center"
                                    id="inactive_text"
                                    className="text-muted"
                                >
                                    Inactive menu is empty
                                </div>
                            )}
                        </div>
                    </div>
                </ContentPanel>
            </AppContent>
        </div>
    );
};

export default MenusIndex;
