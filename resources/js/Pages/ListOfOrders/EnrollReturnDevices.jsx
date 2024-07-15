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
import axios from "axios";
import LoadingIcon from "../../Components/Table/Icons/LoadingIcon";
import RowStatus from "../../Components/Table/RowStatus";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";

const EnrollReturnDevices = ({ order, orderLines, queryParams }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [processing, setProcessing] = useState(false);

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

    const handleActionSelected = (action) => {
        const actionType = action;

        if (selectedItems?.length === 0) {
            handleToast("Nothing selected!", "Error");
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
                        if (actionType == "enroll") {
                            setLoading(true);

                            //it only get the selected pending status within selected checkbox
                            const filteredIds = orderLines
                                ?.filter((item) =>
                                    selectedItems.includes(item.id)
                                )
                                .filter(
                                    (item) => item.enrollment_status_id == 1
                                )
                                .map((item) => item.id);

                            if (filteredIds.length != 0) {
                                const response = await axios.post(
                                    "/list_of_orders/bulk-enroll",
                                    {
                                        ids: filteredIds,
                                    }
                                );

                                if (response.data.status == "success") {
                                    handleToast(
                                        response.data.message,
                                        response.data.status
                                    );
                                    resetCheckbox();
                                    router.reload({ only: ["orderLines"] });
                                } else {
                                    handleToast(
                                        "Something went wrong!",
                                        "Error"
                                    );
                                    resetCheckbox();
                                }
                            } else {
                                handleToast(
                                    "The selected items are already enrolled!",
                                    "Error"
                                );
                            }
                        } else {
                            handleToast(
                                "Return Device is not yet supported.",
                                "Error"
                            );
                        }
                    } catch (error) {
                        handleToast(
                            "Something went wrong, please try again later.",
                            "Error"
                        );
                    } finally {
                        setLoading(false);
                    }
                }
            });
        }
    };

    const EnrollReturnDeviceActions = () => {
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

                    handleToast(response.data.message, response.data.status);

                    router.reload({ only: ["orderLines"] });
                } else {
                    setShowModal(false);
                    setProcessing(false);

                    handleToast("Something went wrong!", "Error");
                }
            } catch (error) {
                setProcessing(false);
                setShowModal(false);
                handleToast(
                    "Something went wrong, please try again later.",
                    "Error"
                );
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

                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            disabled={enrollmentStatus == 1}
                        >
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
                <Modal show={loading} modalLoading />
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
                                <TableHeader
                                    name="digits_code"
                                    queryParams={queryParams}
                                >
                                    Item Code
                                </TableHeader>
                                <TableHeader
                                    name="item_description"
                                    queryParams={queryParams}
                                >
                                    Item Description
                                </TableHeader>
                                <TableHeader
                                    name="serial_number"
                                    queryParams={queryParams}
                                >
                                    Serial Number
                                </TableHeader>
                                <TableHeader
                                    name="enrollment_status_id"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Enrollment Status
                                </TableHeader>
                                <TableHeader sortable={false} justify="center">
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>

                        <Tbody data={orderLines}>
                            {orderLines?.map((order, index) => (
                                <Row key={order.serial_number}>
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

                                    <RowStatus
                                        isLoading={loading}
                                        color={order?.status?.color}
                                        center
                                    >
                                        {order?.status?.enrollment_status}
                                    </RowStatus>
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
                        </Tbody>
                    </TableContainer>
                </ContentPanel>
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    title="Actions"
                >
                    <EnrollReturnDeviceActions />
                </Modal>
            </AppContent>
        </>
    );
};

export default EnrollReturnDevices;
