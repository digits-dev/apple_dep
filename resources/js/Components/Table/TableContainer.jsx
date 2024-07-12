import React from "react";

const TableContainer = ({children, autoHeight}) => {
    return (
         <div className="w-full overflow-hidden relative  border border-secondary rounded-lg text-secondary ">
                <div className={`w-full ${autoHeight ? 'min-h-[100px] max-h-[500px]' : 'h-[500px]'} overflow-auto`}>
                    <table className="w-full ">
                    {children}
                </table>
            </div>
        </div>
    );
};

export default TableContainer;
