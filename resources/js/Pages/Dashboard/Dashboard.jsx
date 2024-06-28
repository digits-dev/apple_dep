import React, { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import AppContent from "../../Layouts/layout/AppContent";

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
        <AppContent>
            <span>This is Dashboard</span>
        </AppContent>
    );
};

export default Dashboard;
