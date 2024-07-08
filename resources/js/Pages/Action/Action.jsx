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
import ActionForm from "./ActionForm";
import Modal from "../../Components/Modal/Modal";
import RowStatus from "../../Components/Table/RowStatus";

const Action = ({ actions, queryParams }) => {
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);
    
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [updateFormValues, setUpdateFormValues] = useState({currentValue: '', currentId:'', status: Boolean});
    const [message, setMessage] = useState('');

    const handleShowCreate = () => {
        setShowCreate(!showCreate);
    }

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    }
    
    return (
        <>
        <Head title="Actions" />
        <AppContent>
            <DissapearingToast type="success" message={message}/>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <TableButton onClick={handleShowCreate}>
                        Add Action
                    </TableButton>
                    <Import importPath="/actions-import" templatePath="/actions-import-template"/>
                    <Export  path="/actions-export"/>
                </TopPanel>
    
                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="id"
                                queryParams={queryParams}
                            >
                              Action ID
                            </TableHeader>
    
                            <TableHeader
                                name="customer_name"
                                queryParams={queryParams}
                            >
                                Action Name
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
                        {actions &&
                            actions.data.map((item) => (
                                <Row key={item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.action_name}</RowData>
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
                                            onClick={()=>{handleShowEdit(); setUpdateFormValues({currentId:item.id, currentValue:item.action_name, status:item.status});}}
                                            action="edit"
                                            size="md"
                                        />
                                    </RowData>
                            </Row>
                            ))}
                    </tbody>
                </TableContainer>
    
                <Pagination paginate={actions} />
            </ContentPanel>

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Action"
            >
                <ActionForm handleShow={()=>{handleShowCreate(); setMessage('Created Action'); setTimeout(() => setMessage(""), 3000);}} action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Action"
            >
                <ActionForm handleShow={()=>{handleShowEdit(); setMessage('Updated Action'); setTimeout(() => setMessage(""), 3000);}} action="edit" updateFormValues={updateFormValues} />
            </Modal>

        </AppContent>
        </>
    );
};

export default Action;


