import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head } from "@inertiajs/react";
import Button from "../../Components/Table/Buttons/Button";
import TableContainer from "../../Components/Table/TableContainer";
import axios from "axios";
import Thead from "../../Components/Table/Thead";
import TableHeader from "../../Components/Table/TableHeader";
import Row from "../../Components/Table/Row";
import RowData from "../../Components/Table/RowData";
import Tbody from "../../Components/Table/Tbody";
import moment from "moment";

const EnrollmentListDetails = ({ enrollmentList }) => {
    const { setTitle } = useContext(NavbarContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enrollment List - Details");
        }, 5);
    }, []);

    useEffect(() => {
    }, [enrollmentList]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(
                `/enrollment_list/${enrollmentList.transaction_id}/check_status`
            );
            setData(response.data.message.original);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error("Validation error:", error.response.data);
            } else {
                console.error("An error occurred:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Enrollment List - Details" />
            <ContentPanel marginBottom={2}>
                <div className="mb-10 flex gap-5">
                    <div className="font-nunito-sans font-extrabold">
                        <p>Sales Order #:</p>
                        <p>Item Code:</p>
                        <p>Serial Number:</p>
                        <p>Transaction ID:</p>
                        <p>DEP Status:</p>
                        <p>Status Message:</p>
                        <p>Enrollment Status:</p>
                        <p>Created Date:</p>
                    </div>
                    <div className="font-nunito-sans">
                        <p>{enrollmentList.sales_order_no}</p>
                        <p>{enrollmentList.item_code}</p>
                        <p>{enrollmentList.serial_number}</p>
                        <p>{enrollmentList.transaction_id}</p>
                        <p>{enrollmentList.d_status.dep_status}</p>
                        <p>{enrollmentList.status_message}</p>
                        <p>{enrollmentList.e_status.enrollment_status}</p>
                        <p>
                            {moment(enrollmentList.created_at).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="link" href="/enrollment_list">
                        Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={data}>
                        {loading ? "Checking..." : "Check Transaction Status"}
                    </Button>
                </div>
            </ContentPanel>

            {data && (
                <ContentPanel>
                    <div className="font-nunito-sans font-extrabold text-lg mb-1">
                        Transaction Status
                    </div>
                    <div className="font-nunito-sans mb-2">
                        <div>
                            <span className="font-bold">
                                Device Enrollment Transaction Id:
                            </span>{" "}
                            {data.deviceEnrollmentTransactionID}
                        </div>
                        <div>
                            <span className="font-bold">Completed Date:</span>{" "}
                            {moment(data.completedOn).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                        </div>
                        <div>
                            <span className="font-bold">Status Code:</span>{" "}
                            <span
                                className={`${
                                    data.statusCode == "COMPLETE"
                                        ? "text-green-500"
                                        : "text-red-500"
                                } font-extrabold`}
                            >
                                {data.statusCode}
                            </span>
                        </div>
                    </div>
                    <div className="font-nunito-sans">
                        {data &&
                            data?.orders?.map((order, orderIndex) => (
                                <div key={orderIndex}>
                                    <div className="font-nunito-sans font-extrabold text-lg mb-1">
                                        Order Details
                                    </div>
                                    <div className="font-nunito-sans">
                                        <span className="font-bold">
                                            Order Number:
                                        </span>{" "}
                                        {order.orderNumber}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Order Post Status:
                                        </span>{" "}
                                        <span
                                            className={`${
                                                order.orderPostStatus ==
                                                "COMPLETE"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            } font-extrabold`}
                                        >
                                            {order.orderPostStatus}
                                        </span>
                                    </div>
                                    {order.deliveries &&
                                    order.deliveries.length > 0 ? (
                                        <div className="mt-2">
                                            {order.deliveries.map(
                                                (delivery, deliveryIndex) => (
                                                    <div key={deliveryIndex}>
                                                        <div className="font-nunito-sans font-extrabold text-lg">
                                                            Delivery Details
                                                        </div>
                                                        <div className="font-nunito-sans">
                                                            <span className="font-bold">
                                                                Delivery Number:
                                                            </span>{" "}
                                                            {
                                                                delivery.deliveryNumber
                                                            }
                                                        </div>
                                                        <div>
                                                            <span className="font-bold">
                                                                Delivery Post
                                                                Status:
                                                            </span>{" "}
                                                            <span
                                                                className={`${
                                                                    delivery.deliveryPostStatus ==
                                                                    "COMPLETE"
                                                                        ? "text-green-500"
                                                                        : "text-red-500"
                                                                } font-extrabold`}
                                                            >
                                                                {
                                                                    delivery.deliveryPostStatus
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-nunito-sans font-extrabold text-lg my-2">
                                                                Devices
                                                            </div>
                                                            <TableContainer
                                                                autoHeight
                                                            >
                                                                <Thead>
                                                                    <Row>
                                                                        <TableHeader
                                                                            width="md"
                                                                            justify="center"
                                                                            sortable={
                                                                                false
                                                                            }
                                                                        >
                                                                            Order
                                                                        </TableHeader>
                                                                        <TableHeader
                                                                            width="md"
                                                                            justify="center"
                                                                            sortable={
                                                                                false
                                                                            }
                                                                        >
                                                                            Device
                                                                            Id
                                                                        </TableHeader>
                                                                        <TableHeader
                                                                            width="md"
                                                                            justify="center"
                                                                            sortable={
                                                                                false
                                                                            }
                                                                        >
                                                                            Post
                                                                            Status
                                                                        </TableHeader>
                                                                    </Row>
                                                                </Thead>

                                                                <Tbody
                                                                    data={
                                                                        delivery.devices
                                                                    }
                                                                >
                                                                    {delivery.devices.map(
                                                                        (
                                                                            device,
                                                                            deviceIndex
                                                                        ) => (
                                                                            <Row>
                                                                                <RowData
                                                                                    center
                                                                                >
                                                                                    {deviceIndex +
                                                                                        1}
                                                                                </RowData>
                                                                                <RowData
                                                                                    center
                                                                                >
                                                                                    {
                                                                                        device.deviceId
                                                                                    }
                                                                                </RowData>
                                                                                <RowData
                                                                                    center
                                                                                >
                                                                                    {
                                                                                        device.devicePostStatus
                                                                                    }
                                                                                </RowData>
                                                                            </Row>
                                                                        )
                                                                    )}
                                                                </Tbody>
                                                            </TableContainer>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="font-nunito-sans mb-1">
                                                <span className="font-bold">
                                                    Order Post Status Message:
                                                </span>{" "}
                                                {order.orderPostStatusMessage}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </ContentPanel>
            )}
        </>
    );
};

export default EnrollmentListDetails;
