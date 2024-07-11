import React, { useState, useRef, useEffect } from 'react';
import TableButton from './TableButton';

const BulkActions = ({ actions, onActionSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen); 
    };

    const handleButtonMouseDown = (event) => {
        event.stopPropagation();
    };
    
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

    const handleActionClick = (action) => {
        setIsOpen(false);
        if (onActionSelected) {
            onActionSelected(action);
        }
    };

    return (
        <div className="relative cursor-pointer">
        <TableButton onClick={toggleDropdown} onMouseDown={handleButtonMouseDown}>
            <i className="fa fa-check-square mr-2"></i> Bulk Actions
        </TableButton>
        {isOpen && (
            <ul className="absolute top-full left-0 min-w-[160px] max-h-[200px] overflow-y-auto p-0 m-0 shadow-lg z-[100] rounded-lg" ref={dropdownRef}>
            {actions.map((action, index) => (
                 <li 
                    key={index} 
                    onClick={() => handleActionClick(action.value)}
                    className="px-5 py-2 cursor-pointer bg-gray-100 hover:bg-gray-300"
                    >
                 {action.label}
               </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default BulkActions;
