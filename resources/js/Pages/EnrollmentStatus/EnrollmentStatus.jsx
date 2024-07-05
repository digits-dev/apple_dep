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
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import EnrollmentStatusForm from "./EnrollmentStatusForm";
import DissapearingToast from "../../Components/Toast/DissapearingToast";

const EnrollmentStatus = ({ enrollment_status, queryParams }) => {
 
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
        <Head title="Enrollment Status" />
        <AppContent>
            <DissapearingToast type="success" message={message}/>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <TableButton onClick={handleShowCreate}>
                        Add Enrollment Status
                    </TableButton>
                    <Import importPath="/enrollment-status-import" templatePath="/enrollment-status-import-template"/>
                    <Export  path="/enrollment-status-export"/>
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="id"
                                queryParams={queryParams}
                            >
                            Enrollment Status ID
                            </TableHeader>

                            <TableHeader
                                name="enrollment_status"
                                queryParams={queryParams}
                            >
                               Enrollment Status
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
                        {enrollment_status &&
                            enrollment_status.data.map((item) => (
                                <Row key={item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.enrollment_status}</RowData>
                                    <RowData isLoading={loading} >{item.created_date}</RowData>
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            type="button"
                                            onClick={()=>{handleShowEdit(); setUpdateFormValues({currentId:item.id, currentValue:item.enrollment_status});}}
                                            action="edit"
                                            size="md"
                                        />
                                    </RowData>
                            </Row>
                            ))}
                    </tbody>
                </TableContainer>

                <Pagination paginate={enrollment_status} />
            </ContentPanel>

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Status"
            >
                <EnrollmentStatusForm handleShow={()=>{handleShowCreate(); setMessage('Created Status');}} action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Status"
            >
                <EnrollmentStatusForm handleShow={()=>{handleShowEdit(); setMessage('Updated Status');}} action="edit" updateFormValues={updateFormValues} />
            </Modal>
        </AppContent>
        </>
    );
};

export default EnrollmentStatus;
