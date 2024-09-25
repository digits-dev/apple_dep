import { Head, router, usePage } from "@inertiajs/react";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TopPanel from "../../Components/Table/TopPanel";
import ContentPanel from "../../Components/Table/ContentPanel";
import RowData from "../../Components/Table/RowData";
import RowAction from "../../Components/Table/RowAction";
import RowActions from "../../Components/Table/RowActions";
import Row from "../../Components/Table/Row";
import Import from "../../Components/Table/Buttons/Import";
import Export from "../../Components/Table/Buttons/Export";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Thead from "../../Components/Table/Thead";
import TableContainer from "../../Components/Table/TableContainer";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import RowStatus from "../../Components/Table/RowStatus";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import Checkbox from "../../Components/Checkbox/Checkbox";
import axios from "axios";
import { useNavbarContext } from "../../Context/NavbarContext";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";
import DepCompanyForm from "./DepCompanyForm";

const DepCompany = ({ depCompanies, queryParams, customers}) => {
    const { auth } = usePage().props;
    queryParams = queryParams || {};

    const { handleToast } = useToast();
    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Submaster - DEP Company");
        }, 5);
    }, []);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDetails, setShowDetails] = useState (false);
    const [updateFormValues, setUpdateFormValues] = useState({
        currentId: "",
        note: "",
        dep_organization_id: "",
        dep_company_name: "",
        customer_id: "",
        status: Boolean,
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleShowCreate = () => {
        setShowCreate(!showCreate);
    };

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    };

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    const handleCheckboxChange = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allItemIds = depCompanies?.data.map((item) => item.id);
            setSelectedItems(allItemIds);
        }
        setSelectAll(!selectAll);
    };

    const resetCheckbox = () => {
        setSelectedItems([]);
        setSelectAll(false);
    };

    const handleActionSelected = (action) => {
        const actionType = action;

        if (selectedItems?.length === 0) {
            handleToast("Nothing selected!", "Error");
        } else {
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
                            "/dep-companies/bulkupdate",
                            {
                                ids: selectedItems,
                                status: actionType,
                            }
                        );

                        if (response.data.status == "success") {
                            handleToast(
                                response.data.message,
                                response.data.status
                            );

                            router.reload({ only: ["depCompanies"] });

                            resetCheckbox();
                        }
                    } catch (error) {}
                }
            });
        }
    };

    const bulkActions = [
        {
            label: (
                <span>
                    <i className="fa fa-check-circle mr-2 text-green-600"></i>{" "}
                    Set Active
                </span>
            ),
            value: 1,
        },
        {
            label: (
                <span>
                    <i className="fa fa-times-circle mr-2 text-red-600"></i> Set
                    Inactive
                </span>
            ),
            value: 0,
        },
    ];

    return (
        <>
            <Head title="DEP Company" />
                <ContentPanel>
                    <TopPanel>
                        {auth.access.isUpdate && 
                        <BulkActions
                            actions={bulkActions}
                            onActionSelected={handleActionSelected}
                        />}

                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />

                        {auth.access.isCreate && 
                        <>
                            <TableButton onClick={handleShowCreate}>
                                Add Dep Company
                            </TableButton>

                            <Import
                                importPath="/dep-company-import"
                                templatePath="/dep-company-import-template"
                            />
                        </>}
                       
                        <Export
                            path={`/dep-company-export${window.location.search}`}
                            handleToast={handleToast}
                        />
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                {auth.access.isUpdate && 
                                <TableHeader
                                    width="sm"
                                    sortable={false}
                                    justify="center"
                                    sticky="left"
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
                                    width="lg"
                                >
                                    DEP Organization ID
                                </TableHeader>

                                <TableHeader
                                    name="dep_company_name"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    DEP Company Name
                                </TableHeader>

                                <TableHeader
                                    name="customer"
                                    queryParams={queryParams}
                                    width="lg"

                                >
                                    Customer Name
                                </TableHeader>

                                <TableHeader
                                    name="created_by"
                                    queryParams={queryParams}
                                    width="lg"

                                >
                                    Created By
                                </TableHeader>

                                <TableHeader
                                    name="created_at"
                                    queryParams={queryParams}
                                >
                                    Created Date
                                </TableHeader>

                                <TableHeader
                                    name="updated_by"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Updated By
                                </TableHeader>

                                <TableHeader
                                    name="updated_at"
                                    queryParams={queryParams}
                                >
                                    Updated Date
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
                                    sticky="right"
                                >
                                    Action
                                </TableHeader>}
                            </Row>
                        </Thead>

                        <Tbody data={depCompanies.data}>
                            {depCompanies &&
                                depCompanies.data.map((item, index) => (
                                    <Row key={item.id + 'id' + index}>
                                        {auth.access.isUpdate && 
                                        <RowData center sticky="left">
                                            <Checkbox
                                                type="checkbox"
                                                id={item.id}
                                                handleClick={() =>
                                                    handleCheckboxChange(
                                                        item.id
                                                    )
                                                }
                                                isChecked={selectedItems.includes(
                                                    item.id
                                                )}
                                            />
                                        </RowData>}

                                        <RowData isLoading={loading} >
                                            {item.dep_organization_id}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.dep_company_name}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item?.customers?.customer_name}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item?.created_by?.name}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.created_at}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item?.updated_by?.name}
                                        </RowData>

                                        <RowData isLoading={loading}>
                                            {item.updated_at}
                                        </RowData>

                                        <RowStatus
                                            isLoading={loading}
                                            systemStatus={
                                                item.status
                                                    ? "active"
                                                    : "inactive"
                                            }
                                            center
                                        >
                                            {item.status
                                                ? "Active"
                                                : "Inactive"}
                                        </RowStatus>

                                        {auth.access.isUpdate &&
                                        <RowData isLoading={loading} center sticky="right">
                                            <RowActions>
                                                <RowAction
                                                    type="button"
                                                    onClick={() => {
                                                        handleShowEdit();
                                                        setUpdateFormValues({
                                                            currentId: item.id,
                                                            note: item.note,
                                                            dep_organization_id: item.dep_organization_id,
                                                            dep_company_name: item.dep_company_name,
                                                            customer_id: item.customer_id,
                                                            status: item.status,
                                                        });
                                                    }}
                                                    action="edit"
                                                    size="md"
                                                    tooltipContent="Edit"
                                                />
                                                <RowAction
                                                    type="button"
                                                    onClick={() => {
                                                        handleShowDetails();
                                                        setUpdateFormValues({
                                                            currentId: item.id,
                                                            dep_company_name: item.dep_company_name,
                                                            dep_organization_id: item.dep_organization_id,
                                                            note: item.note,
                                                            customer_id: item.customer_id,
                                                            status: item.status,
                                                        });
                                                    }}
                                                    action="view"
                                                    size="md"
                                                    tooltipContent="Show Details"
                                                />
                                            </RowActions>
                                        </RowData>}
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>

                    <Pagination paginate={depCompanies} onClick={resetCheckbox} />
                </ContentPanel>

                <Modal
                    show={showCreate}
                    onClose={handleShowCreate}
                    title="Add DEP Company"
                >
                    <DepCompanyForm 
                        handleShow={handleShowCreate}
                        action="create"
                        customers={customers}
                    />
                </Modal>

                <Modal
                    show={showEdit}
                    onClose={handleShowEdit}
                    title="Edit DEP Company"
                >
                    <DepCompanyForm
                        handleShow={handleShowEdit}
                        action="edit"
                        updateFormValues={updateFormValues}
                        customers={customers}
                    />
                </Modal>
                <Modal
                    show={showDetails}
                    onClose={handleShowDetails}
                    title="DEP Company Details"
                >
                    <DepCompanyForm
                        handleShow={handleShowDetails}
                        action="view"
                        updateFormValues={updateFormValues}
                        customers={customers}
                    />
                </Modal>
        </>
    );
};

export default DepCompany;
