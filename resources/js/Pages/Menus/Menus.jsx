import { Head, Link, router, usePage  } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";
import RowAction from "../../Components/Table/RowAction";

const MenusIndex = ({
    menu_active,
    menu_inactive,
    privileges,
    queryParams,
}) => {
    const { handleToast } = useToast();
    const [menuActive, setMenuActive] = useState(menu_active);
    const [menuInactive, setMenuInactive] = useState(menu_inactive);
    const [draggingItem, setDraggingItem] = useState(null);
    const [draggingOverItem, setDraggingOverItem] = useState(null);
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleWheel = (e) => {
        handleAutoScroll(e);
    };
   
    const handleDragStart = (e, item, parentIndex, isActive, index) => {
        setIsDragging(true);
        handleWheel(e);
        e.stopPropagation(parentIndex);
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
        setIsDragging(false);
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
                        ? updatedMenus[targetParentIndex??targetIndex]
                        : null;

                // Remove the dragged item from its current position
                if (sourceParent) {
                    if (sourceParent.children) {
                        sourceParent.children = sourceParent.children.filter(
                            (_, i) => i !== draggedIndex
                        );
                    } else {
                        updatedMenus = updatedMenus.filter(
                            (_, i) => i !== sourceParentIndex
                        );
                    }
                } else {
                    updatedMenus = updatedMenus.filter(
                        (_, i) => i !== draggedIndex
                    );
                }
          
          
                // Insert the dragged item into the new position
                if (targetParent) {
                    if (!targetParent.children && targetParent.type !== 'Route'){
                        targetParent.children = []
                        targetParent.children.push(draggedItem);
                    } else if(targetParent.children){
                        targetParent.children.splice(targetIndex, 0, draggedItem);
                    }else{
                        updatedMenus.splice(targetIndex, 0, draggedItem);
                    }
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
        // console.log(menus);
        try {
            const response = await axios.post("/menu_management/add", {
                menus: JSON.stringify(menus),
                isActive,
            });

            handleToast(response.data.message, response.data.type);
   
            router.reload({ only: ["Menus"] });
        } catch (error) {
            console.error("Error saving menu:", error);
        }
    };

    const handleMenusEvent = async (id, value) => {
        const bulk_action_type = value;
        Swal.fire({
            title: `<p class="font-nunito-sans" >Set to ${
                !bulk_action_type == 0 ? "Active" : "Inactive"
            }?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(
                        "/set-status-menus",
                        { id , bulk_action_type},
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    if (response.data.status == "success") {
                        handleToast(response.data.message, response.data.status);
                        router.reload();
                    }
                } catch (error) {}
            }
        });
    }

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
                className={`rounded-lg  ${
                    parentIndex == null ? "bg-gray-400" : "bg-gray-500"
                } text-white cursor-grab`}
            >
                <div
                    className={`flex items-center justify-between ${
                        parentIndex == null ? "p-4" : "p-3"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <i
                            className={`${menu.icon}  ${
                                parentIndex == null ? "text-xl" : "text-md"
                            }`}
                        ></i>
                        <p
                            className={`${
                                parentIndex == null
                                    ? "text-md font-bold"
                                    : "text-sm"
                            }`}
                        >
                            {menu.name}
                        </p> 
                    </div>

                    <div className="mr-3 flex items-center gap-1">
                        <Link
                            className={`fa fa-pencil text-white ${
                                parentIndex == null ? "text-lg" : "text-sm"
                            }`}
                            action="edit"
                            href={`/menu_management/edit/${menu.id}`}
                        ></Link>
                        &nbsp;&nbsp;
                        {menu.is_active == 1 ?   <a
                            title="Delete"
                            className={`fa fa-times-circle text-white ${
                                parentIndex == null ? "text-lg" : "text-sm"
                            }`}
                            onClick={() => handleMenusEvent(menu.id,0)}
                        ></a> 
                        :
                        <a
                            title="Delete"
                            className={`fa fa-check-circle text-white ${
                                parentIndex == null ? "text-lg" : "text-sm"
                            }`}
                            onClick={() => handleMenusEvent(menu.id,1)}
                        ></a> }
                      
                       
                    </div>
                   
                </div>
                <em className="ml-3 text-md">
                    <small>
                        <i className="fa fa-users" /> {menu.privileges && menu.privileges.join(', ')}
                    </small>
                </em>
                {menu.children && menu.children.length > 0 && (
                    <div className="border-t-2 border-white">
                        <div className="space-y-1 px-5 py-5">
                            {renderMenuItems(menu.children, isActive, index)}
                        </div>
                    </div>
                )}
               
            </div>
        ));
    };

    const handleAutoScroll = (e) => {
        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        const scrollThreshold = 50; // Adjust this value to control the sensitivity of the scroll
        const scrollSpeed = 20; // Adjust this value to control the speed of the scroll
        if (e.clientY < rect.top + scrollThreshold) {
            // Scroll up
            container.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
        } else if (e.clientY > rect.bottom - scrollThreshold) {
            // Scroll down
            container.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
        }
    };

    return (
        <div ref={scrollContainerRef} onWheel={handleWheel}>
            <Head title="Menu Management" />
            <AppContent>
                <ContentPanel>
                    <div className="font-nunito-sans mb-5 text-red-400">
                        *Welcome to the Menu Management page! To rearrange the
                        items, click and hold an item, then drag it to the
                        desired position and release.
                    </div>
                    {/* MENU ORDER ACTIVE */}
                    <div className="font-nunito-sans ">
                        <div className="bg-mobile-gradient p-3 rounded-tl-lg rounded-tr-lg">
                            <p className="text-white font-extrabold text-center">
                                Menu Order (Active)
                            </p>
                        </div>
                        <div className="px-3 py-3">
                            <div className="draggable-menu draggable-menu-active list-disc space-y-2">
                                {renderMenuItems(menuActive, true)}
                            </div>
                            {menuActive.length === 0 && (
                                <div
                                    align="center"
                                    id="inactive_text"
                                    className="text-gray-400 border-dashed border-gray-400 border p-10 font-nunito-sans flex justify-center items-center gap-3"
                                >
                                    <i className="fa solid fa-inbox text-xl"></i>
                                    <span className="font-bold ">
                                        Active Menu is Empty, Please Add New
                                        Menu
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* MENU ORDER INACTIVE */}
                    <div className="mt-10">
                        <div className="bg-mobile-gradient  p-3">
                            <p className="text-white font-extrabold text-center">
                                Menu Order (Inactive)
                            </p>
                        </div>
                        <div className="p-5">
                            <div className="draggable-menu draggable-menu-inactive">
                                {renderMenuItems(menuInactive, false)}
                            </div>
                            {menuInactive.length === 0 && (
                                <div
                                    align="center"
                                    id="inactive_text"
                                    className="text-gray-400 border-dashed border-gray-400 border p-10 font-nunito-sans flex justify-center items-center gap-3"
                                >
                                    <i className="fa solid fa-inbox text-xl"></i>
                                    <span className="font-bold ">
                                        Inactive Menu is Empty
                                    </span>
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
