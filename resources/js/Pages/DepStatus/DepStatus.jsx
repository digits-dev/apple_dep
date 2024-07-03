import { Head,  router } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
import Layout from "@/Layouts/layout/layout.jsx";
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
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import Filters from "../../Components/Table/Buttons/Filters";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import RowActions from "../../Components/Table/RowActions";
import InputComponent from "../../Components/Forms/Input";
import Select from "../../Components/Forms/Select";
import { useState } from "react";

const DepStatus = ({ dep_statuses, queryParams }) => {
 
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);

    const [field1, setField1] = useState('');


    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    return (
        <>
        <Head title="DEP Status" />
        <AppContent>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Filters>
                            <InputComponent name={'field1'} placeholder="placeholder of field1" value={field1} onChange={setField1}/>
                            <InputComponent name={'field2'} placeholder="placeholder of field2"/>
                            <InputComponent name={'field3'} placeholder="placeholder of field3"/>
                            <Select name="first_name" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
                            <Select name="middle_name" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
                            <Select name="last" options={[{name:'opt1', id:1}, {name:'opt2', id:2}]} />
                    </Filters>
                    <Export  path="/dep-status-export"/>
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="id"
                                queryParams={queryParams}
                            >
                            DEP Status ID
                            </TableHeader>

                            <TableHeader
                                name="dep_status"
                                queryParams={queryParams}
                            >
                                DEP Status
                            </TableHeader>

                            <TableHeader
                                name="created_date"
                                queryParams={queryParams}
                            >
                                Record Creation Date
                            </TableHeader>

                
                            <TableHeader
                                sortable={false}
                                width="auto"
                                justify="center"
                            >
                                Action
                            </TableHeader>
                        </Row>
                    </Thead>

                    <tbody>
                        {dep_statuses &&
                            dep_statuses.data.map((item) => (
                                <Row key={item.sales_order_no + item.serial_number + item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.dep_status}</RowData>
                                    <RowData isLoading={loading} >{item.created_date}</RowData>
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            action="edit"
                                            size="md"
                                        />
                                    </RowData>
                            </Row>
                            ))}
                    </tbody>
                </TableContainer>

                <Pagination paginate={dep_statuses} />
            </ContentPanel>
        </AppContent>
        </>
    );
};

export default DepStatus;


