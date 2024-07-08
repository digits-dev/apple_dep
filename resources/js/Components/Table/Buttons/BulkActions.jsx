import React, { useState } from 'react';
import TableButton from './TableButton';

const BulkActions = ({ actions, onActionSelected }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleActionClick = (action) => {
        setIsOpen(false); // Close dropdown after selection
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
            <ul className="bulk-list">
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
