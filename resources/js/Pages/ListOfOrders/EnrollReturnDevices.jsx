import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
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
import RowAction from "../../Components/Table/RowAction";
import TableButton from "../../Components/Table/Buttons/TableButton";
import Modal from "../../Components/Modal/Modal";

const EnrollReturnDevices = ({ order }) => {
    const { setTitle } = useContext(NavbarContext);
    const [showModal, setShowModal] = useState(false);
    const [orderPath, setOrderPath] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enroll/Return Devices");
        }, 50);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const EnrollReturnDeviceActions = () => {
        return (
            <div className="flex flex-col gap-y-3 py-2 text-white font-nunito-sans font-bold">
                <Link
                    className="bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70"
                    href="#"
                >
                    Enroll Device
                </Link>
                <Link
                    className="bg-black flex-1 p-5 rounded-lg text-center hover:opacity-70"
                    href="#"
                >
                    Return Device
                </Link>
            </div>
        );
    };

    return (
        <>
            <Head title="Enroll/Return Devices" />
            <AppContent>
                <ContentPanel>
                    <div className="flex justify-between items-start text-gray-800 mb-8">
                        <div className="flex gap-10">
                            <div className="font-bold">
                                <p>Customer:</p>
                                <p>Sales Order #:</p>
                                <p>Order Ref #:</p>
                                <p>Order Date:</p>
                            </div>
                            <div className="font-medium">
                                <p>{order.customer_name}</p>
                                <p>{order.sales_order_no}</p>
                                <p>{order.order_ref_no}</p>
                                <p>{order.order_date}</p>
                            </div>
                        </div>

                        <Link href="/list_of_orders" as="button">
                            <TableButton>Back</TableButton>
                        </Link>
                    </div>

                    <TableContainer>
                        <Thead>
                            <Row>
                                <TableHeader>Item Code</TableHeader>
                                <TableHeader>Item Description</TableHeader>
                                <TableHeader>Serial Number</TableHeader>
                                <TableHeader>Enrollment Status</TableHeader>
                                <TableHeader sortable={false} justify="center">
                                    Action
                                </TableHeader>
                            </Row>
                        </Thead>
                        <tbody>
                            <Row>
                                <RowData>80000001</RowData>
                                <RowData>
                                    APP UNIT IPHONE 15 SPACE GREY 256GB
                                </RowData>
                                <RowData>C231323</RowData>
                                <RowData>Complete</RowData>
                                <RowData center>
                                    <RowAction
                                        action="add"
                                        type="button"
                                        onClick={handleOpenModal}
                                    />
                                </RowData>
                            </Row>
                        </tbody>
                    </TableContainer>
                </ContentPanel>
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    title="Actions"
                >
                    <EnrollReturnDeviceActions />
                </Modal>
            </AppContent>
        </>
    );
};

export default EnrollReturnDevices;