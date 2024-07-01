import { Link, usePage, useForm, router  } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import Modal from "../../Components/Modal/Modal";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
import axios from "axios";

const Users = ({users, options}) => {
    // const { base_url } = usePage().props;
    console.log(window.location.hostname);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options);
    const [successMessage, setSuccessMessage] = useState('');

    // CREATE USERS
    const handleCreate = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

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
                    <DropdownSelect defaultSelect="Select a Privilege" name="privilege_id" options={options} value={forms.privilege_id} onChange={handleChange} />
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
                {/* {successMessage && <div className="success-message">{successMessage}</div>} */}
            </form>
        );
    };

    return (
        <AppContent>
            <div>
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                <button className="bg-black hover:bg-black-600 text-white text-sm font-bold rounded px-3 py-2 mr-1" onClick={handleCreate}>Create User</button>
                <button className="bg-black hover:bg-black-600 text-white text-sm font-bold rounded px-3 py-2" onClick={handleCreate}>Bulk Actions</button>
                
                <hr/>
                  <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Privilege Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{user.user_name}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Modal show={showCreateModal} onClose={handleCloseCreateModal}>
                    <CreateUserForm onClose={handleCloseCreateModal} />
                </Modal>
            </div>
        </AppContent>
    );
};

export default Users;
