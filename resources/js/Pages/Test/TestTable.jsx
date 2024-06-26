import React from "react";
import { router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import TableHeader from "../../Components/Table/TableHeader";
import Pagination from "../../Components/Table/Pagination";

const TestTable = ({ users, queryParams }) => {
    queryParams = queryParams || {};

    const sortChanged = (name) => {
        if (name === queryParams.sortBy) {
            queryParams.sortDir =
                queryParams.sortDir === "asc" ? "desc" : "asc";
        } else {
            queryParams.sortBy = name;
            queryParams.sortDir = "asc";
        }
        router.get("/table", queryParams);
    };

    return (
        <Layout>
            <table className="w-full">
                <thead>
                    <tr>
                        <TableHeader
                            name="name"
                            sort_field={queryParams?.sortBy}
                            sort_direction={queryParams?.sortDir}
                            sortChanged={sortChanged}
                        >
                            Name
                        </TableHeader>

                        <TableHeader
                            name="email"
                            sort_field={queryParams?.sortBy}
                            sort_direction={queryParams?.sortDir}
                            sortChanged={sortChanged}
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
                                    <button
                                        type="button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Pagination paginate={users} />
        </Layout>
    );
};

export default TestTable;
