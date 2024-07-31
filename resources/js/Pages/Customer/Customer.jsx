import { Head, router, useForm, usePage } from "@inertiajs/react";
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
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import CustomerForm from "./CustomerForm";
import RowStatus from "../../Components/Table/RowStatus";
import Checkbox from "../../Components/Checkbox/Checkbox";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import axios from "axios";
import { useNavbarContext } from "../../Context/NavbarContext";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Import from "../../Components/Table/Buttons/Import"

const Customer = ({ customers, queryParams }) => {
    const { auth } = usePage().props;
    queryParams = queryParams || {};

    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Submaster - Customer");
        }, 5);
    }, []);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [updateFormValues, setUpdateFormValues] = useState({currentValue: '', currentId:'', status: Boolean});
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleShowCreate = () => {
        setShowCreate(!showCreate);
    };

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    };

    const handleCheckboxChange = (itemId) => {
		if (selectedItems.includes(itemId)) {
		  setSelectedItems(selectedItems.filter(id => id !== itemId));
		} else {
		  setSelectedItems([...selectedItems, itemId]);
		}
	};

    const handleSelectAll = () => {
		if (selectAll) {
		  setSelectedItems([]);
		} else {
		  const allItemIds = customers.data.map(item => item.id);
		  setSelectedItems(allItemIds);
		}
		setSelectAll(!selectAll);
	};

    const resetCheckbox = () => {
        setSelectedItems([]);
        setSelectAll(false);
    }

    const handleActionSelected = (action) => {
		const actionType = action;

		if(selectedItems.length === 0){
            handleToast('Nothing selected!', "Error");
		} else{
			Swal.fire({
                title: `<p class="font-nunito-sans" >Set to ${
                    actionType ? "Active" : "Inactive"
                }?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        const response = await axios.put(
                            "/customers/bulkupdate",
                            {
                                ids: selectedItems,
                                status: actionType
                            }
                        );

                        if (response.data.status == "success") {
                            handleToast(response.data.message, response.data.status);

                            router.reload({ only: ["customers"] });

                            resetCheckbox();
                        }
                    } catch (error) {}
                }
            });
		}
	};

    const bulkActions = [
        { label: <span><i className="fa fa-check-circle mr-2 text-green-600"></i> Set Active</span>, value: 1 },
        { label: <span><i className="fa fa-times-circle mr-2 text-red-600"></i> Set Inactive</span>, value: 0 },
    ];
    
    return (
        <>
            <Head title="Customer" />
                <ContentPanel>
                    <TopPanel>
                    {auth.access.isUpdate && 
                    <BulkActions 
                        actions={bulkActions} 
                        onActionSelected={handleActionSelected} 
                    />}
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    {auth.sessions.admin_is_superadmin == 1 &&
                        <TableButton onClick={handleShowCreate}>
                            Add Customer
                        </TableButton>
                    }
                    {auth.sessions.admin_is_superadmin == 1 && 
                        <Import
                            importPath="/customers-import"
                            templatePath="/customers-import-template"
                        />
                    }
                    <Export path="/customers-export" />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                {auth.access.isUpdate &&
                                <TableHeader
                                        width="sm"
                                        sortable={false}
                                        justify="center"
                                    >
                                        <Checkbox
                                            type="checkbox"
                                            name="selectAll"
                                            id="selectAll"
                                            handleClick={handleSelectAll}
                                            isChecked={selectAll}
                                        />
                                </TableHeader>}

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
                                    name="created_at"
                                    queryParams={queryParams}
                                >
                                    Created Date
                                </TableHeader>

                                <TableHeader
                                    name="status"
                                    queryParams={queryParams}
                                    justify="center"
                                >
                                    Status
                            </TableHeader>
    
                            {auth.access.isUpdate &&
                            <TableHeader
								sortable={false}
								width="auto"
                                justify="center"
							>
								Action
							</TableHeader>}
                        </Row>
                    </Thead>
                    <Tbody data={customers.data}>
                     {customers &&
                            customers.data.map((item) => (
                                <Row key={item.id} >
                                    {auth.access.isUpdate &&
                                    <RowData center>
                                        <Checkbox
                                            type="checkbox"
                                            id={item.id}
                                            handleClick={()=>handleCheckboxChange(item.id)}
                                            isChecked={selectedItems.includes(item.id)}
                                        />
                                    </RowData>}

                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>{item.customer_name}</RowData>
                                    <RowData isLoading={loading} >{item.created_at}</RowData>
                                    <RowStatus
                                            isLoading={loading}
                                            systemStatus={item.status ? "active" : "inactive"}
                                            center
                                    >
                                            {item.status ? "Active" : "Inactive"}
                                    </RowStatus>

                                    {auth.access.isUpdate &&
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            type="button"
                                            onClick={()=>{handleShowEdit(); setUpdateFormValues({currentId:item.id, currentValue:item.customer_name, status:item.status});}}
                                            action="edit"
                                            size="md"
                                        />
                                    </RowData>}
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
    
                <Pagination paginate={customers} onClick={resetCheckbox} />
            </ContentPanel>

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Customer"
            >
                <CustomerForm 
                    handleShow={handleShowCreate} 
                    action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Customer"
            >
                <CustomerForm 
                    handleShow={handleShowEdit} 
                    action="edit" 
                    updateFormValues={updateFormValues} />
            </Modal>

        </>
    );
};

export default Customer;
