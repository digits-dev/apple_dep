import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
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
import TableButton from "../../Components/Table/Buttons/TableButton";
import Modal from "../../Components/Modal/Modal";
import ModulForm from "./ModulForm";
import Tbody from "../../Components/Table/Tbody";

const Modules = ({ modules, queryParams }) => {
    queryParams = queryParams || {};
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // CREATE MODULES
    const handleCreate = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    return (
        <>
            <Head title="Modules" />
                <ContentPanel>
                    <TopPanel>
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <TableButton onClick={handleCreate}>
                            Create Modules
                        </TableButton>
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
                                    name="path"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Path
                                </TableHeader>
                                <TableHeader
                                    name="controller"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Controller
                                </TableHeader>
                                {/* <TableHeader
                                    sortable={false}
                                    width="auto"
                                    justify="center"
                                >
                                    Action
                                </TableHeader> */}
                            </Row>
                        </Thead>

                        <Tbody data={modules?.data}>
                            {modules &&
                                modules?.data.map((item, index) => (
                                    <Row key={item.id}>
                                        <RowData isLoading={loading}>
                                            {item.id}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.name}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.path}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {item.controller}
                                        </RowData>
                                        {/* <RowData center>
                                            <RowAction action="edit"
                                                    href={`edit-module/${item.id}`}
                                            >

                                            </RowAction>
                                        </RowData> */}
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>
                    <Pagination paginate={modules} />
                </ContentPanel>
                <Modal
                    show={showCreateModal}
                    onClose={handleCloseCreateModal}
                    title="Create Module"
                >
                    <ModulForm onClose={handleCloseCreateModal} />
                </Modal>
        </>
    );
};

export default Modules;
