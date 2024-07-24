import React from "react";

const Row = ({ children }) => {
    return (
        <tr
            className={`text-sm has-[th]:border-none relative`}
        >
            {children}
        </tr>
    );
};

export default Row;
