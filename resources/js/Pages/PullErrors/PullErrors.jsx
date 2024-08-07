import { Head, router } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import RowAction from "../../Components/Table/RowAction";
import Row from "../../Components/Table/Row";
import Export from "../../Components/Table/Buttons/Export";
import Filters from "../../Components/Table/Buttons/Filters";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import InputComponent from "../../Components/Forms/Input";
import Select from "../../Components/Forms/Select";
import { useEffect, useState } from "react";
import RowStatus from "../../Components/Table/RowStatus";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import { useNavbarContext } from "../../Context/NavbarContext";

const PullErrors = ({ PullErrors, queryParams }) => {
    queryParams = queryParams || {};

    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    
    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("ERP Pull Error");
        }, 5);
    }, []);

    const [filters, setFilters] = useState({
      order_number: '', 
      customer_name: '', 
      order_ref_no: '', 
      dr_number: '', 
      digits_code: '', 
      item_description: '', 
      confirm_date: '', 
      serial_number: '',
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
        router.get(`/erp_pull_erp?${queryString}`);
    };


    return (
        <>
            <Head title="Erp Pull Errors" />
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Filters onSubmit={handleFilterSubmit}>
                            <InputComponent
                                displayName="Sales Order #"
                                name="order_number"
                                value={filters.order_number}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="customer_name"
                                value={filters.customer_name}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                displayName="Order Ref Number"
                                name="order_ref_no"
                                value={filters.order_ref_no}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="dr_number"
                                value={filters.dr_number}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="digits_code"
                                value={filters.digits_code}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="item_description"
                                value={filters.item_description}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                type="date"
                                name="confirm_date"
                                value={filters.confirm_date}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="serial_number"
                                value={filters.serial_number}
                                onChange={handleFilter}
                            />
                        </Filters>
                        <Export
                            path={`/pull-errors${window.location.search}`}
                            handleToast={handleToast}
                        />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="order_number"
                                    queryParams={queryParams}
                                    justify="center"
                                    sticky="left"
                                >
                                    Sales Order #
                                </TableHeader>

                                <TableHeader
                                    name="customer_name"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Customer Name
                                </TableHeader>

                                <TableHeader
                                    name="line_number"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Line Number
                                </TableHeader>

                                <TableHeader
                                    name="order_ref_no"
                                    queryParams={queryParams}
                                    width="xl"
                                >
                                    Order Ref Number
                                </TableHeader>

                                <TableHeader
                                    name="dr_number"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                   DR Number
                                </TableHeader>

                                <TableHeader
                                    name="digits_code"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Digits Code
                                </TableHeader>

                                <TableHeader
                                    name="item_description"
                                    queryParams={queryParams}
                                    width="lg"
                                    justify="center"
                                >
                                    Item Description
                                </TableHeader>

                                <TableHeader
                                    name="brand"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Brand
                                </TableHeader>
                                <TableHeader
                                    name="wh_category"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Wh Category
                                </TableHeader>

                                <TableHeader
                                    name="shipped_quantity"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Shipped Quantity
                                </TableHeader>

                                <TableHeader
                                    name="confirm_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Confirm Date
                                </TableHeader>
                                <TableHeader
                                    name="errors_message"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Errors
                                </TableHeader>
                                <TableHeader
                                   name="created_at"
                                    width="lg"
                                >
                                    Pulled Date
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

                        <Tbody data={PullErrors.data}>
                            {PullErrors &&
                                PullErrors.data.map((item, index) => (
                                    <Row key={item.id}>
                                        <RowData
                                            isLoading={loading}
                                            center
                                            sticky="left"
                                    >
                                            {item.order_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.customer_name}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.line_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.order_ref_no}
                                        </RowData>                             
                                        <RowData isLoading={loading} center>
                                            {item.dr_number}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.digits_code}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.item_description}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.brand}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.wh_category}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.shipped_quantity}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.confirm_date}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.errors_message}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.created_at}
                                        </RowData>
                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            center
                                        >
                                          <RowAction
                                              href={
                                                  `/pull_errors/${item.id}`
                                              }
                                              action="view"
                                              size="md"
                                              tooltipContent="View"
                                          />
                                       </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>

                    <Pagination paginate={PullErrors} />
                </ContentPanel>
        </>
    );
};

export default PullErrors;
