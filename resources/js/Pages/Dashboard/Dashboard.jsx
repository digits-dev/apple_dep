import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import Overview from "../../Components/Dashboard/Overview";
import Orders from "../../Components/Dashboard/Orders";
import { useNavbarContext } from "../../Context/NavbarContext";

const Dashboard = ({ customer, orders, devices, orders_count_wdate }) => {
    const { auth } = usePage().props;

    const { setTitle } = useNavbarContext();

    useEffect(() => {
        setTimeout(() => {
            setTitle("Dashboard");
        }, 5);
    }, []);

    useEffect(() => {
        if (auth.user) {
            window.history.pushState(
                null,
                document.title,
                window.location.href
            );

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
            <Overview
                customer={customer}
                orders={orders}
                devices={devices}
            />
            <Orders orders_count_wdate={orders_count_wdate} />
        </>
    );
};

export default Dashboard;
