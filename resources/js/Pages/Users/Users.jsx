import { router, Head } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import Modal from "../../Components/Modal/Modal";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import axios from "axios";
import RowData from "../../Components/Table/RowData";
import TableContainer from "../../Components/Table/TableContainer";
import TopPanel from "../../Components/Table/TopPanel";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import Import from "../../Components/Table/Buttons/Import";
import Filters from "../../Components/Table/Buttons/Filters";
import ContentPanel from "../../Components/Table/ContentPanel";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import RowActions from "../../Components/Table/RowActions";
import RowAction from "../../Components/Table/RowAction";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Checkbox from "../../Components/Checkbox/Checkbox";
import RowStatus from "../../Components/Table/RowStatus";
import BulkActions from "../../Components/Table/Buttons/BulkActions";
import { NavbarContext } from "../../Context/NavbarContext";
import Tbody from "../../Components/Table/Tbody";
import { useToast } from "../../Context/ToastContext";

const Users = ({ users, options, queryParams }) => {
    queryParams = queryParams || {};
    const { handleToast } = useToast();
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const { setTitle } = useContext(NavbarContext);

    //BULK ACTIONS
    useEffect(() => {
        setTimeout(() => {
            setTitle("User Management");
        }, 5);
    }, []);

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(users.data.map((item) => item.u_id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
        }
    };

    const handleActionClick = async (value) => {
        const bulk_action_type = value;
        const Ids = Array.from(
            document.querySelectorAll("input[name='users_id[]']:checked")
        ).map((input) => parseInt(input.id));
        if (Ids.length === 0) {
            handleToast("Nothing selected!", "Error");
        } else {
            Swal.fire({
                title: `<p class="font-nunito-sans" >Set to ${
                    !bulk_action_type == 0 ? "Active" : "Inactive"
                }?</p>`,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#000000",
                icon: "question",
                iconColor: "#000000",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.post(
                            "/deactivate-users",
                            { Ids, bulk_action_type },
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
                        if (response.data.status == "success") {
                            handleToast(
                                response.data.message,
                                response.data.status
                            );
                            router.reload({ only: ["users"] });
                            setIsCheck([]);
                            setIsCheckAll(false);
                        }
                    } catch (error) {}
                }
            });
        }
    };

    // CREATE USERS
    const handleCreate = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const CreateUserForm = ({ onClose }) => {
        const [errors, setErrors] = useState({});
        const [serverErrors, setServerErrors] = useState({});
        const [clearErrors, setClearErrors] = useState({});
        const [loading, setLoading] = useState(false);
        const [forms, setforms] = useState({
            name: "",
            email: "",
            privilege_id: "",
            password: "",
        });

        function handleChange(e) {
            const key = e.target.name;
            const value = e.target.value;
            setforms((forms) => ({
                ...forms,
                [key]: value,
            }));
            setClearErrors(key);
            setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
        }

        const validate = () => {
            const newErrors = {};
            if (!forms.name) newErrors.name = "Name is required";
            if (!forms.email) newErrors.email = "Email is required";
            if (!forms.privilege_id)
                newErrors.privilege_id = "Privilege is required";
            if (!forms.password) newErrors.password = "Password is required";
            return newErrors;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const newErrors = validate();
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            } else {
                setLoading(true);
                try {
                    const response = await axios.post("/postAddSave", forms, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    if (response.data.type == "success") {
                        handleToast(response.data.message, response.data.type);
                        setShowCreateModal(false);
                        router.reload({ only: ["users"] });
                    } else {
                        setErrorMessage(response.data.message);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 422) {
                        setErrors(error.response.data.errors);
                    } else {
                        setErrors({
                            general: "An error occurred. Please try again.",
                        });
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        return (
            <form onSubmit={handleSubmit} className="p-2">
                {errorMessage && (
                    <div style={{ color: "red" }}>{errorMessage}</div>
                )}
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={forms.name}
                        onChange={handleChange}
                    />
                    {(errors.name || serverErrors.name) && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.name || serverErrors.name}
                        </div>
                    )}
                </div>

                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={forms.email}
                        onChange={handleChange}
                    />
                    {(errors.email || serverErrors.email) && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.email || serverErrors.email}
                        </div>
                    )}
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold mb-1">
                        Privileges
                    </label>
                    <DropdownSelect
                        defaultSelect="Select a Privilege"
                        name="privilege_id"
                        options={options.privileges}
                        value={forms.privilege_id}
                        onChange={handleChange}
                    />
                    {(errors.privilege_id || serverErrors.privilege_id) && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.privilege_id || serverErrors.privilege_id}
                        </div>
                    )}
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={forms.password}
                        onChange={handleChange}
                    />
                    {(errors.password || serverErrors.password) && (
                        <div className="font-nunito-sans font-bold text-red-600">
                            {errors.password || serverErrors.password}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        );
    };

    //EDIT
    const handleEdit = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const EditUserForm = ({ user }) => {
        const [editForms, setEditForms] = useState({
            u_id: user?.u_id,
            name: user?.user_name || "",
            email: user?.email || "",
            privilege_id: user?.id_adm_privileges || "",
            password: "",
            status: user?.status,
        });

        function handleChange(e) {
            const key = e.target.name;
            const value = e.target.value;
            setEditForms((editForms) => ({
                ...editForms,
                [key]: value,
            }));
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axios.post("/postEditSave", editForms, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.data.type === "success") {
                    handleToast(response.data.message, response.data.type);
                    setShowEditModal(false);
                    router.reload({ only: ["users"] });
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    //setErrors(error.response.data.errors);
                } else {
                    //setErrors({ general: 'An error occurred. Please try again.' });
                }
            } finally {
                setLoading(false);
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    value={editForms.u_id}
                    onChange={(e) => setData("u_id", e.target.value)}
                />
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={editForms.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        name="name"
                        value={editForms.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Privileges
                    </label>
                    <DropdownSelect
                        defaultSelect="Select a Privilege"
                        name="privilege_id"
                        options={options.privileges}
                        value={editForms.privilege_id}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <label className="font-nunito-sans font-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border placeholder:text-sm placeholder:text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        name="password"
                        value={editForms.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col  w-full">
                    <label className="font-nunito-sans font-semibold">
                        Status
                    </label>
                    <DropdownSelect
                        defaultSelect="Select a status"
                        name="status"
                        options={options.status}
                        value={editForms.status}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70 mb-2"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>
        );
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
            <Head title="Users Management" />
            <AppContent>
                <ContentPanel>
                    <TopPanel>
                        <BulkActions
                            actions={bulkActions}
                            onActionSelected={handleActionClick}
                        />
                        <TableSearch queryParams={queryParams} />
                        <PerPage queryParams={queryParams} />
                        <Import />
                        <Filters />
                        <TableButton onClick={handleCreate}>
                            Create User
                        </TableButton>
                    </TopPanel>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader
                                    name="users_id"
                                    width="sm"
                                    sortable={false}
                                    justify="center"
                                >
                                    <Checkbox
                                        type="checkbox"
                                        name="selectAll"
                                        id="selectAll"
                                        handleClick={handleSelectAll}
                                        isChecked={isCheckAll}
                                    />
                                </TableHeader>

                                <TableHeader
                                    name="user_name"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Name
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                >
                                    Email
                                </TableHeader>

                                <TableHeader
                                    name="privilege_name"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Privilege Name
                                </TableHeader>
                                <TableHeader
                                    name="status"
                                    queryParams={queryParams}
                                    width="sm"
                                >
                                    Status
                                </TableHeader>

                                <TableHeader
                                    sortable={false}
                                    width="auto"
                                    sticky="right"
                                    justify="center"
                                >
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>

                        <Tbody data={users?.data}>
                            {users &&
                                users?.data.map((user, index) => (
                                    <Row
                                        key={user.user_name + user.u_id + index}
                                    >
                                        <RowData center>
                                            <Checkbox
                                                type="checkbox"
                                                name="users_id[]"
                                                id={user.u_id}
                                                handleClick={handleClick}
                                                isChecked={isCheck.includes(
                                                    user.u_id
                                                )}
                                            />
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {user.user_name}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {user.email}
                                        </RowData>
                                        <RowData isLoading={loading}>
                                            {user.privilege_name}
                                        </RowData>
                                        <RowStatus
                                            isLoading={loading}
                                            systemStatus={
                                                user.status
                                                    ? "active"
                                                    : "inactive"
                                            }
                                        >
                                            {user.status == 1
                                                ? "Active"
                                                : "Inactive"}
                                        </RowStatus>
                                        <RowData
                                            isLoading={loading}
                                            sticky="right"
                                            width="sm"
                                            center
                                        >
                                            <RowActions>
                                                <RowAction
                                                    type="button"
                                                    action="edit"
                                                    size="md"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                />
                                            </RowActions>
                                        </RowData>
                                    </Row>
                                ))}
                        </Tbody>
                    </TableContainer>
                    <div
                        onClick={() => {
                            setIsCheckAll(false), setIsCheck([]);
                        }}
                    >
                        <Pagination paginate={users} />
                    </div>
                </ContentPanel>

                <Modal
                    show={showCreateModal}
                    onClose={handleCloseCreateModal}
                    title="Create User"
                    width="lg"
                >
                    <CreateUserForm onClose={handleCloseCreateModal} />
                </Modal>

                <Modal
                    show={showEditModal}
                    onClose={handleCloseEditModal}
                    title="Edit User"
                    width="lg"
                >
                    <EditUserForm
                        user={editUser}
                        onClose={handleCloseEditModal}
                    />
                </Modal>
            </AppContent>
        </>
    );
};

export default Users;
