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

const Customer = ({ customers, queryParams }) => {
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);
    
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    
    return (
        <>
        <Head title="Customer" />
        <AppContent>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Export  path="/customers-export"/>
                </TopPanel>
    
                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="id"
                                queryParams={queryParams}
                            >
                              Customer ID
                            </TableHeader>
    
                            <TableHeader
                                name="customer_name"
                                queryParams={queryParams}
                            >
                                Customer Name
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
                        {customers &&
                            customers.data.map((item) => (
                                <Row key={item.sales_order_no + item.serial_number + item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.customer_name}</RowData>
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
    
                <Pagination paginate={customers} />
            </ContentPanel>
        </AppContent>
        </>
    );
};

export default Customer;


