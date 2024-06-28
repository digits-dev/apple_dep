import React from "react";

const TableContainer = ({children}) => {
    return (
        <div className="w-full overflow-hidden mb-5 border border-secondary rounded-lg text-secondary ">
            <div className="w-full overflow-y-hidden overflow-x-auto">
                <table className="w-full relative">
                    {children}
                </table>
            </div>
        </div>
    );
};

export default TableContainer;
