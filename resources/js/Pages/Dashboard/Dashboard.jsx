import React, { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";

const DashboardOverviewCard = ({ title, data, src }) => {
    return (
        <div className="flex p-5 w-full max-w-xs border rounded-lg border-gray-400 shadow-custom font-nunito-sans flex-wrap-reverse gap-y-1 justify-center">
            <div className="flex flex-col justify-center flex-1 gap-y-2">
                <p className="text-sm font-bold text-gray-600">{title}</p>
                <p className="font-extrabold text-sm md:text-[30px] ">{data}</p>
            </div>
            <div className="flex bg-overview-gradient p-3 md:p-5 rounded-lg items-center ">
                <img src={src} className="h-4 w-4 md:w-6 md:h-6" />
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { auth } = usePage().props;

    useEffect(() => {
        if (auth.user) {
            // Push a new state to the history
            window.history.pushState(
                null,
                document.title,
                window.location.href
            );

            // Add event listener to prevent back navigation
            window.addEventListener("popstate", (event) => {
                window.history.pushState(
                    null,
                    document.title,
                    window.location.href
                );
            });
        }
    }, [auth.user]);

    return (
        <>
            <Head title="Dashboard" />
            <AppContent>
                <ContentPanel marginBottom={2}>
                    <p className="font-extrabold font-nunito-sans mb-3">
                        Overview
                    </p>
                    <div className="flex flex-row gap-2 flex-wrap justify-start">
                        <DashboardOverviewCard
                            title="Customers"
                            data={"6521"}
                            src={"images/navigation/dashboard-icon.png"}
                        />
                        <DashboardOverviewCard
                            title="Orders"
                            data={"32456"}
                            src={"images/navigation/dashboard-icon.png"}
                        />
                        <DashboardOverviewCard
                            title="Devices"
                            data={"4451"}
                            src={"images/navigation/dashboard-icon.png"}
                        />
                    </div>
                </ContentPanel>
            </AppContent>
        </>
    );
};

export default Dashboard;
