import { Head, Link, router, usePage } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import RowStatus from "../../Components/Table/RowStatus";
import RowAction from "../../Components/Table/RowAction";
import Row from "../../Components/Table/Row";
import Export from "../../Components/Table/Buttons/Export";
import Filters from "../../Components/Table/Buttons/Filters";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import RowActions from "../../Components/Table/RowActions";
import InputComponent from "../../Components/Forms/Input";
import Select from "../../Components/Forms/Select";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import OverrideOrderForm from "./OverrideOrderForm";

const ListOfOrders = ({ orders, queryParams, enrollmentStatuses }) => {
    queryParams = queryParams || {};
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [showEditActionModal, setShowEditActionModal] = useState(false);
    const [orderPath, setOrderPath] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const { handleToast } = useToast();
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    const [updateFormValues, setUpdateFormValues] = useState({
        sales_order_no: "",
        customer_name: "",
        order_ref_no: "",
        order_date: "",
    });

    const handleOverrideModal = () => {
        setShowOverrideModal(!showOverrideModal);
    };

    const handleCloseEditModal = () => {
        setShowEditActionModal(false);
    };

    const handleOpenEditModal = () => {
        setShowEditActionModal(true);
    };

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const ListofOrdersEditActions = () => {
        return (
            <div className="flex flex-col gap-y-3 text-white font-nunito-sans font-bold">
                {auth.access.isCreate ? (
                    <Link
                        className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                        href={orderPath + `/${orderId}/edit`}
                    >
                        Enroll/Return Devices
                    </Link>
                ) : (
                    ""
                )}
                {auth.access.isVoid ? (
                    <button
                        className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                        onClick={() => {
                            handleOverrideModal();
                            handleCloseEditModal();
                        }}
                    >
                        Override Order
                    </button>
                ) : (
                    ""
                )}
                {auth.access.isOverride ? (
                    <Link
                        className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                        href="#"
                    >
                        Void Order
                    </Link>
                ) : (
                    ""
                )}
            </div>
        );
    };

    const [filters, setFilters] = useState({
        sales_order_no: '',
        customer_name: '',
        order_ref_no: '',
        dep_order: '',
        enrollment_status: '',
        order_date: '',
    });

    const handleFilter = (e) => {
        const { name, value } = e.target;
        setFilters(filters => ({
        ...filters,
        [name]: value,
        }));

    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams(filters).toString();
        router.get(`/list_of_orders?${queryString}`);
    };


    return (
        <>
            <Head title="List of Orders" />
            <AppContent>
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Filters onSubmit={handleFilterSubmit}>
                            <InputComponent
                                name="sales_order_no"
                                value={filters.sales_order_no}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="customer_name"
                                value={filters.customer_name}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="order_ref_no"
                                value={filters.order_ref_no}
                                onChange={handleFilter}
                            />
                            <Select
                                name="dep_order"
                                options={[
                                    { name: "Yes", id: 1 },
                                    { name: "No", id: 0 },
                                ]}
                                onChange={handleFilter}
                            />
                            <Select
                                name="enrollment_status"
                                options={enrollmentStatuses}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                type="date"
                                name="order_date"
                                value={filters.order_date}
                                onChange={handleFilter}
                            />
                        </Filters>
                        <Export
                            path={`/list-of-orders-export${window.location.search}`}
                            handleToast={handleToast}
                        />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="sales_order_no"
                                    queryParams={queryParams}
                                    width="md"
                                    sticky="left"
                                    justify="center"
                                >
                                    Sales Order #
                                </TableHeader>

                                <TableHeader
                                    name="customer_name"
                                    queryParams={queryParams}
                                    width="md"
                                >
                                    Customer Name
                                </TableHeader>

                                <TableHeader
                                    name="order_ref_no"
                                    queryParams={queryParams}
                                    width="md"
                                >
                                    Order Ref #
                                </TableHeader>

                                <TableHeader
                                    name="dep_order"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    DEP Order
                                </TableHeader>

                                <TableHeader
                                    name="enrollment_status"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Enrollment Status
                                </TableHeader>

                                <TableHeader
                                    name="order_date"
                                    queryParams={queryParams}
                                >
                                    Order Date
                                </TableHeader>

                                <TableHeader
                                    sortable={false}
                                    width="auto"
                                    sticky="right"
                                >
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>

                        <Tbody data={orders.data}>
                            {orders &&
                                orders.data.map((item, index) => (
                                    <Row key={item.sales_order_no + index}>
                                        <RowData
                                            isLoading={loading}
                                            center
                                            sticky="left"
                                        >
                                            {item.sales_order_no}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.customer_name}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.order_ref_no}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.dep_order ? "Yes" : "No"}
                                        </RowData>

                                        <RowStatus
                                            isLoading={loading}
                                            color={item?.status?.color}
                                            center
                                        >
                                            {item?.status?.enrollment_status}
                                        </RowStatus>

                                        <RowData isLoading={loading}>
                                            {item.order_date}
                                        </RowData>

                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            center
                                        >
                                            <RowActions>
                                                <RowAction
                                                    href={
                                                        orders.path +
                                                        `/${item.id}`
                                                    }
                                                    action="view"
                                                    size="md"
                                                />

                                                <RowAction
                                                    type="button"
                                                    onClick={() => {
                                                        handleOpenEditModal();
                                                        setOrderPath(
                                                            orders.path
                                                        );
                                                        setOrderId(item.id);
                                                        setUpdateFormValues({
                                                            order_id: item.id,
                                                            sales_order_no:
                                                                item.sales_order_no,
                                                            customer_name:
                                                                item.customer_name,
                                                            order_ref_no:
                                                                item.order_ref_no,
                                                            order_date:
                                                                item.order_date,
                                                        });
                                                    }}
                                                    action="edit"
                                                    size="md"
                                                />
                                            </RowActions>
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>

                    <Pagination paginate={orders} />
                </ContentPanel>
                <Modal
                    show={showEditActionModal}
                    onClose={handleCloseEditModal}
                    title="Edit Actions"
                >
                    <ListofOrdersEditActions />
                </Modal>
                <Modal
                    show={showOverrideModal}
                    onClose={handleOverrideModal}
                    title="Override Order"
                >
                    <OverrideOrderForm
                        handleShow={() => {
                            handleOverrideModal();
                            handleToast("Order Override Successful", "success");
                        }}
                        updateFormValues={updateFormValues}
                        action="edit"
                    />
                </Modal>
            </AppContent>
        </>
    );
};

export default ListOfOrders;
