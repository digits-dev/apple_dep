import React, { useState } from "react";
import TableContainer from "./TableContainer";
import JsonModal from "../../Components/Modal/JsonModal";
import Thead from "./Thead";
import Row from "./Row";
import TableHeader from "./TableHeader";
import RowData from "./RowData";
import Tbody from "../../Components/Table/Tbody";

const Tabs = ({ tabs, jsonSubmitted, jsonReceived, transactionLogs }) => {
    console.log(tabs);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [isOpen, setIsOpen] = useState(false);
    const [modalData, setModalData] = useState();
    const [title, setTitle] = useState();

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    console.log(jsonSubmitted, jsonReceived, transactionLogs);

    return (
        <div className="bg-white rounded-md mt-4 w-full font-nunito-sans">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex items-center justify-between px-4">
                    <p className="font-bold text-gray-700">JSON Logs</p>
                    <div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`whitespace-nowrap py-4 px-6 border-b-2 ${
                                    tab.id === activeTab
                                        ? "border-gray-700 text-gray-700 font-bold"
                                        : "border-transparent text-secondary hover:text-gray-900 hover:border-gray-300"
                                }`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
            <div className="px-4 py-5">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={tab.id === activeTab ? "block" : "hidden"}
                    >
                        {tab.id === 1 && (
                            <div>
                                <h2 className="mb-4 italic">Json Response</h2>
                                <TableContainer autoHeight>
                                    <Thead>
                                        <Row>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                ID
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                JSON
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                Order ID
                                            </TableHeader>
                                        </Row>
                                    </Thead>
                                    <Tbody data={jsonReceived}>
                                        {jsonReceived.map((json) => {
                                            let parsedData;

                                            try {
                                                parsedData = JSON.parse(
                                                    json.data
                                                );
                                            } catch (error) {
                                                console.error(
                                                    "Failed to parse JSON:",
                                                    error
                                                );
                                                parsedData = json.data;
                                            }

                                            return (
                                                <Row key={json.id}>
                                                    <RowData center>
                                                        {json.id}
                                                    </RowData>
                                                    <RowData center>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={() => {
                                                                openModal();
                                                                setModalData(
                                                                    json.data
                                                                );
                                                                setTitle(
                                                                    "JSON Response Received"
                                                                );
                                                            }}
                                                        >
                                                            Open JSON
                                                        </button>
                                                    </RowData>
                                                    <RowData center>
                                                        {json.order_id}
                                                    </RowData>
                                                </Row>
                                            );
                                        })}
                                    </Tbody>
                                </TableContainer>
                            </div>
                        )}
                        {tab.id === 2 && (
                            <div>
                                <h2 className="mb-4 italic">Json Request</h2>
                                <TableContainer autoHeight>
                                    <Thead>
                                        <Row>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                ID
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                JSON
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                Order ID
                                            </TableHeader>
                                        </Row>
                                    </Thead>
                                    <Tbody data={jsonSubmitted}>
                                        {jsonSubmitted.map((json) => {
                                            return (
                                                <Row key={json.id}>
                                                    <RowData center>
                                                        {json.id}
                                                    </RowData>
                                                    {/* <RowData>
                                                        <pre>
                                                            {JSON.stringify(
                                                                parsedData,
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    </RowData> */}
                                                    <RowData center>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={() => {
                                                                openModal();
                                                                setModalData(
                                                                    json.data
                                                                );
                                                                setTitle(
                                                                    "JSON Request Submitted"
                                                                );
                                                            }}
                                                        >
                                                            Open JSON
                                                        </button>
                                                    </RowData>
                                                    <RowData center>
                                                        {json.order_id}
                                                    </RowData>
                                                </Row>
                                            );
                                        })}
                                    </Tbody>
                                </TableContainer>
                            </div>
                        )}
                        {tab.id === 3 && (
                            <div>
                                <h2 className="mb-4 italic">
                                    Transaction Logs
                                </h2>
                                <TableContainer autoHeight>
                                    <Thead>
                                        <Row>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                Transaction ID
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                Order Type
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                DEP Status
                                            </TableHeader>
                                            <TableHeader
                                                sortable={false}
                                                justify="center"
                                            >
                                                Created Date
                                            </TableHeader>
                                        </Row>
                                    </Thead>

                                    <Tbody data={transactionLogs}>
                                        {transactionLogs.map((json) => (
                                            <Row key={json.id}>
                                                <RowData center>
                                                    {json.dep_transaction_id}
                                                </RowData>
                                                <RowData center>
                                                    {json.order_type}
                                                </RowData>
                                                <RowData center>
                                                    {json.dep_status}
                                                </RowData>
                                                <RowData center>
                                                    {json.created_at}
                                                </RowData>
                                            </Row>
                                        ))}
                                    </Tbody>
                                </TableContainer>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <JsonModal
                show={isOpen}
                onClose={closeModal}
                title={title}
                modalData={modalData}
            ></JsonModal>
        </div>
    );
};

export default Tabs;
