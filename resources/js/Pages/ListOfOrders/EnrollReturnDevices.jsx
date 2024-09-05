import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
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
import RowActions from "../../Components/Table/RowActions";
import Modal from "../../Components/Modal/Modal";
import Checkbox from "../../Components/Checkbox/Checkbox";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import TopPanel from "../../Components/Table/TopPanel";
import axios from "axios";
import LoadingIcon from "../../Components/Table/Icons/LoadingIcon";
import RowStatus from "../../Components/Table/RowStatus";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import ReactSelect from "../../Components/Forms/ReactSelect";
import DuplicateIcon from "../../Components/Table/Icons/DuplicateIcon";
import InputComponent from "../../Components/Forms/Input";

const EnrollmentStatus = Object.freeze({
    PENDING: 1,
    ENROLLMENT_ERROR: 2,
    ENROLLMENT_SUCCESS: 3,
    COMPLETED: 4,
    RETURNED: 5,
    RETURN_ERROR: 6,
    PARTIALLY_ENROLLED: 7,
    VOIDED: 8,
    CANCELLED: 9,
    VOID_ERROR: 10,
    OVERRIDE: 11,
    OVERRIDE_ERROR: 12,
});

const allowedToEnroll = [
    EnrollmentStatus.PENDING,
    EnrollmentStatus.ENROLLMENT_ERROR,
    EnrollmentStatus.RETURNED,
];

const allowedToReturn = [
    EnrollmentStatus.ENROLLMENT_SUCCESS,
    EnrollmentStatus.RETURN_ERROR,
    EnrollmentStatus.OVERRIDE,
];

const allowedToOverride = [
    EnrollmentStatus.ENROLLMENT_SUCCESS,
    EnrollmentStatus.ENROLLMENT_ERROR,
    EnrollmentStatus.OVERRIDE_ERROR,
];

const allowedToOverrideSerial = [
    EnrollmentStatus.ENROLLMENT_ERROR,
    EnrollmentStatus.OVERRIDE_ERROR,
];

const EnrollReturnDevices = ({
    order,
    orderLines,
    queryParams,
    depCompanies,
    duplicateSerials,
}) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState();
    const [enrollmentExist, setEnrollmentExist] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showOverride, setShowOverride] = useState(false);
    const [showOverrideSerial, setShowOverrideSerial] = useState(false);
    const [depCompanyId, setDepCompanyId] = useState(null);
    const [serial, setSerial] = useState(null);

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

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    };
    const handleShowOverride = () => {
        setShowOverride(!showOverride);
    };
    const handleShowOverrideSerial = () => {
        setShowOverrideSerial(!showOverrideSerial);
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
                reverseButtons: true,
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
                                .filter((item) =>
                                    allowedToEnroll.includes(
                                        item.enrollment_status_id
                                    )
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
                                    router.reload({ only: ["orderLines"] });
                                } else {
                                    handleToast(
                                        response.data.message,
                                        response.data.status
                                    );
                                    router.reload({ only: ["orderLines"] });
                                }
                            } else {
                                handleToast(
                                    "The selected items are either already enrolled or it cannot be enroll.",
                                    "Error"
                                );
                            }
                            // Return Device Logic
                        } else {
                            setLoading(true);

                            //it only get the selected pending status within selected checkbox
                            const filteredIds = orderLines
                                ?.filter((item) =>
                                    selectedItems.includes(item.id)
                                )
                                .filter((item) =>
                                    allowedToReturn.includes(
                                        item.enrollment_status_id
                                    )
                                )
                                .map((item) => item.id);

                            if (filteredIds.length != 0) {
                                const response = await axios.post(
                                    "/list_of_orders/bulk-return",
                                    {
                                        ids: filteredIds,
                                    }
                                );

                                if (response.data.status == "success") {
                                    handleToast(
                                        response.data.message,
                                        response.data.status
                                    );
                                    router.reload({ only: ["orderLines"] });
                                } else {
                                    handleToast(
                                        response.data.message,
                                        response.data.status
                                    );
                                    router.reload({ only: ["orderLines"] });
                                }
                            } else {
                                handleToast(
                                    "The selected items are either already returned or haven't been enrolled yet.",
                                    "Error"
                                );
                            }
                        }
                    } catch (error) {
                        handleToast(
                            "Something went wrong, please try again later.",
                            "Error"
                        );
                    } finally {
                        resetCheckbox();
                        setLoading(false);
                    }
                }
            });
        }
    };

    const EditForm = ({ handleShow, action }) => {
        const { handleToast } = useToast();
        const isEdit = action == "edit";
        const { data, setData, processing, reset, put, post, errors } = useForm(
            {
                dep_company_id: depCompanyId,
            }
        );

        const handleSubmit = (e) => {
            e.preventDefault();

            Swal.fire({
                title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to ${
                    action == "edit" ? "Edit" : "Override"
                } this Device?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                reverseButtons: true,
                iconColor: "#000000",
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    handleShow();

                    if (isEdit) {
                        put(`/list_of_orders/${orderId}/update-dep-company`, {
                            onSuccess: (data) => {
                                const { status, message } =
                                    data.props.auth.sessions;
                                handleToast(message, status);
                            },
                            onError: (data) => {
                                const { status, message } =
                                    data.props.auth.sessions;
                                handleToast(message, status);
                            },
                            onFinish: () => {
                                setLoading(false);
                                reset();
                            },
                        });
                    } else {
                        post(`/list_of_orders/${orderId}/override`, {
                            onSuccess: (data) => {
                                const { status, message } =
                                    data.props.auth.sessions;
                                handleToast(message, status);
                            },
                            onError: (data) => {
                                const { status, message } =
                                    data.props.auth.sessions;
                                handleToast(message, status);
                            },
                            onFinish: () => {
                                setLoading(false);
                                reset();
                            },
                        });
                    }
                }
            });
        };

        return (
            <>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <ReactSelect
                        placeholder="Select Dep Company"
                        name="dep_company_id"
                        displayName="Dep Company Name"
                        options={depCompanies}
                        value={depCompanies.find(
                            (depCompany) =>
                                depCompany.value == data.dep_company_id
                        )}
                        onChange={(e) => setData("dep_company_id", e.value)}
                    />

                    {errors.dep_company_id && (
                        <span className="mt-1 inline-block text-red-400 font-base">
                            <em>{errors.dep_company_id}</em>
                        </span>
                    )}

                    <button
                        type="submit"
                        className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                        disabled={processing}
                    >
                        {processing
                            ? "Updating..."
                            : isEdit
                            ? "Update"
                            : "Override"}
                    </button>
                </form>
            </>
        );
    };

    const EditFormSerial = ({ handleShow, action }) => {
        const { handleToast } = useToast();
        const { data, setData, processing, reset, put, post, errors } = useForm(
            {
                serial_number: "",
            }
        );

        const handleSubmit = (e) => {
            e.preventDefault();

            Swal.fire({
                title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to Overide this Device?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                reverseButtons: true,
                iconColor: "#000000",
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    handleShow();

                    post(`/list_of_orders/${orderId}/override_serial`, {
                        onSuccess: (data) => {
                            const { status, message } =
                                data.props.auth.sessions;
                            handleToast(message, status);
                        },
                        onError: (data) => {
                            const { status, message } =
                                data.props.auth.sessions;
                            handleToast(message, status);
                        },
                        onFinish: () => {
                            setLoading(false);
                            reset();
                        },
                    });
                }
            });
        };

        return (
            <>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <p className="font-bold text-gray-700 font-nunito-sans">
                        Current Serial:
                        <span className="font-bold text-black"> {serial}</span>
                    </p>
                    <InputComponent
                        name="New Serial Number"
                        value={data.serial_number}
                        onChange={(e) =>
                            setData(
                                "serial_number",
                                e.target.value.toUpperCase()
                            )
                        }
                    />
                    <p className="text-red-500 text-sm">
                        Note: When you use this button, it will override the
                        current serial and resubmit the new serial number to
                        Apple.
                    </p>

                    <button
                        type="submit"
                        className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                        disabled={processing}
                    >
                        {processing ? "Updating..." : "Override"}
                    </button>
                </form>
            </>
        );
    };

    const EnrollReturnDeviceActions = () => {
        const handleSwal = (e, action) => {
            e.preventDefault();
            Swal.fire({
                title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to ${
                    action == "enroll" ? "Enroll" : "Return"
                } this Device?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                reverseButtons: true,
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    EnrollReturnDevice(action);
                }
            });
        };

        const EnrollReturnDevice = async (action) => {
            setShowModal(false);
            setLoading(true);

            try {
                let response;
                if (action == "enroll") {
                    response = await axios.post(`/list_of_orders/enroll`, {
                        id: orderId,
                    });
                } else {
                    response = await axios.post(`/list_of_orders/return`, {
                        id: orderId,
                    });
                }

                if (response.data.status == "success") {
                    handleToast(response.data.message, response.data.status);

                    router.reload({ only: ["orderLines"] });
                } else {
                    router.reload({ only: ["orderLines"] });
                    handleToast(response.data.message, "Error");
                }
            } catch (error) {
                handleToast(
                    "Something went wrong, please try again later.",
                    "Error"
                );
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="flex flex-col items-center gap-y-3 py-2 text-white font-nunito-sans font-bold">
                <>
                    {allowedToEnroll.includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70 cursor-pointer"
                            onClick={(e) => handleSwal(e, "enroll")}
                        >
                            Enroll Device
                        </button>
                    )}

                    {allowedToReturn.includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            onClick={(e) => handleSwal(e, "return")}
                        >
                            Return Device
                        </button>
                    )}

                    {allowedToOverride.includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            onClick={() => {
                                handleCloseModal();
                                handleShowOverride();
                            }}
                        >
                            Override Order
                        </button>
                    )}
                    {/* {allowedToOverrideSerial.includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            onClick={() => {
                                handleCloseModal();
                                handleShowOverrideSerial();
                            }}
                        >
                            Override Serial
                        </button>
                    )} */}
                </>
            </div>
        );
    };

    return (
        <>
            <Head title="Enroll/Return Devices" />
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
                            <p>{order?.customer?.customer_name}</p>
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
                                name="enrollment_status_id"
                                queryParams={queryParams}
                                justify="center"
                                width="lg"
                            >
                                Enrollment Status
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
                                width="lg"
                            >
                                Item Description
                            </TableHeader>
                            <TableHeader
                                name="serial_number"
                                queryParams={queryParams}
                            >
                                Serial Number
                            </TableHeader>

                            {duplicateSerials.length != 0 && (
                                <TableHeader width="small" sortable={false}>
                                    &nbsp;
                                </TableHeader>
                            )}

                            <TableHeader
                                name="dep_company_id"
                                width="lg"
                                queryParams={queryParams}
                            >
                                DEP Company
                            </TableHeader>

                            <TableHeader
                                sortable={false}
                                justify="center"
                                sticky="right"
                                width="sm"
                            >
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
                                <RowStatus
                                    isLoading={loading}
                                    color={order?.status?.color}
                                    center
                                >
                                    {order?.status?.enrollment_status}
                                </RowStatus>
                                <RowData>{order.digits_code}</RowData>
                                <RowData>{order.item_description}</RowData>
                                <RowData>{order.serial_number}</RowData>

                                {duplicateSerials.length != 0 && (
                                    <RowData>
                                        {duplicateSerials.includes(
                                            order.serial_number
                                        ) && <DuplicateIcon />}
                                    </RowData>
                                )}

                                <RowData>
                                    {order?.dep_companies?.dep_company_name}
                                </RowData>
                                
                                <RowData center sticky="right">
                                    <RowActions>
                                        {![
                                            EnrollmentStatus["VOIDED"],
                                            EnrollmentStatus["CANCELLED"],
                                        ].includes(order?.status?.id) && (
                                            <RowAction
                                                disabled={ order?.status
                                                    ?.enrollment_status == "In Progress"}
                                                action="add"
                                                type="button"
                                                onClick={() => {
                                                    handleOpenModal();
                                                    setOrderId(order.id);
                                                    setDepCompanyId(
                                                        order.dep_company_id
                                                    );
                                                    setEnrollmentStatus(
                                                        order.enrollment_status_id
                                                    );
                                                    setSerial(
                                                        order.serial_number
                                                    );
                                                }}
                                                tooltipContent={`
                                                        ${
                                                            allowedToEnroll.includes(
                                                                order.enrollment_status_id
                                                            )
                                                                ? "<p>Enroll Device</p>"
                                                                : ""
                                                        }
                                                        ${
                                                            allowedToReturn.includes(
                                                                order.enrollment_status_id
                                                            )
                                                                ? "<p>Return Device</p>"
                                                                : ""
                                                        }
                                                        ${
                                                            allowedToOverride.includes(
                                                                order.enrollment_status_id
                                                            )
                                                                ? "<p></p>Override Device</p>"
                                                                : ""
                                                        }
                                                    `}
                                            />
                                        )}

                                        <RowAction
                                            action="edit"
                                            type="button"
                                            onClick={() => {
                                                handleShowEdit();
                                                setOrderId(order.id);
                                                setDepCompanyId(
                                                    order.dep_company_id
                                                );
                                            }}
                                            disabled={
                                                ![
                                                    "Pending",
                                                    "Returned",
                                                ].includes(
                                                    order?.status
                                                        ?.enrollment_status
                                                )
                                            }
                                            tooltipContent="Edit"
                                        />
                                    </RowActions>
                                </RowData>
                            </Row>
                        ))}
                    </Tbody>
                </TableContainer>
            </ContentPanel>

            <Modal show={showModal} onClose={handleCloseModal} title="Actions">
                <EnrollReturnDeviceActions />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Dep Company"
            >
                <EditForm handleShow={handleShowEdit} action="edit" />
            </Modal>

            <Modal
                show={showOverride}
                onClose={handleShowOverride}
                title="Override Order"
            >
                <EditForm handleShow={handleShowOverride} action="override" />
            </Modal>
            <Modal
                show={showOverrideSerial}
                onClose={handleShowOverrideSerial}
                title="Override Serial"
            >
                <EditFormSerial
                    handleShow={handleShowOverrideSerial}
                    action="override"
                />
            </Modal>
        </>
    );
};

export default EnrollReturnDevices;
