import React, { useState, useRef, useEffect } from 'react';
import TableButton from './TableButton';

const BulkActions = ({ actions, onActionSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleActionClick = (action) => {
        setIsOpen(false);
        if (onActionSelected) {
            onActionSelected(action);
        }
    };

    return (
        <div className="bulk-actions ">
        <TableButton className="bulk-header" onClick={toggleDropdown}>
            <i className="fa fa-check-square mr-2"></i> Bulk Actions
        </TableButton>
        {isOpen && (
            <ul className="bulk-list" ref={dropdownRef}>
            {actions.map((action, index) => (
                 <li key={index} onClick={() => handleActionClick(action.value)}>
                 {action.label}
               </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default BulkActions;
