import { Head, router } from "@inertiajs/react";
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

const DepDevices = ({ devices, queryParams, enrollmentStatuses }) => {
    queryParams = queryParams || {};
    const { handleToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const { setTitle } = useNavbarContext();
    const [showModal, setShowModal] = useState(false);

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
        customer_name: "",
        enrollment_status_id: "",
    });

    const handleFilter = (e) => {
        const { name, value } = e.target;
        setFilters((filters) => ({
            ...filters,
            [name]: value,
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams(filters).toString();
        router.get(`/dep_devices?${queryString}`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
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
                console.log(response);
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
                setLoading(false);
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
                </>
            </div>
        );
    };
    return (
        <>
            <Head title="DEP Devices" />
            <AppContent>
                <Modal show={loading} modalLoading />
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
                            <InputComponent
                                name="customer_name"
                                value={filters.customer_name}
                                onChange={handleFilter}
                            />
                            <Select
                                name="enrollment_status_id"
                                displayName="Enrollment Status"
                                options={enrollmentStatuses}
                                onChange={handleFilter}
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
                                    name="customer_name"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Customer Name
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
                        <Tbody data={devices.data}>
                            {devices &&
                                devices.data.map((item, index) => (
                                    <Row key={item.serial_number + index}>
                                        <RowData isLoading={loading} center>
                                            {item.digits_code}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.item_description}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.serial_number}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.customer_name}
                                        </RowData>
                                        <RowStatus
                                            isLoading={loading}
                                            color={item.color}
                                            center
                                        >
                                            {item.enrollment_status}
                                        </RowStatus>
                                        <RowData center>
                                            <RowAction
                                                action="add"
                                                type="button"
                                                onClick={() => {
                                                    handleOpenModal();
                                                    setOrderId(item.id);
                                                    setEnrollmentStatus(
                                                        item.enrollment_status_id
                                                    );
                                                }}
                                            />
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>

                    <Pagination paginate={devices} />
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

export default DepDevices;
