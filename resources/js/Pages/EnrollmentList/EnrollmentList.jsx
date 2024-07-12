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

const EnrollmentList = ({ enrollmentLists, queryParams }) => {
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);

    const [field1, setField1] = useState("");

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    return (
        <>
            <Head title="Enrollment List" />
            <AppContent>
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Filters>
                            <InputComponent
                                name={"field1"}
                                placeholder="placeholder of field1"
                                value={field1}
                                onChange={setField1}
                            />
                            <InputComponent
                                name={"field2"}
                                placeholder="placeholder of field2"
                            />
                            <InputComponent
                                name={"field3"}
                                placeholder="placeholder of field3"
                            />
                            <Select
                                name="first_name"
                                options={[
                                    { name: "opt1", id: 1 },
                                    { name: "opt2", id: 2 },
                                ]}
                            />
                            <Select
                                name="middle_name"
                                options={[
                                    { name: "opt1", id: 1 },
                                    { name: "opt2", id: 2 },
                                ]}
                            />
                            <Select
                                name="last"
                                options={[
                                    { name: "opt1", id: 1 },
                                    { name: "opt2", id: 2 },
                                ]}
                            />
                        </Filters>
                        <Export path="/enrollment-list-export" />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="sales_order_no"
                                    queryParams={queryParams}
                                    justify="center"
                                    sticky="left"
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
                                    name="dep_status"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    DEP Status
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
                                    name="enrollment_status"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Enrollment Status
                                </TableHeader>

                                <TableHeader
                                    name="created_date"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Created Date
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

                        <tbody>
                            {enrollmentLists &&
                                enrollmentLists.data.map((item, index) => (
                                    <Row key={item.sales_order_no + index}>
                                        <RowData
                                            isLoading={loading}
                                            center
                                            sticky="left"
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
                                        <RowStatus
                                            isLoading={loading}
                                            center
                                        >
                                            {item?.d_status?.dep_status}
                                        </RowStatus>
                                        <RowData isLoading={loading} center>
                                            {item.status_message}
                                        </RowData>
                                        <RowStatus
                                            isLoading={loading}
                                        >
                                            {item?.e_status?.enrollment_status}
                                        </RowStatus>
                                        <RowData isLoading={loading} center>
                                            {item.created_date}
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
                        </tbody>
                    </TableContainer>

                    <Pagination paginate={enrollmentLists} />
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default EnrollmentList;
