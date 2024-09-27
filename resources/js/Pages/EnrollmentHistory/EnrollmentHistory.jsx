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


const EnrollmentHistory = ({ enrollmentHistory, queryParams, enrollmentStatuses, depStatuses, users, depCompanies }) => {
    queryParams = queryParams || {};
    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enrollment History");
        }, 5);
    }, []);

    console.log(enrollmentHistory);
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const [filters, setFilters] = useState({
        sales_order_no: '',
        item_code: '',
        serial_number: '',
        transaction_id: '',
        dep_company_id: '',
        dep_status: '',
        status_message: '',
        enrollment_status: '',
        created_at: '',
        created_by: '',
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
        router.get(`/enrollment_history?${queryString}`);
    };

    return (
        <>
            <Head title="Enrollment History" />
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

                            <ReactSelect 
                                placeholder="Select DEP Company" 
                                name="dep_company_id" 
                                displayName="Dep Company"
                                options={depCompanies} 
                                value={depCompanies.find(depCompany => depCompany.value === filters.dep_company_id)} 
                                onChange={(e) => handleFilter(e,'dep_company_id')}  
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
                                displayName="Date"
                                value={filters.created_at}
                                onChange={handleFilter}
                            />

                            <ReactSelect 
                                placeholder="Select User" 
                                name="created_by" 
                                displayName="User"
                                menuPlacement="top"
                                options={users} 
                                value={users.find(user => user.value === filters.created_by)} 
                                onChange={(e) => handleFilter(e,'created_by')}  
                            />
                     
                   
                        </Filters>
                        <Export
                            path={`/enrollment-history-export${window.location.search}`}
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
                                >
                                    Type
                                </TableHeader>

                                <TableHeader
                                    name="dep_companies"
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
                                    Date
                                </TableHeader>
                                <TableHeader
                                    name="created_by"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    User
                                </TableHeader>

                            </Row>
                        </Thead>

                        <Tbody data={enrollmentHistory.data}>
                            {enrollmentHistory &&
                                enrollmentHistory.data.map((item, index) => (
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
                                            {item.type}
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

                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>

                    <Pagination paginate={enrollmentHistory} />
                </ContentPanel>
        </>
    );
};

export default EnrollmentHistory;
