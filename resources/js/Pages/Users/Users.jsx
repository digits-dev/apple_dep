import { Link, usePage, useForm, router  } from "@inertiajs/react";
import React, { useEffect, useState, useContext } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import Modal from "../../Components/Modal/Modal";
import DropdownSelect from "../../Components/Dropdown/Dropdown";
const Users = ({users, options}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options);
    // CREATE USERS
    const handleCreate = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const CreateUserForm = ({ onClose }) => {
        const { data, setData, post, reset, errors } = useForm({
            name: '',
            email: '',
            privilege_id: '',
            password: ''
        });
    
        const handleSubmit = (e) => {
            e.preventDefault();
            post('create-user', {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        };
    
        return (
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-1 w-full">
                    <label className="font-nunito-sans font-semibold">Name</label>
                    <input type="text" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <div>{errors.name}</div>}
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Email</label>
                    <input type="email" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={data.email} onChange={e => setData('email', e.target.value)} />
                    {errors.email && <div>{errors.email}</div>}
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Privileges</label>
                    <DropdownSelect options={options} value={selectedOption} onChange={e => setData('privilege_id', e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="font-nunito-sans font-semibold">Password</label>
                    <input type="password" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={data.password} onChange={e => setData('password', e.target.value)} />
                    {errors.password && <div>{errors.password}</div>}
                </div>
                <button className="bg-black w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] mt-5 hover:opacity-70" type="submit">Create</button>
            </form>
        );
    };

    return (
        <AppContent>
            <div className="md:bg-black sm:bg-yellow-500">
             
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
