import React, { useRef } from "react";
import { router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
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
import Filters from "../../Components/Table/Buttons/Filters";
import TableButton from "../../Components/Table/Buttons/TableButton";



const TestTable = ({ users, queryParams }) => {
    queryParams = queryParams || {};

    return (
      
    <>
        <TopPanel>
            <TableSearch queryParams={queryParams}/>
            <PerPage queryParams={queryParams}/>
            <Import/>
            <Export/>
            <Filters/>
            {/* <TableButton>Add Customer</TableButton>
            <TableButton>Add Action</TableButton>
            <TableButton>Add Status</TableButton> */}
            
    
        </TopPanel>

        <ContentPanel>

            <div className="w-full overflow-hidden mb-5 border border-secondary rounded-lg text-secondary ">
                <div className="w-full overflow-y-hidden overflow-x-auto">
                    <table className="w-full relative">
                        <thead >
                            <tr>
                                <TableHeader
                                    name="id"
                                    queryParams={queryParams}
                                    width="sm"
                                    stickyLeftOrder="first"
                                >
                                    Id
                                </TableHeader>

                                <TableHeader
                                    name="name"
                                    queryParams={queryParams}
                                    width="md"
                                >
                                    Name
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                    width="md"
                                >
                                    Email
                                </TableHeader>
                                
                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                >
                                    Email
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                >
                                    Email
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                 
                                >
                                    Email
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                >
                                    Email
                                </TableHeader>

                                <TableHeader
                                    name="email"
                                    queryParams={queryParams}
                                    width="lg"
                                >
                                    Email
                                </TableHeader>

                                <TableHeader  
                                    name="status"
                                    queryParams={queryParams} 
                                    justify="center"
                                    width="sm"
                                    stickyRightOrder="second"
                                >
                                    Status
                                </TableHeader>
                                <TableHeader 
                                    sortable={false}
                                    stickyRightOrder="first"
                                    width="md"
                                >
                                    Action
                                </TableHeader>
                            </tr>
                        </thead>

                        <tbody>
                            {users &&
                                users.data.map((item) => (
                                    <Row key={item.name + item.id}>
                                        <RowData 
                                            stickyLeftOrder="first"
                                        >
                                            {item.id}
                                        </RowData>       

                                        <RowData>{item.name}</RowData>       
                                        <RowData>{item.email}</RowData>
                                        <RowData>{item.email}</RowData>
                                        <RowData>{item.email}</RowData>
                                        <RowData >{item.email}</RowData>
                                        <RowData>{item.email}</RowData>
                                        <RowData>{item.email}</RowData>

                                        <RowStatus 
                                            stickyRightOrder="second"
                                            status={item.status ? "success" : "error" }
                                        >
                                            {item.status ? "Success" : "Error"}
                                        </RowStatus>
                                        
                                        <RowData 
                                            stickyRightOrder="first"
                                        >
                                            <RowAction action="view" size="md" />
                                            <RowAction action="edit" size="md" />
                                            <RowAction action="add" size="md" />
                                        </RowData>
                                    </Row>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination paginate={users} />
          
        </ContentPanel>
    </>
    );
};

export default TestTable;
