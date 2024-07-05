import { Head,  router } from "@inertiajs/react";
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
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import { useEffect, useState } from "react";
import DissapearingToast from "../../Components/Toast/DissapearingToast";
import Modal from "../../Components/Modal/Modal";
import DepStatusForm from "./DepStatusForm";
import RowStatus from "../../Components/Table/RowStatus";

const DepStatus = ({ dep_statuses, queryParams }) => {
 
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [updateFormValues, setUpdateFormValues] = useState({currentValue: '', currentId:''});
    const [message, setMessage] = useState('');

    const handleShowCreate = () => {
        setShowCreate(!showCreate);
    }

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    }

    useEffect(()=>{ 
        const timeout = setTimeout(()=>setMessage(''), 3000);
    
        return () => clearTimeout(timeout);

     },[message])


    return (
        <>
        <Head title="DEP Status" />
        <AppContent>
            <DissapearingToast type="success" message={message}/>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <TableButton onClick={handleShowCreate}>
                        Add Dep Status
                    </TableButton>
                    <Import importPath='/dep-status-import' templatePath="/dep-status-import-template"/>
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
                                    name="status"
                                    queryParams={queryParams}
                                    justify="center"
                            >
                                    Status
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
                                <Row key={item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.dep_status}</RowData>
                                    <RowData isLoading={loading} >{item.created_date}</RowData>
                                    <RowStatus
                                            isLoading={loading}
                                            status={item.status ? "success" : "error"}
                                            center
                                    >
                                            {item.status ? "Active" : "Inactive"}
                                    </RowStatus>
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            type="button"
                                            onClick={()=>{handleShowEdit(); setUpdateFormValues({currentId:item.id, currentValue:item.dep_status});}}
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

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Status"
            >
                <DepStatusForm handleShow={()=>{handleShowCreate(); setMessage('Created Status');}} action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Status"
            >
                <DepStatusForm handleShow={()=>{handleShowEdit(); setMessage('Updated Status');}} action="edit" updateFormValues={updateFormValues} />
            </Modal>
        </AppContent>
        </>
    );
};

export default DepStatus;


