import React, { useEffect, useState } from "react";
import { useNavbarContext } from "../../Context/NavbarContext";
import { Head } from "@inertiajs/react";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import TableSearch from "../../Components/Table/TableSearch";
import PerPage from "../../Components/Table/PerPage";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import Tbody from "../../Components/Table/Tbody";
import RowData from "../../Components/Table/RowData";
import Pagination from "../../Components/Table/Pagination";
import moment from "moment";
import RowAction from "../../Components/Table/RowAction";
import RowActions from "../../Components/Table/RowActions";
import Button from "../../Components/Table/Buttons/Button";

const NotificationManagement = ({notification, queryParams}) => {
  const { setTitle } = useNavbarContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
            setTitle("Notification Management");
        }, 5);
    }, []);
  
  return (
    <>
      <Head title="Notification Management" />
      <ContentPanel>
        <TopPanel>
            <TableSearch queryParams={queryParams} placeholder='Search Title' />
            <PerPage queryParams={queryParams} />
            <Button type="btn" href="/notif_manager/add">Create Notification</Button>
        </TopPanel>
        <TableContainer>
          <Thead>
            <Row>
              <TableHeader
                  name="title"
                  queryParams={queryParams}
                  width="md"
              >
                  Title
              </TableHeader>
              <TableHeader
                  name="notif_type"
                  queryParams={queryParams}
                  width="md"
              >
                  Type
              </TableHeader>
              <TableHeader
                  name="created_by"
                  queryParams={queryParams}
                  width="md"
              >
                  Created By
              </TableHeader>
              <TableHeader
                  name="created_at"
                  queryParams={queryParams}
                  width="md"
              >
                  Date Created
              </TableHeader> 
              <TableHeader
								sortable={false}
								width="auto"
                                justify="center"
							>
								Action
							</TableHeader>
            </Row>
          </Thead>
          <Tbody data={notification.data}>
            {notification &&
              notification.data.map((item) => (
                <Row key={item.id}>
                <RowData isLoading={loading}>
                    {item.title}
                </RowData>
                <RowData isLoading={loading}>
                    {item.notif_type}
                </RowData>
                <RowData isLoading={loading}>
                    {item.user?.name}
                </RowData>
                <RowData isLoading={loading}>
                    {moment(item.created_at).format(
                        "YYYY-MM-DD"
                    )}
                </RowData>
                <RowData center>
                  <RowActions>
                    <RowAction
                        href={`/notif_manager/edit/${item.id}`}
                        action="edit"
                        size="md"
                        tooltipContent="Edit"
                    />
                  </RowActions>
                </RowData>
                </Row>
              ))
            }
          </Tbody>
        </TableContainer>
        <Pagination paginate={notification}/>
      </ContentPanel>
    </>
  )
}

export default NotificationManagement