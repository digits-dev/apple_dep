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
import { useState } from "react";
import RowStatus from "../../Components/Table/RowStatus";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";

const PullErrors = ({ PullErrors, queryParams }) => {
    queryParams = queryParams || {};

    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const [filters, setFilters] = useState({
      order_number: '', 
      customer_name: '', 
      order_ref_no: '', 
      dr_number: '', 
      digits_code: '', 
      item_description: '', 
      brand: '', 
      wh_category: '', 
      confirm_date: '', 
      shipped_quantity: '', 
      serial1: '', 
      serial2: '', 
      serial3: '', 
      serial4: '', 
      serial5: '', 
      serial6: '', 
      serial7: '', 
      serial8: '', 
      serial9: '', 
      serial10: '', 
      errors_message: ''
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
                                name="order_number"
                                value={filters.order_number}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="item_code"
                                value={filters.customer_name}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="serial_number"
                                value={filters.serial_number}
                                onChange={handleFilter}
                            />
                             <InputComponent
                                name="transaction_id"
                                value={filters.transaction_id}
                                onChange={handleFilter}
                            />
    
                            <InputComponent
                                type="date"
                                name="created_date"
                                value={filters.created_date}
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
                                >
                                    Sales Order #
                                </TableHeader>

                                <TableHeader
                                    name="item_code"
                                    queryParams={queryParams}
                                >
                                    Customer Name
                                </TableHeader>

                                <TableHeader
                                    name="serial_number"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Line Number
                                </TableHeader>

                                <TableHeader
                                    name="transaction_id"
                                    queryParams={queryParams}
                                    width="xl"
                                >
                                    Order Ref Number
                                </TableHeader>

                                <TableHeader
                                    name="dep_status"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                   Dr
                                </TableHeader>

                                <TableHeader
                                    name="status_message"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Digits Code
                                </TableHeader>

                                <TableHeader
                                    name="digits_code"
                                    queryParams={queryParams}
                                    width="lg"
                                    justify="center"
                                >
                                    Item Description
                                </TableHeader>

                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Brand
                                </TableHeader>
                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Wh Category
                                </TableHeader>

                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Shipped Quantity
                                </TableHeader>

                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Confirm Date
                                </TableHeader>
                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Errors
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
                                    <Row key={item.order_number + index}>
                                        <RowData
                                            isLoading={loading}
                                            center
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
                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            center
                                        >
                                          <RowAction
                                              href={
                                                  PullErrors.path +
                                                  `/${item.id}`
                                              }
                                              action="view"
                                              size="md"
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
