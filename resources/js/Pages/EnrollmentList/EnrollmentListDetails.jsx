import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head } from "@inertiajs/react";
import Button from "../../Components/Table/Buttons/Button";
import axios from "axios";

const EnrollmentListDetails = ({ enrollmentList }) => {
    const { setTitle } = useContext(NavbarContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Enrollment List - Details");
        }, 5);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(
                `/enrollment_list/${enrollmentList.transaction_id}/check_status`
            );
            setData(response.data.message.original.orders[0].deliveries);
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

    console.log(data);

    return (
        <>
            <Head title="Enrollment List - Details" />
            <ContentPanel>
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
                        <p>{enrollmentList.dep_status}</p>
                        <p>{enrollmentList.status_message}</p>
                        <p>{enrollmentList.enrollment_status}</p>
                        <p>{enrollmentList.created_at}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="link" href="/enrollment_list">
                        Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Checking..." : "Check Transaction Status"}
                    </Button>
                </div>
                {data ??
                    data?.map((item) => {
                        <p>{item.deliveryNumber}</p>;
                    })}
            </ContentPanel>
        </>
    );
};

export default EnrollmentListDetails;
