import React, { useRef } from "react";
import { router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";

const TestTable = ({ users, queryParams }) => {
    queryParams = queryParams || {};

    return (
      
    <>
            <TableSearch queryParams={queryParams}/>
            <PerPage queryParams={queryParams}/>

            <table className="w-full">
                <thead>
                    <tr>
                        <TableHeader
                            name="name"
                            queryParams={queryParams}
                        >
                            Name
                        </TableHeader>

                        <TableHeader
                            name="email"
                            queryParams={queryParams}
                        >
                            Email
                        </TableHeader>

                        <TableHeader sortable={false}>Action</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {users &&
                        users.data.map((item) => (
                            <tr key={item.id}>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.email}</td>
                                <td className="p-2">
                                    <button type="button">Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Pagination paginate={users} />
            </>
       
    );
};

export default TestTable;
