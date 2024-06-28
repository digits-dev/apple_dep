import React, { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import AppContent from "../../Layouts/layout/AppContent";

const ListOfOrders = () => {
    const { auth } = usePage().props;

    return (
        <AppContent>
            <span>This is List of orders</span>
        </AppContent>
    );
};

export default ListOfOrders;
