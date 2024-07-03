import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import TableHeader from "../../Components/Table/TableHeader";
import Row from "../../Components/Table/Row";
import RowData from "../../Components/Table/RowData";


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