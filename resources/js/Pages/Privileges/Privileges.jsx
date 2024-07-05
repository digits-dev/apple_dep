import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import TableHeader from "../../Components/Table/TableHeader";
import Row from "../../Components/Table/Row";
import RowData from "../../Components/Table/RowData";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TableButton from "../../Components/Table/Buttons/TableButton";
import RowActions from "../../Components/Table/RowActions";
import RowAction from "../../Components/Table/RowAction";


const Privileges = ({privileges, queryParams}) => {
    queryParams = queryParams || {};
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));
    const [loading, setLoading] = useState(false);

    return(
    <>
         <Head title="Privileges" />
         <AppContent>
            <ContentPanel>
                <TopPanel>
                    <TableSearch queryParams={queryParams} />
                    <PerPage queryParams={queryParams} />
                    <Link  href="create-privileges" as="button" className='bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2'>
                        <i className="fa fa-plus-circle"></i> Add Privilege
                    </Link>
                </TopPanel>
                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader name="id" queryParams={queryParams} width="sm">
                                ID
                            </TableHeader>
                            <TableHeader name="name" queryParams={queryParams} width="sm">
                                Name
                            </TableHeader>
                            <TableHeader name="super_admin" queryParams={queryParams} width="sm">
                                Super Admin
                            </TableHeader>
                            <TableHeader sortable={false} width="auto" sticky="right" justify="center">
                                Action
                            </TableHeader>
                        </Row>
                    </Thead>
                    <tbody>
                        {privileges && privileges?.data.map((item, index)=>(                            
                            <Row key={item.id}>
                               <RowData isLoading={loading}>
                                    {item.id}
                               </RowData>
                               <RowData isLoading={loading}>
                                    {item.name}
                               </RowData>
                               <RowData isLoading={loading}>
                                    {item.is_superadmin ? 'Superadmin' : 'Standard'}
                               </RowData>
                               <RowData isLoading={loading} sticky="right" width="sm" center>
                                    <RowActions>
                                    <Link  href={`edit-privileges/${item.id}`}  className='bg-primary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border px-5 py-2'>
                                        <i className="fa fa-edit"></i>
                                    </Link>
                                    </RowActions>
                                </RowData>
                            </Row>
                        ))
                        }
                    </tbody>
                </TableContainer>
            </ContentPanel>
         </AppContent>
    </>
    );
}

export default Privileges;