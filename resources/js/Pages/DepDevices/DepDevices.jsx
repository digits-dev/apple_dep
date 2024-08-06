import { Head, router, usePage } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import Layout from "@/Layouts/layout/layout.jsx";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import Row from "../../Components/Table/Row";
import Export from "../../Components/Table/Buttons/Export";
import RowAction from "../../Components/Table/RowAction";
import RowActions from "../../Components/Table/RowActions";
import Filters from "../../Components/Table/Buttons/Filters";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import InputComponent from "../../Components/Forms/Input";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import axios from "axios";
import { useNavbarContext } from "../../Context/NavbarContext";
import RowStatus from "../../Components/Table/RowStatus";
import Select from "../../Components/Forms/Select";
import ReactSelect from "../../Components/Forms/ReactSelect";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import OverrideOrderForm from "./OverrideOrderForm";



const DepDevices = ({ devices, queryParams, enrollmentStatuses, options, depCompanies, customers }) => {
    const { auth } = usePage().props;
    queryParams = queryParams || {};
    const { handleToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderDeviceId, setDevOrderId] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const { setTitle } = useNavbarContext();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [depCompanyId, setDefaultDepCompanyId] = useState(null);
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    useEffect(() => {
        setTimeout(() => {
            setTitle("DEP Devices");
        }, 5);
    }, []);

    const [filters, setFilters] = useState({
        digits_code: "",
        item_description: "",
        serial_number: "",
        dep_company_id: "",
        enrollment_status_id: "",
        customer_id: "",
    });

    const [updateFormValues, setUpdateFormValues] = useState({
        sales_order_no: "",
        customer_id: "",
        order_ref_no: "",
        order_date: "",
    });

    const handleFilter = (e, attrName) => {
        if (attrName) {
            const { value } = e;

            setFilters(filters => ({
                ...filters,
                [attrName]: value,
            }));

        } else {
            const { name, value } = e.target;

            setFilters(filters => ({
                ...filters,
                [name]: value,
            }));
        }

    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams(filters).toString();
        router.get(`/dep_devices?${queryString}`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleClodeEditModal = () => {
        setShowEditModal(false);
    };

    const handleCloseOverrideModal = () => {
        setShowOverrideModal(false);
    };

    const handleOpenEditModal = (depCompanyId) => {
        setShowEditModal(true);
        setDefaultDepCompanyId(depCompanyId);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const EditDeviceAction = ({ id }) => {
        const [selectedOption, setSelectedOption] = useState(null);

        useEffect(() => {
            if (id) {
                const defaultOption = options.find(
                    (option) => option.id === id
                );
                setSelectedOption({
                    value: defaultOption.id,
                    label: defaultOption.dep_company_name,
                });
            }
        }, [id, options]);

        const handleSwal = (e) => {
            e.preventDefault();
            Swal.fire({
                title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to edit this Device?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    EditDevice();
                }
            });
        };

        const EditDevice = async () => {
            setShowEditModal(false);
            setProcessing(true);

            try {
                let response;
                response = await axios.post(`/dep_devices/update-device`, {
                    depCompanyId: selectedOption.value,
                    orderId: orderId,
                });

                if (response.data.status == "success") {
                    handleToast(response.data.message, response.data.status);

                    router.reload({ only: ["devices"] });
                } else {
                    router.reload({ only: ["devices"] });
                    handleToast(response.data.message, "Error");
                }
            } catch (error) {
                console.log(error);
                handleToast(
                    "Something went wrong, please try again later.",
                    "Error"
                );
            } finally {
                setProcessing(false);
                setShowEditModal(false);
            }
        };

        const handleSelectChange = (selectedOption) => {
            setSelectedOption(selectedOption);
        };

        return (
            <div className="gap-y-3 py-2 text-black font-nunito-sans font-bold">
                <ReactSelect
                    placeholder={loading ? "Loading..." : "Select an option"}
                    name="dep_company"
                    value={selectedOption}
                    options={options.map((opt) => ({
                        value: opt.id,
                        label: opt.dep_company_name,
                    }))}
                    onChange={handleSelectChange}
                />
                <button
                    className="bg-black w-full text-white font-nunito-sans py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                    onClick={(e) => handleSwal(e)}
                >
                    {processing ? "Updating..." : "Save Changes"}
                </button>
            </div>
        );
    };

    

    const EnrollReturnDeviceActions = () => {
        const handleSwal = (e, action) => {
            e.preventDefault();

            if (action === "override") {
                setShowOverrideModal(true);
            }
            else{
                Swal.fire({
                    title: `<p class="font-nunito-sans text-3xl" >Are you sure you want to ${action == "enroll" ? "Enroll" : "Return"
                        } this Device?</p>`,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    confirmButtonColor: "#000000",
                    reverseButtons: true,
                    icon: "question",
                    iconColor: "#000000",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        EnrollReturnDevice(action);
                    }
                });
            }
            
        };

        const EnrollReturnDevice = async (action, formData) => {
            setShowModal(false);
            setProcessing(true);

            try {
                let response;
                if (action == "enroll") {
                    response = await axios.post(`/dep_devices/enroll`, {
                        id: orderId,
                    });
                }
                else {
                    response = await axios.post(`/dep_devices/return`, {
                        id: orderId,
                    });
                }
                if (response.data.status == "success") {
                    handleToast(response.data.message, response.data.status);

                    router.reload({ only: ["devices"] });
                } else {
                    router.reload({ only: ["devices"] });
                    handleToast(response.data.message, "Error");
                }
            } catch (error) {
                handleToast(
                    "Something went wrong, please try again later.",
                    "Error"
                );
            } finally {
                setProcessing(false);
            }
        };

        return (
            <div className="flex flex-col items-center gap-y-3 py-2 text-white font-nunito-sans font-bold">
                <>
                    {![3, 6].includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70 cursor-pointer"
                            onClick={(e) => handleSwal(e, "enroll")}
                        >
                            Enroll Device
                        </button>
                    )}

                    {![1, 2, 5].includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            onClick={(e) => handleSwal(e, "return")}
                        >
                            Return Device
                        </button>
                    )}

                    {[3].includes(enrollmentStatus) && (
                        <button
                            className="w-full bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70  cursor-pointer"
                            onClick={(e) => handleSwal(e, "override")}
                        >
                            Override
                        </button>
                    )}
                </>
            </div>
        );
    };

    const handleOverrideSubmit = async (formData) => {
        setProcessing(true);
        try {
            const response = await axios.post(`/dep_devices/override`, formData);
            handleToast(response.data.message, response.data.status);
        } catch (error) {
            handleToast("Something went wrong, please try again later.", "Error");
        } finally {
            setProcessing(false);
        }

        setShowOverrideModal(false);
        setShowModal(false);
        setProcessing(false);
    };

    return (
        <>
            <Head title="DEP Devices" />
            <Modal show={processing} modalLoading />
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Filters onSubmit={handleFilterSubmit}>
                        <InputComponent
                            name="digits_code"
                            displayName="Item Code"
                            value={filters.digits_code}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="item_description"
                            value={filters.item_description}
                            onChange={handleFilter}
                        />
                        <InputComponent
                            name="serial_number"
                            value={filters.serial_number}
                            onChange={handleFilter}
                        />
                        <ReactSelect
                            placeholder="Select DEP Company"
                            name="dep_company_id"
                            displayName="Dep Company"
                            options={depCompanies}
                            value={depCompanies.find(depCompany => depCompany.value === filters.dep_company_id)}
                            onChange={(e) => handleFilter(e, 'dep_company_id')}
                        />
                        <Select
                            name="enrollment_status_id"
                            displayName="Enrollment Status"
                            options={enrollmentStatuses}
                            onChange={handleFilter}
                        />
                        <ReactSelect
                            placeholder="Select Customer Name"
                            menuPlacement="top"
                            name="customer_id"
                            displayName="Customer Name"
                            options={customers}
                            value={customers.find(customer => customer.value === filters.customer_id)}
                            onChange={(e) => handleFilter(e, 'customer_id')}
                        />


                    </Filters>
                    <Export
                        path={`/dep-devices-export${window.location.search}`}
                        handleToast={handleToast}
                    />
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
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
                                width="md"
                                justify="center"
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
                                width="lg"
                                justify="center"
                            >
                                Serial Number
                            </TableHeader>

                            <TableHeader
                                name="dep_company"
                                queryParams={queryParams}
                                width="lg"
                            >
                                DEP Company
                            </TableHeader>

                            <TableHeader
                                name="customer"
                                queryParams={queryParams}
                                width="lg"
                            >
                                Customer Name
                            </TableHeader>

                            {auth.access.isCreate && (
                                <TableHeader
                                    sortable={false}
                                    justify="center"
                                    sticky="right"
                                    width="sm"
                                >
                                    Action
                                </TableHeader>
                            )}
                        </Row>
                    </Thead>
                    <Tbody data={devices.data}>
                        {devices &&
                            devices.data.map((item, index) => (
                                <Row key={item.serial_number + index}>
                                    <RowStatus
                                        isLoading={loading}
                                        color={item.color}
                                        center
                                    >
                                        {item.enrollment_status}
                                    </RowStatus>
                                    <RowData isLoading={loading} center>
                                        {item.digits_code}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.item_description}
                                    </RowData>
                                    <RowData isLoading={loading} center>
                                        {item.serial_number}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item?.dep_company?.dep_company_name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item?.customer?.customer_name}
                                    </RowData>
                                    {auth.access.isCreate && (
                                        <RowData center sticky="right">
                                            {![8, 9, 10].includes(item.enrollment_status_id) && (
                                                <RowActions>
                                                    <RowAction
                                                        action="add"
                                                        type="button"
                                                        onClick={() => {
                                                            handleOpenModal();
                                                            setOrderId(item.id);
                                                            setEnrollmentStatus(
                                                                item.enrollment_status_id
                                                            );
                                                            setUpdateFormValues(
                                                                {
                                                                    id:
                                                                        item.id,
                                                                    order_id:
                                                                        item.order_id,
                                                                    customer_id:
                                                                        item.dep_company_id,
                                                                    po_number:
                                                                        item.order_ref_no,
                                                                    delivery_number:
                                                                        item.dr_number, 
                                                                    order_date:
                                                                        item.order_date,
                                                                    ship_date:
                                                                        item.order_date,
                                                                    order_number:
                                                                        item.sales_order_no,
                                                                    serial_number:
                                                                        item.serial_number,
                                                                }
                                                            );
                                                        }}
                                                        // tooltipContent={`${item.enrollment_status !== "Pending" ? "Return Device" : "Enroll Device"}`}
                                                    />
                                                    <RowAction
                                                        action="edit"
                                                        type="button"
                                                        onClick={() => {
                                                            handleOpenEditModal(item.dep_company_id);
                                                            setOrderId(item.id);
                                                            setDevOrderId(item.order_id);
                                                            setDefaultDepCompanyId(item.dep_company_id);
                                                        }}
                                                        disabled={!["Pending", "Returned"].includes(item.enrollment_status)}
                                                        tooltipContent="Edit"
                                                    />

                                                </RowActions>
                                            )}
                                        </RowData>
                                    )}


                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>

                <Pagination paginate={devices} />
            </ContentPanel>
            <Modal show={showModal} onClose={handleCloseModal} title="Actions">
                <EnrollReturnDeviceActions />
            </Modal>
            <Modal
                show={showEditModal}
                onClose={handleClodeEditModal}
                title="Edit"
            >
                <EditDeviceAction id={depCompanyId} />
            </Modal>
            <Modal
                show={showOverrideModal}
                onClose={handleCloseOverrideModal}
                title="Override Order"
            >
                <OverrideOrderForm
                    handleShow={handleCloseOverrideModal}
                    updateFormValues={updateFormValues}
                    onSubmit={handleOverrideSubmit}
                    options={options}
                />
            </Modal>
        </>
    );
};

export default DepDevices;
