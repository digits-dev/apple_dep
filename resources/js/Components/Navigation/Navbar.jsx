import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const Navbar = () => {
    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post('logout');
    };

    return (
        <nav>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li>
                    <form onSubmit={handleLogout}>
                        <button type="submit">Logout</button>
                    </form>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;