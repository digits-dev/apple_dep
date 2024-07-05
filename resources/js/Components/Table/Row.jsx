import React from "react";

const Row = ({ children }) => {
    return (
        <tr
            className={`border-b-[0.60px] border-secondary text-sm has-[th]:border-none`}
        >
            {children}
        </tr>
    );
};

export default Row;
