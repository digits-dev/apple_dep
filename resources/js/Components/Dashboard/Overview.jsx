import React from "react";
import ContentPanel from "../Table/ContentPanel";
import { Link } from "@inertiajs/react";

const DashboardOverviewCard = ({ title, data, src, url }) => {
    return (
        <Link
            href={url}
            className="flex p-5 w-full border rounded-lg border-gray-400 shadow-custom font-nunito-sans flex-wrap-reverse gap-y-1 justify-center"
        >
            <div className="flex flex-col justify-center flex-1 gap-y-2">
                <p className="text-sm font-bold text-gray-600">{title}</p>
                <p className="font-extrabold text-sm md:text-[30px] ">{data}</p>
            </div>
            <div className="flex bg-overview-gradient p-3 md:p-5 rounded-lg items-center ">
                <img src={src} className="h-4 w-4 md:w-6 md:h-6" />
            </div>
        </Link>
    );
};

const Overview = ({ customer, orders, devices }) => {
    return (
        <>
            <ContentPanel marginBottom={2}>
                <p className="font-extrabold font-nunito-sans mb-3">Overview</p>
                <div className="flex flex-col md:flex-row gap-2 justify-center md:justify-start">
                    <DashboardOverviewCard
                        title="Customers"
                        data={customer}
                        src={"images/navigation/user-management-icon.png"}
                        url={"/customer"}
                    />
                    <DashboardOverviewCard
                        title="Orders"
                        data={orders}
                        src={"images/navigation/order-icon.png"}
                        url={"/list_of_orders"}
                    />
                    <DashboardOverviewCard
                        title="DEP Devices"
                        data={devices}
                        src={"images/navigation/device-icon.png"}
                        url={"/dep_devices"}
                    />
                </div>
            </ContentPanel>
        </>
    );
};

export default Overview;
