import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import { useContext } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import RowData from "../../Components/Table/RowData";
import { useEffect } from "react";
import RowAction from "../../Components/Table/RowAction";
import Modal from "../../Components/Modal/Modal";
import Checkbox from "../../Components/Checkbox/Checkbox";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import TopPanel from "../../Components/Table/TopPanel";
import DissapearingToast from "../../Components/Toast/DissapearingToast";
import axios from "axios";
import LoadingIcon from "../../Components/Table/Icons/LoadingIcon";

const EnrollReturnDevices = ({ order, orderLines }) => {
    const { setTitle } = useContext(NavbarContext);
    const [showModal, setShowModal] = useState(false);
    const [orderPath, setOrderPath] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enroll/Return Devices");
        }, 5);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCheckboxChange = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allItemIds = orderLines?.map((item) => item.id);
            setSelectedItems(allItemIds);
        }
        setSelectAll(!selectAll);
    };

    const resetCheckbox = () => {
        setSelectedItems([]);
        setSelectAll(false);
    };

    const handleActionSelected = (action) => {
        const actionType = action;

        if (selectedItems?.length === 0) {
            setMessage("Nothing selected!");
            setMessageType("Error");
            setTimeout(() => setMessage(""), 3000);
        } else {
            Swal.fire({
                title: `<p class="font-nunito-sans" >Set to ${
                    actionType == "enroll" ? "Enroll Device" : "Return Device"
                }?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        if (actionType === "enroll") {
                            const response = await axios.post(
                                "/list_of_orders/bulk-enroll",
                                {
                                    ids: selectedItems,
                                }
                            );

                            if (response.data.status == "success") {
                                setMessage(response.data.message);
                                setMessageType(response.data.status);
                                setTimeout(() => setMessage(""), 3000);
                                resetCheckbox();

                                router.reload({ only: ["orderLines"] });
                            }
                        } else {
                            setMessage("Return Devices is not yet supported");
                            setMessageType("Error");
                            setTimeout(() => setMessage(""), 3000);
                            resetCheckbox();
                        }
                    } catch (error) {}
                }
            });
        }
    };

    const bulkActions = [
        {
            label: (
                <span className="flex items-center w-[140px] ">
                    <i className="fa-solid fa-circle-plus mr-2 text-green-600"></i>{" "}
                    Enroll Device
                </span>
            ),
            value: "enroll",
        },
        {
            label: (
                <span className="flex items-center w-[140px]">
                    <i className="fa-solid  fa-rotate-left mr-2 text-red-600"></i>{" "}
                    Return Device
                </span>
            ),
            value: "return",
        },
    ];

    const EnrollReturnDeviceActions = ({
        setMessage,
        setMessageType,
        setShowModal,
    }) => {
        const [processing, setProcessing] = useState(false);

        const handleSwal = (e) => {
            e.preventDefault();
            Swal.fire({
                title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to enroll this Device?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    EnrollDevice();
                }
            });
        };

        const EnrollDevice = async () => {
            setProcessing(true);

            try {
                const response = await axios.post(`/list_of_orders/enroll`, {
                    id: orderId,
                });

                if (response.data.status == "success") {
                    setShowModal(false);
                    setProcessing(false);

                    setMessage(response.data.message);
                    setMessageType(response.data.status);
                    setTimeout(() => setMessage(""), 3000);

                    router.reload({ only: ["orderLines"] });
                } else {
                    setShowModal(false);
                    setProcessing(false);

                    setMessage("Something went wrong!");
                    setMessageType("Error");
                    setTimeout(() => setMessage(""), 3000);
                }
            } catch (error) {
                console.log(error);
            }
        };

        return (
            <div className="flex flex-col items-center gap-y-3 py-2 text-white font-nunito-sans font-bold">
                {processing ? (
                    <LoadingIcon classes={"my-10"} />
                ) : (
                    <>
                        {enrollmentStatus != 3 && (
                            <button
                                className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70 cursor-pointer"
                                onClick={handleSwal}
                            >
                                Enroll Device
                            </button>
                        )}

                        <button className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer">
                            Return Device
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Enroll/Return Devices" />
            <AppContent>
                <DissapearingToast type={messageType} message={message} />
                <ContentPanel>
                    <div className="flex justify-between items-start text-gray-800 mb-8">
                        <div className="flex gap-10">
                            <div className="font-bold">
                                <p>Customer:</p>
                                <p>Sales Order #:</p>
                                <p>Order Ref #:</p>
                                <p>Order Date:</p>
                            </div>
                            <div className="font-medium">
                                <p>{order.customer_name}</p>
                                <p>{order.sales_order_no}</p>
                                <p>{order.order_ref_no}</p>
                                <p>{order.order_date}</p>
                            </div>
                        </div>

                        <Link href="/list_of_orders" as="button">
                            <span className="bg-primary text-white rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80">
                                Back
                            </span>
                        </Link>
                    </div>

                    <TopPanel>
                        <BulkActions
                            actions={bulkActions}
                            onActionSelected={handleActionSelected}
                        />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    width="sm"
                                    sortable={false}
                                    justify="center"
                                >
                                    <Checkbox
                                        type="checkbox"
                                        name="selectAll"
                                        id="selectAll"
                                        handleClick={handleSelectAll}
                                        isChecked={selectAll}
                                    />
                                </TableHeader>
                                <TableHeader>Item Code</TableHeader>
                                <TableHeader>Item Description</TableHeader>
                                <TableHeader>Serial Number</TableHeader>
                                <TableHeader>Enrollment Status</TableHeader>
                                <TableHeader sortable={false} justify="center">
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>
                        <tbody>
                            {orderLines?.map((order, index) => (
                                <Row key={order.id + index}>
                                    <RowData center>
                                        <Checkbox
                                            type="checkbox"
                                            id={order.id}
                                            handleClick={() =>
                                                handleCheckboxChange(order.id)
                                            }
                                            isChecked={selectedItems.includes(
                                                order.id
                                            )}
                                        />
                                    </RowData>
                                    <RowData>{order.digits_code}</RowData>
                                    <RowData>{order.item_description}</RowData>
                                    <RowData>{order.serial_number}</RowData>
                                    <RowData>
                                        {order.status.enrollment_status}
                                    </RowData>
                                    <RowData center>
                                        <RowAction
                                            action="add"
                                            type="button"
                                            onClick={() => {
                                                handleOpenModal();
                                                setOrderId(order.id);
                                                setEnrollmentStatus(
                                                    order.enrollment_status_id
                                                );
                                            }}
                                        />
                                    </RowData>
                                </Row>
                            ))}
                        </tbody>
                    </TableContainer>
                </ContentPanel>
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    title="Actions"
                >
                    <EnrollReturnDeviceActions
                        setMessage={setMessage}
                        setMessageType={setMessageType}
                        setShowModal={setShowModal}
                    />
                </Modal>
            </AppContent>
        </>
    );
};

export default EnrollReturnDevices;
