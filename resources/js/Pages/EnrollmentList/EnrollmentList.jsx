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
import ReactSelect from "../../Components/Forms/ReactSelect";
import { useNavbarContext } from "../../Context/NavbarContext";


const EnrollmentList = ({ enrollmentLists, queryParams, enrollmentStatuses, depStatuses, users }) => {
    queryParams = queryParams || {};
    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enrollment List");
        }, 5);
    }, []);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const [filters, setFilters] = useState({
        sales_order_no: '',
        item_code: '',
        serial_number: '',
        transaction_id: '',
        dep_status: '',
        status_message: '',
        enrollment_status: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
        returned_by: '',
        returned_date: '',
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
        router.get(`/enrollment_list?${queryString}`);
    };

    return (
        <>
            <Head title="Enrollment List" />
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
                                name="item_code"
                                value={filters.item_code}
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
                            <Select
                                name="dep_status"
                                options={depStatuses}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                name="status_message"
                                value={filters.status_message}
                                onChange={handleFilter}
                            />
                            <Select
                                name="enrollment_status"
                                options={enrollmentStatuses}
                                onChange={handleFilter}
                            />
                            <InputComponent
                                type="date"
                                name="created_at"
                                displayName="Created Date"
                                value={filters.created_at}
                                onChange={handleFilter}
                            />

                            <ReactSelect 
                                placeholder="Select User" 
                                name="created_by" 
                                options={users} 
                                value={users.find(user => user.value === filters.created_by)} 
                                onChange={(e) => handleFilter(e,'created_by')}  
                            />
                     
                            <InputComponent
                                type="date"
                                name="updated_at"
                                displayName="Updated Date"
                                value={filters.updated_at}
                                onChange={handleFilter}
                            />

                            <ReactSelect 
                                placeholder="Select User" 
                                name="updated_by" 
                                options={users} 
                                value={users.find(user => user.value === filters.updated_by)} 
                                onChange={(e) => handleFilter(e,'updated_by')}  
                            />

                            <InputComponent
                                type="date"
                                name="returned_date"
                                value={filters.returned_date}
                                onChange={handleFilter}
                            />

                            <ReactSelect 
                                placeholder="Select User"
                                name="returned_by"
                                options={users} 
                                value={users.find(user => user.value === filters.returned_by)} 
                                menuPlacement="top" 
                                onChange={(e) => handleFilter(e,'returned_by')} 
                            />
                   
                        </Filters>
                        <Export
                            path={`/enrollment-list-export${window.location.search}`}
                            handleToast={handleToast}
                        />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="dep_status"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    DEP Status
                                </TableHeader>
                                <TableHeader
                                    name="enrollment_status"
                                    queryParams={queryParams}
                                    width="lg"
                                    justify="center"
                                >
                                    Enrollment Status
                                </TableHeader>
                                <TableHeader
                                    name="sales_order_no"
                                    queryParams={queryParams}
                                >
                                    Sales Order #
                                </TableHeader>

                                <TableHeader
                                    name="item_code"
                                    queryParams={queryParams}
                                >
                                    Item Code
                                </TableHeader>

                                <TableHeader
                                    name="serial_number"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Serial Number
                                </TableHeader>

                                <TableHeader
                                    name="transaction_id"
                                    queryParams={queryParams}
                                    width="xl"
                                >
                                    Transaction ID
                                </TableHeader>

                                <TableHeader
                                    name="transaction_id"
                                    queryParams={queryParams}
                                    width="xl"
                                >
                                    DEP Company
                                </TableHeader>

                                <TableHeader
                                    name="status_message"
                                    queryParams={queryParams}
                                    justify="center"
                                    width="lg"
                                >
                                    Status Message
                                </TableHeader>

                

                                <TableHeader
                                    name="created_at"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Created Date
                                </TableHeader>
                                <TableHeader
                                    name="created_by"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Created By
                                </TableHeader>
                                <TableHeader
                                    name="updated_at"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Updated Date
                                </TableHeader>
                                <TableHeader
                                    name="updated_by"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Updated By
                                </TableHeader>
                                <TableHeader
                                    name="returned_date"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                   Returned Date
                                </TableHeader>
                                <TableHeader
                                    name="returned_by"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Returned By
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

                        <Tbody data={enrollmentLists.data}>
                            {enrollmentLists &&
                                enrollmentLists.data.map((item, index) => (
                                    <Row key={item.sales_order_no + index}>
                                        <RowStatus
                                            isLoading={loading}
                                            color={item?.d_status?.color}
                                            center
                                        >
                                            {item?.d_status?.dep_status}
                                        </RowStatus>

                                        <RowStatus
                                            isLoading={loading}
                                            color={item?.e_status?.color}
                                            center
                                        >
                                            {item?.e_status?.enrollment_status}
                                        </RowStatus>

                                        <RowData
                                            isLoading={loading}
                                        >
                                            {item.sales_order_no}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.item_code}
                                        </RowData>
                                        <RowData isLoading={loading} center>
                                            {item.serial_number}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.transaction_id}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item?.dep_company?.name}
                                        </RowData>
                                       
                                        <RowData isLoading={loading} center>
                                            {item.status_message}
                                        </RowData>
                                        

                                        <RowData isLoading={loading} >
                                            {item.created_at}
                                        </RowData>

                                        <RowData isLoading={loading} >
                                            {item?.created_by?.name}
                                        </RowData>

                                        <RowData isLoading={loading} >
                                            {item.updated_at}
                                        </RowData>

                                        <RowData isLoading={loading} >
                                            {item?.updated_by?.name}
                                        </RowData>

                                        <RowData isLoading={loading} >
                                            {item.returned_date}
                                        </RowData>

                                        <RowData isLoading={loading} >
                                            {item?.returned_by?.name}
                                        </RowData>

                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            center
                                        >
                                            <RowAction
                                                href={
                                                    enrollmentLists.path +
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

                    <Pagination paginate={enrollmentLists} />
                </ContentPanel>
        </>
    );
};

export default EnrollmentList;
