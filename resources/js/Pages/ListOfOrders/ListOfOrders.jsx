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
import { useNavbarContext } from "../../Context/NavbarContext";
import axios from "axios";
import ReactSelect from "../../Components/Forms/ReactSelect";

const ListOfOrders = ({ orders, queryParams, enrollmentStatuses, customers }) => {
    queryParams = queryParams || {};
    const { auth } = usePage().props;
    const accessPrivileges =
        auth.access.isCreate || auth.access.isVoid || auth.access.isOverride;
    const [loading, setLoading] = useState(false);
    const [showEditActionModal, setShowEditActionModal] = useState(false);
    const [orderPath, setOrderPath] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const { handleToast } = useToast();
    const { setTitle } = useNavbarContext();
    const [isVoidable, setIsVoidable] = useState(false);
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setTitle("List of Orders");
        }, 5);
    }, []);

    const [loadSpinner, setLoadSpinner] = useState(false);

    const [updateFormValues, setUpdateFormValues] = useState({
        sales_order_no: "",
        customer_id: "",
        order_ref_no: "",
        order_date: "",
    });

    const handleCancel = () => {
        Swal.fire({
            title: `<p class="font-nunito-sans text-3xl" >Cancel Order?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                handleCloseEditModal();
                setLoadSpinner(true);
                try {
                    const response = await axios.post(
                        `/list_of_orders/${orderId}/cancel`
                    );

                    if (response.data.status === "success") {
                        handleToast(response.data.message, "success");
                    } else {
                        handleToast(response.data.message, "error");
                    }

                    router.reload({ only: ["orders"] });
                } catch (error) {
                    handleToast(
                        "Something went wrong, please try again later.",
                        "Error"
                    );
                } finally {
                    setLoading(false);
                    setLoadSpinner(false);
                }
            }
        });
    };

    const handleOverrideModal = () => {
        setShowOverrideModal(!showOverrideModal);
    };

    const handleCloseEditModal = () => {
        setShowEditActionModal(false);
    };

    const handleOpenEditModal = () => {
        setShowEditActionModal(true);
    };

    const voidOrders = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure you want to void this order?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#000000",
            icon: "question",
            iconColor: "#000000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadSpinner(true);
                handleCloseEditModal();
                try {
                    const response = await axios.post(`/list_of_orders/void`, {
                        id: orderId,
                    });
                    console.log(response.data.message);
                    handleToast(response.data.message, response.data.status);
                    router.reload({ only: ["orders"] });
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoadSpinner(false);
                }
            }
        });
    };

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const ListofOrdersEditActions = () => {
        return (
            <div className="flex flex-col gap-y-3 text-white font-nunito-sans font-bold">
                {accessPrivileges ? (
                    <>
                        {auth.access.isCreate ? (
                            <Link
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                href={orderPath + `/${orderId}/enroll-return`}
                            >
                                Enroll/Return Devices
                            </Link>
                        ) : (
                            ""
                        )}
                        {auth.access.isOverride ? (
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
                        {!isVoidable ? (
                            <button
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                onClick={() => {
                                    handleCancel();
                                }}
                            >
                                Cancel Order
                            </button>
                        ) : (
                            ""
                        )}
                        {isVoidable ? (
                            <Link
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                href="#"
                                onClick={voidOrders}
                            >
                                Void Order
                            </Link>
                        ) : (
                            ""
                        )}
                    </>
                ) : (
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-red-500 mb-2">
                            <i className="fa fa-lock"></i> Access Denied
                        </h1>
                        <p class="text-lg text-gray-700 mb-3">
                            You don't have permission to access this area.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const [filters, setFilters] = useState({
        sales_order_no: "",
        customer_id: "",
        order_ref_no: "",
        dep_order: "",
        enrollment_status: "",
        order_date: "",
    });


    const handleFilter = (e, attrName) => {
        if(attrName) {
            const { value } = e;

            setFilters(filters => ({
                ...filters,
                [attrName]: value,
            }));
          
        }else{
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
        router.get(`/list_of_orders?${queryString}`);
    };

    console.log(orders);

    return (
        <>
            <Head title="List of Orders" />
            <Modal show={loadSpinner} modalLoading></Modal>
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
                        <ReactSelect 
                            placeholder="Select Customer Name" 
                            name="customer_id" 
                            displayName="Customer Name"
                            options={customers} 
                            value={customers.find(customer => customer.value === filters.customer_id)} 
                            onChange={(e) => handleFilter(e,'customer_id')}  
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
                                name="enrollment_status"
                                queryParams={queryParams}
                                justify="center"
                                width="lg"
                            >
                                Enrollment Status
                            </TableHeader>
                            <TableHeader
                                name="sales_order_no"
                                queryParams={queryParams}
                                width="md"
                            >
                                Sales Order #
                            </TableHeader>

                            <TableHeader
                                name="customer_id"
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
                                    <RowStatus
                                        isLoading={loading}
                                        color={item?.status?.color}
                                        center
                                    >
                                        {item?.status?.enrollment_status}
                                    </RowStatus>
                                    <RowData isLoading={loading}>
                                        {item.sales_order_no}
                                    </RowData>

                                    <RowData isLoading={loading}>
                                        {item?.customer?.customer_name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.order_ref_no}
                                    </RowData>
                                    <RowData isLoading={loading} center>
                                        {item.dep_order ? "Yes" : "No"}
                                    </RowData>

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
                                                    orders.path + `/${item.id}`
                                                }
                                                action="view"
                                                size="md"
                                            />

                                            {accessPrivileges &&
                                                ![8, 9].includes(
                                                    item.enrollment_status
                                                ) && (
                                                    <RowAction
                                                        type="button"
                                                        onClick={() => {
                                                            handleOpenEditModal();
                                                            setOrderPath(
                                                                orders.path
                                                            );
                                                            setOrderId(item.id);
                                                            setIsVoidable(
                                                                item.isVoidable
                                                            );
                                                            setUpdateFormValues(
                                                                {
                                                                    order_id:
                                                                        item.id,
                                                                    sales_order_no:
                                                                        item.sales_order_no,
                                                                    customer_id:
                                                                        item.customer_id,
                                                                    order_ref_no:
                                                                        item.order_ref_no,
                                                                    order_date:
                                                                        item.order_date,
                                                                }
                                                            );
                                                        }}
                                                        action="edit"
                                                        size="md"
                                                    />
                                                )}
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
        </>
    );
};

export default ListOfOrders;
