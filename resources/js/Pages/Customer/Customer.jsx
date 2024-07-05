import { Head,  router, useForm, usePage } from "@inertiajs/react";
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
import Modal from "../../Components/Modal/Modal";
import CustomerForm from "./CustomerForm";
import DissapearingToast from "../../Components/Toast/DissapearingToast";

const Customer = ({ customers, queryParams }) => {
    queryParams = queryParams || {};

    const [loading, setLoading] = useState(false);
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
    
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    useEffect(()=>{ 
        const timeout = setTimeout(()=>setMessage(''), 3000);
    
        return () => clearTimeout(timeout);

     },[message])
    
    return (
        <>
        <Head title="Customer" />
        <AppContent>
            <DissapearingToast type="success" message={message}/>
        
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <TableButton onClick={handleShowCreate}>
                        Add Customer
                    </TableButton>
                    <Import importPath='/customers-import' templatePath="/customers-import-template"/>
                    <Export path="/customers-export"/>
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
                                <Row key={item.id} >
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.customer_name}</RowData>
                                    <RowData isLoading={loading} >{item.created_date}</RowData>
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            type="button"
                                            onClick={()=>{handleShowEdit(); setUpdateFormValues({currentId:item.id, currentValue:item.customer_name});}}
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

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Customer"
            >
                <CustomerForm handleShow={()=>{handleShowCreate(); setMessage('Created Customer'); setOpenToast(true);}} action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Customer"
            >
                <CustomerForm handleShow={()=>{handleShowEdit(); setMessage('Updated Customer'); setOpenToast(true);}} action="edit" updateFormValues={updateFormValues} />
            </Modal>

        
        </AppContent>
        </>
    );
};

export default Customer;


