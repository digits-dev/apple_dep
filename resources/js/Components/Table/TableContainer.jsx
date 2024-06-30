import React from "react";

const TableContainer = ({children}) => {
    return (
         <div className="w-full overflow-hidden mb-5 border border-secondary rounded-lg text-secondary ">
                <div className="w-full h-[500px] overflow-auto">
                    <table className="w-full ">
                    {children}
                </table>
            </div>
        </div>
    );
};

export default TableContainer;
