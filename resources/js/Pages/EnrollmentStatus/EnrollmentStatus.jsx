import { Head,  router } from "@inertiajs/react";
import AppContent from "../../Layouts/layout/AppContent";
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
import TableButton from "../../Components/Table/Buttons/TableButton";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import EnrollmentStatusForm from "./EnrollmentStatusForm";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import Checkbox from "../../Components/Checkbox/Checkbox";
import axios from "axios";
import { useNavbarContext } from "../../Context/NavbarContext";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";

const EnrollmentStatus = ({ enrollment_status, queryParams }) => {
 
    queryParams = queryParams || {};

    const { handleToast } = useToast();

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Submaster - Enrollment Status");
        }, 5);
    }, []);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [updateFormValues, setUpdateFormValues] = useState({currentValue: '', currentId:'', status: Boolean,  color: '',});
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleShowCreate = () => {
        setShowCreate(!showCreate);
    }

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    }

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
		  const allItemIds = enrollment_status?.data.map(item => item.id);
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

		if(selectedItems?.length === 0){
            handleToast("Nothing selected!", "Error");
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
                            "/enrollment_statuses/bulkupdate",
                            {
                                ids: selectedItems,
                                status: actionType
                            }
                        );

                        if (response.data.status == "success") {
                            handleToast(response.data.message, response.data.status);

                            router.reload({ only: ["enrollment_status"] });

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
        <Head title="Enrollment Status" />
            <ContentPanel>
                <TopPanel>
                    <BulkActions actions={bulkActions} onActionSelected={handleActionSelected} />
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
                            </TableHeader>

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

                    <Tbody data={enrollment_status.data}>
                        {enrollment_status &&
                            enrollment_status.data.map((item) => (
                                <Row key={item.id} >
                                    <RowData center>
                                        <Checkbox
                                            type="checkbox"
                                            id={item.id}
                                            handleClick={()=>handleCheckboxChange(item.id)}
                                            isChecked={selectedItems.includes(item.id)}
                                        />
                                    </RowData>
                                    <RowData isLoading={loading} >
                                        {item.id}
                                    </RowData>
                                    <RowStatus
                                            isLoading={loading}
                                            color={item.color}
                                    >
                                           {item.enrollment_status}
                                    </RowStatus>
                                    <RowData isLoading={loading} >{item.created_date}</RowData>
                                    <RowStatus
                                            isLoading={loading}
                                            systemStatus={item.status ? "active" : "inactive"}
                                            center
                                    >
                                            {item.status ? "Active" : "Inactive"}
                                    </RowStatus>
                                    <RowData isLoading={loading} center>
                                        <RowAction
                                            type="button"
                                            onClick={()=>{
                                                handleShowEdit(); 
                                                setUpdateFormValues({
                                                    currentId: item.id, 
                                                    currentValue: item.enrollment_status, 
                                                    status: item.status, 
                                                    color: item.color
                                                });}}
                                            action="edit"
                                            size="md"
                                        />
                                    </RowData>
                            </Row>
                            ))}
                    </Tbody>
                </TableContainer>

                <Pagination paginate={enrollment_status} onClick={resetCheckbox} />
            </ContentPanel>

            <Modal
                show={showCreate}
                onClose={handleShowCreate}
                title="Add Status"
            >
                <EnrollmentStatusForm 
                    handleShow={()=>{
                        handleShowCreate(); 
                        handleToast("Created Status", "success");
                    }} 
                    action="create" />
            </Modal>

            <Modal
                show={showEdit}
                onClose={handleShowEdit}
                title="Edit Status"
            >
                <EnrollmentStatusForm 
                    handleShow={()=>{
                        handleShowEdit(); 
                        handleToast("Updated Status", "success");
                    }} 
                    action="edit" 
                    updateFormValues={updateFormValues} 
                />
            </Modal>
        </>
    );
};

export default EnrollmentStatus;
