import React from 'react';
import { router } from "@inertiajs/react";


const AppNavbar = () => {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post("logout");
    };

    return (
        <nav>
            <ul>
                <li><a href="/dashboard">Apple Dev</a></li>
                <li>
                    <form onSubmit={handleLogout}>
                        <button type="submit">Logout</button>
                    </form>
                </li>
            </ul>
        </nav>
    );
};

export default AppNavbar;