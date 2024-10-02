import { Head, Link, router, usePage } from "@inertiajs/react";
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
import { useNavbarContext } from "../../Context/NavbarContext";
import axios from "axios";
import ReactSelect from "../../Components/Forms/ReactSelect";
import Button from "../../Components/Table/Buttons/Button";
import SelectMulti from 'react-select';
import TableButton from "../../Components/Table/Buttons/TableButton";
import TransactionJsonTabs from "../../Components/Table/TransactionJsonTabs";
import OverrideHeaderLevel from "./OverrideHeaderLevel";
import CreateOrder from "./CreateOrder";

const ListOfOrders = ({ orders, queryParams, enrollmentStatuses, customers, order_number }) => {
    queryParams = queryParams || {};
    const { auth } = usePage().props;
    const accessPrivileges =
        auth.access.isCreate || auth.access.isVoid ;
    const [loading, setLoading] = useState(false);
    const [showEditActionModal, setShowEditActionModal] = useState(false);
    const [showAddOrderModal, setShowAddOrderModal] = useState(false);
    const [orderPath, setOrderPath] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const { handleToast } = useToast();
    const { setTitle } = useNavbarContext();
    const [isVoidable, setIsVoidable] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [showSodModal, setShowSodModal] = useState(false);
    const [JsonRequest, setJsonRequest] = useState(null);
    const [JsonResponse, setJsonResponse] = useState(null);
    const [orderNumber, setOrderNumber] = useState([]);
    const [showOverride, setShowOverride] = useState(false);

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
            reverseButtons: true,
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
                        {auth.access.isCreate && enrollmentStatus != 10 ? (
                            <Link
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                href={orderPath + `/${orderId}/enroll-return`}
                            >
                                Enroll/Return Devices
                            </Link>
                        ) : (
                            ""
                        )}
                   
                        {[1].includes(enrollmentStatus) && (
                            <button
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                onClick={() => {
                                    handleCancel();
                                }}
                            >
                                Cancel Order
                            </button>
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
                           {[3,2,7,11,13].includes(enrollmentStatus) && (
                            <button
                                className="bg-primary flex-1 p-5 rounded-lg text-center hover:opacity-70"
                                onClick={() => {
                                    handleCloseEditModal();
                                    handleShowOverride();
                                }}
                            >
                                Override Order
                            </button>
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


    //SOD
    const handleSodModal = () => {
        setShowSodModal(!showSodModal);
    }
    const handleSodChange = (selected) => {
        setOrderNumber(selected);
    };

    const handleSodSubmit = async (event) => {
        event.preventDefault();  // Prevent the form from reloading the page
        setLoading(true);   // Set loading state
    
        // Prepare data to be sent
        const dataToSend = orderNumber.map(option => option.value);
    
        try {
          // Example API endpoint (replace with your actual endpoint)
          const response = await axios.post('/list_of_orders/sod', {
            orderNumber: dataToSend
          });

          setJsonRequest(response.data?.jsonrequest);
          setJsonResponse(response.data?.jsonresponse);

        } catch (error) {
            handleToast(error.response.data.errors, 'danger');
        } finally {
          setLoading(false);  // Reset loading state
        }
    }

    const colourStyles = {
        multiValue: (styles, { data }) => {
          const color = data.color;
          return {
            ...styles,
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: data.color,
          ':hover': {
            backgroundColor: data.color,
            color: 'white',
          },
          backgroundColor: 'black',
          color: 'white',
        }),
    };

    //OV
    const handleShowOverride = () => {
        setShowOverride(!showOverride);
    };

    // ADD ORDER
    const handleShowAddOrderModal = () => {
        setShowAddOrderModal(!showAddOrderModal);
    }

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
                    {auth.sessions.admin_is_superadmin == 1 && 
                        <Button onClick={() => {handleShowAddOrderModal();}}>Create Order</Button>
                    }
                    <Export
                        path={`/list-of-orders-export${window.location.search}`}
                        handleToast={handleToast}
                    />
                    <Button onClick={() => {handleSodModal(); }}>Show Order Details</Button>
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
                                width="lg"
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
                                name="order_date"
                                queryParams={queryParams}
                            >
                                Ship Date
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

                                    <RowData isLoading={loading}>
                                        {item.ship_date}
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
                                                tooltipContent="View"
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
                                                            setEnrollmentStatus(
                                                                item.enrollment_status
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
                                                        tooltipContent=
                                                        {`
                                                            <p>
                                                            Enroll/Return Devices 
                                                            </br> Void Order 
                                                            </br> Cancel Order 
                                                                
                                                            </p>
                                                        `
                                                        }
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
                title="Show Order Details"
                show={showSodModal}
                onClose={handleSodModal}
                width="4xl">
                    <form onSubmit={handleSodSubmit}>
                        <div className="w-full">
                        <label for="select-multiple" className="block text-sm font-medium text-gray-700"> Order Numbers</label>
                            <SelectMulti
                                isMulti
                                name="order_number"
                                className="block w-full py-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={orderNumber}
                                onChange={handleSodChange}
                                options={order_number}
                                styles={colourStyles}
                                
                            />
                        </div>
                        <div className="mb-3 flex justify-between float-right">
                        <TableButton type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</TableButton>
                        </div>
                    </form>
                 {JsonRequest && JsonResponse && (
                        <TransactionJsonTabs RequestData={JsonRequest?.data} ResponseData={JsonResponse?.data}/>
                 )}
            </Modal>

            {/* OV */}
            <Modal
                width="4xl"
                show={showOverride}
                onClose={handleShowOverride}
                title="Override Order"
            >
                <OverrideHeaderLevel  orderId={orderId} handleShow={handleShowOverride} action="override"/>   
            </Modal>
            <Modal
                width="4xl"
                show={showAddOrderModal}
                onClose={handleShowAddOrderModal}
                title="Create Order"
            >
                <CreateOrder customers={customers} onClose={handleShowAddOrderModal}/>
            </Modal>
        </>
    );
};

export default ListOfOrders;
