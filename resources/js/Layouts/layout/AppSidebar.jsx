import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import axios from 'axios';

const AppSidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };

    const [links, setLinks] = useState([]);

    useEffect(() => {
        axios.get('/sidebar')
            .then(response => {
                setLinks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the sidebar data!', error);
            });
    }, []);

    return (
         <div className="sidebar">
            <ul>
                <li><Link href="dashboard">Dashboard</Link></li>
                {links.map((menu, index) => (
                <li key={index}>
                    {menu.children ? (
                    <>
                        <div onClick={() => toggleMenu(index)}>
                        {menu.name}
                        </div>
                        <ul className={`submenu ${openMenu === index ? 'open' : ''}`}>
                        {menu.children.map((submenu, subIndex) => (
                            <li key={subIndex}>
                            <Link href={submenu.url}>{submenu.name}</Link>
                            </li>
                        ))}
                        </ul>
                    </>
                    ) : (
                    <Link href={menu.url}>{menu.name}</Link>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
};

export default AppSidebar;