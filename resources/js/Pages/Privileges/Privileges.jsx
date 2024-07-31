import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import TableHeader from "../../Components/Table/TableHeader";
import Row from "../../Components/Table/Row";
import RowData from "../../Components/Table/RowData";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import RowActions from "../../Components/Table/RowActions";
import RowAction from "../../Components/Table/RowAction";
import Pagination from "../../Components/Table/Pagination";
import Tbody from "../../Components/Table/Tbody";
import { useNavbarContext } from "../../Context/NavbarContext";

const Privileges = ({ privileges, queryParams }) => {
    queryParams = queryParams || {};
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    const [loading, setLoading] = useState(false);

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Privileges");
        }, 5);
    }, []);

    return (
        <>
            <Head title="Privileges" />
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Link
                            href="create-privileges"
                            as="button"
                            className="bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2"
                        >
                            <i className="fa fa-plus-circle"></i> Add
                            Privilege
                        </Link>
                    </TopPanel>
                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="id"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    ID
                                </TableHeader>
                                <TableHeader
                                    name="name"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Name
                                </TableHeader>
                                <TableHeader
                                    name="is_superadmin"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Super Admin
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
                        <Tbody data={privileges?.data}>
                            {privileges &&
                                privileges?.data.map((item, index) => (
                                    <Row key={item.id}>
                                        <RowData isLoading={loading}>
                                            {item.id}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.name}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.is_superadmin
                                                ? "Superadmin"
                                                : "Standard"}
                                        </RowData>
                                        <RowData center>
                                            <RowAction
                                                as="button"
                                                action="edit"
                                                href={`edit-privileges/${item.id}`}
                                                tooltipContent="Edit"
                                            ></RowAction>
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                         
                    </TableContainer>
                    <Pagination paginate={privileges} />
                </ContentPanel>
        </>
    );
};

export default Privileges;
