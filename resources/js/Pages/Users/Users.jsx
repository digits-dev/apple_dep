import { Link, usePage, useForm, router  } from "@inertiajs/react";
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
import Export from "../../Components/Table/Buttons/Export";
import Filters from "../../Components/Table/Buttons/Filters";
import ContentPanel from "../../Components/Table/ContentPanel";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import RowActions from "../../Components/Table/RowActions";
import RowAction from "../../Components/Table/RowAction";
import TableButton from "../../Components/Table/Buttons/TableButton";
import EditIcon from "../../Components/Table/Icons/EditIcon";
import Checkbox from "../../Components/Checkbox/Checkbox";

const Users = ({users, options, queryParams}) => {
    queryParams = queryParams || {};
	router.on("start", () => setLoading(true));
	router.on("finish", () => setLoading(false));
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options);
    const [successMessage, setSuccessMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    //BULK ACTIONS
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropbtn')) {
                setDropdownVisible(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSelectAll = () =>{
        setIsCheckAll(!isCheckAll);
        setIsCheck(users.data.map(item => item.u_id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    }

    const handleClick = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
          setIsCheck(isCheck.filter(item => item !== parseInt(id)));
        }
    };
  
    const handleActionClick = (value) => {
        setSelectedValue(value);
        console.log(selectedValue);
        const Ids = Array.from(document.querySelectorAll("input[name='users_id[]']:checked")).map(input => parseInt(input.id));
        console.log(Ids)
        if (Ids.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Nothing selected!',
                confirmButtonColor: '#367fa9',
            });
            return;
        }
    };

    // CREATE USERS
    const handleCreate = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    //CREATE
    const CreateUserForm = ({ onClose }) => {
        const [errorMessage, setErrorMessage] = useState('');
        const [errors, setErrors] = useState({});
        const [serverErrors, setServerErrors] = useState({});
        const [clearErrors, setClearErrors] = useState({});
        const [loading, setLoading] = useState(false);
        const [forms, setforms] = useState({
            name: '',
            email: '',
            privilege_id: '',
            password: ''
        })

        function handleChange(e) {
            const key = e.target.name;
            const value = e.target.value
            setforms(forms => ({
                ...forms,
                [key]: value,
            }));
            setClearErrors(key);
            setErrors(prevErrors => ({ ...prevErrors, [key]: '' }));
        }

        const validate = () => {
            const newErrors = {};
            if (!forms.name) newErrors.name = 'Name is required';
            if (!forms.email) newErrors.email = 'Email is required';
            if (!forms.privilege_id) newErrors.privilege_id = 'Privilege is required';
            if (!forms.password) newErrors.password = 'Password is required';
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
                                'Content-Type': 'multipart/form-data',
                            },  
                        });
                        if(response.data.type == 'success'){
                            setSuccessMessage(response.data.message); 
                            setShowCreateModal(false);
                            router.reload({ only: ['users'] })
                        }else{
                            setErrorMessage(response.data.message); 
                        }
                       
                    } catch (error) {
                        if (error.response && error.response.status === 422) {
                            setErrors(error.response.data.errors);
                        } else {
                            setErrors({ general: 'An error occurred. Please try again.' });
                        }
                    } finally {
                        setLoading(false);
                    }
                }
        };
    
        return (
            <form onSubmit={handleSubmit}>
                <span className="font-nunito-sans font-semibold text-center">Create User</span>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                <div className="flex flex-col mb-1 w-full">
                    <label className="font-nunito-sans font-semibold">Name</label>
                    <input type="text" name="name" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                           value={forms.name} 
                           onChange={handleChange} />
                      {(errors.name || serverErrors.name) && <div className="font-nunito-sans font-bold text-red-600">{errors.name || serverErrors.name}</div>}
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Email</label>
                    <input type="email" name="email" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                           value={forms.email} 
                           onChange={handleChange} />
                     {(errors.email || serverErrors.email) && <div className="font-nunito-sans font-bold text-red-600">{errors.email || serverErrors.email}</div>}
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Privileges</label>
                    <DropdownSelect defaultSelect="Select a Privilege" name="privilege_id" options={options.privileges} value={forms.privilege_id} onChange={handleChange} />
                    {(errors.privilege_id || serverErrors.privilege_id) && <div className="font-nunito-sans font-bold text-red-600">{errors.privilege_id || serverErrors.privilege_id}</div>}
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Password</label>
                    <input type="password" name="password" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                           value={forms.password} 
                           onChange={handleChange} />
                    {(errors.password || serverErrors.password) && <div className="font-nunito-sans font-bold text-red-600">{errors.password || serverErrors.password}</div>}
                </div>
                <button type="submit" 
                        className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70"
                        disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
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

    const EditUserForm = ({ user, onClose }) => {

        const [editForms, setEditForms] = useState({
            u_id: user?.u_id,
            name: user?.user_name || '',
            email: user?.email || '',
            privilege_id: user?.id_adm_privileges || '',
            password: '',
            status: user?.status
        });

        function handleChange(e) {
            const key = e.target.name;
            const value = e.target.value
            setEditForms(editForms => ({
                ...editForms,
                [key]: value,
            }));
        }
    
        const handleSubmit = async (e) =>{
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axios.post("/postEditSave", editForms, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },  
                });
                if(response.data.type == 'success'){
                    setSuccessMessage(response.data.message); 
                    setShowEditModal(false);
                    router.reload({ only: ['users'] })
                }else{
                    setErrorMessage(response.data.message); 
                }
                
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({ general: 'An error occurred. Please try again.' });
                }
            } finally {
                setLoading(false);
            }
                
        };
    
        return (
            <form onSubmit={handleSubmit}>
                 <input type="hidden" value={editForms.u_id} onChange={e => setData('u_id', e.target.value)} />
                 <div>
                    <label className="font-nunito-sans font-semibold">Email</label>
                    <input type="email" 
                           name="email" 
                           className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           value={editForms.email} 
                           onChange={handleChange} disabled/>
                </div>
                <div>
                    <label className="font-nunito-sans font-semibold">Name</label>
                    <input type="text"
                           className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           name="name" 
                           value={editForms.name} 
                           onChange={handleChange} />
                </div>
           
                <div>
                    <label className="font-nunito-sans font-semibold">Privileges</label>
                    <DropdownSelect defaultSelect="Select a Privilege" name="privilege_id" options={options.privileges} value={editForms.privilege_id} onChange={handleChange} />
                   
                </div>
                <div>
                    <label className="font-nunito-sans font-semibold">Password</label>
                    <input type="password" 
                           className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           name="password" 
                           value={editForms.password} 
                           onChange={handleChange} />
                </div>
                <div>
                    <label className="font-nunito-sans font-semibold">Privileges</label>
                    <DropdownSelect defaultSelect="Select a status" name="status" options={options.status} value={editForms.status} onChange={handleChange} />
                   
                </div>
                <button type="submit" 
                        className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70"
                        disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
            </form>
        );
    };

    return (
        <AppContent>
            <div>
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                
                <hr/>
                <ContentPanel>
                <TopPanel>
                    <div className="dropdown">
                        <TableButton onClick={handleDropdownToggle}>  <i className="fa fa-check-square"></i> Bulk Actions</TableButton>
                        <div id="myDropdown" className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
                            <span onClick={() => handleActionClick(1)}>
                                <i className="fa fa-check-circle"></i> Set Active
                            </span>
                            <span onClick={() => handleActionClick(0)}>
                                <i className="fa fa-times-circle"></i> Set Inactive
                            </span>
                        </div>
                    </div>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Import  />
                    <Filters />
              
                    <TableButton onClick={handleCreate}>Create User</TableButton>
                </TopPanel>

				<TableContainer>
					<Thead>
						<Row>
                            <TableHeader
								name="users_id"
                                width="sm"
							>
							    <Checkbox type="checkbox"
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
								sortable={false}
								width="auto"
								sticky="right"
                                justify="center"
                                >
								Action
							</TableHeader>
						</Row>
					</Thead>

					<tbody>

                        {users && users?.data.map((user, index) => (
                            <Row key={user.user_name + user.u_id + index}>
                                <RowData>
                                    <Checkbox 
                                        type="checkbox"
                                        name="users_id[]"
                                        id={user.u_id}
                                        handleClick={handleClick} 
                                        isChecked={isCheck.includes(user.u_id)}
                                    />
                                </RowData>
                                <RowData 
                                    isLoading={loading}
                                >
                                    {user.user_name}
                                </RowData>

                                <RowData 
                                    isLoading={loading}
                                >
                                    {user.email}
                                </RowData>

                                <RowData 
                                    isLoading={loading}
                                >
                                    {user.privilege_name}
                                </RowData>

                                <RowData 
                                    isLoading={loading}
                                    sticky="right"
                                    width="sm"
                                    center
                                >
                                   <RowActions>
                                    <RowAction
                                        action="view"
                                        size="md"
                                    />
                                   <button onClick={() => handleEdit(user)}> <EditIcon classes="h-5 w-5" /></button>
                                    </RowActions>
                                </RowData>
                            </Row>
                        
                        ))}
                    </tbody>
                </TableContainer>

				<Pagination paginate={users} />
			    </ContentPanel>

                <Modal show={showCreateModal} onClose={handleCloseCreateModal}>
                    <CreateUserForm onClose={handleCloseCreateModal} />
                </Modal>

                <Modal show={showEditModal} onClose={handleCloseEditModal}>
                    <EditUserForm user={editUser} onClose={handleCloseEditModal} />
                </Modal>
            </div>
        </AppContent>
    );
};

export default Users;
