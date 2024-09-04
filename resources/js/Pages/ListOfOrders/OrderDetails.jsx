import { Head, Link } from "@inertiajs/react";
import React from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import { useContext } from "react";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import RowData from "../../Components/Table/RowData";
import { useEffect } from "react";
import Tabs from "../../Components/Table/Tabs";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Tbody from "../../Components/Table/Tbody";

const OrderDetails = ({
    order,
    orderLines,
    jsonSubmitted,
    jsonReceived,
    transactionLogs,
}) => {
    const { setTitle } = useContext(NavbarContext);

    useEffect(() => {
        setTitle("Order Details");
    }, []);

    const tabs = [
        { id: 1, label: "JSON Response Received" },
        { id: 2, label: "JSON Request Submitted" },
        { id: 3, label: "Transaction Logs" },
    ];

    return (
        <>
            <Head title="Order Details" />
            <ContentPanel>
                <div className="flex justify-between items-start  text-gray-800 mb-8">
                    <div className="flex gap-10 ">
                        <div className="font-bold">
                            <p>Customer:</p>
                            <p>Sales Order #:</p>
                            <p>Order Ref #:</p>
                            <p>Order Date:</p>
                        </div>
                        <div className="font-medium">
                            <p>{order?.customer?.customer_name}</p>
                            <p>{order.sales_order_no}</p>
                            <p>{order.order_ref_no}</p>
                            <p>{order.order_date}</p>
                        </div>
                    </div>

                    <Link
                        href="/list_of_orders"
                        as="button"
                        className="bg-primary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80"
                    >
                        Back
                    </Link>
                </div>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader>Item Code</TableHeader>
                            <TableHeader>Item Description</TableHeader>
                            <TableHeader>Serial Number</TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={orderLines}>
                        {orderLines.map((order) => (
                            <Row key={order.id}>
                                <RowData>{order.digits_code}</RowData>
                                <RowData>{order.item_description}</RowData>
                                <RowData>{order.serial_number}</RowData>
                            </Row>
                        ))}
                    </Tbody>
                </TableContainer>
            </ContentPanel>

            <Tabs
                tabs={tabs}
                jsonSubmitted={jsonSubmitted}
                jsonReceived={jsonReceived}
                transactionLogs={transactionLogs}
            />
        </>
    );
};

export default OrderDetails;
