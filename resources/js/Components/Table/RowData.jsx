import React from "react";

const RowData = ({ children, sticky, center, isLoading }) => {
    const stickyClass = {
        left: "sticky left-0 top-0 z-40 after:absolute after:top-0 after:right-0 after:z-40  after:h-full after:w-[0.60px] after:bg-secondary bg-white",
        right: "sticky right-0 top-0 z-40 before:absolute before:top-0 before:left-0  before:z-40  before:h-full before:w-[0.60px] before:bg-secondary bg-white",
    }[sticky];

    return (
        <td
            className={`px-5 py-3 bg-white  ${stickyClass} ${
                center && "text-center"
            }`}
        >
            {isLoading ? (
                <span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200 ">
                    &nbsp;&nbsp;
                </span>
            ) : (
                children
            )}
        </td>
    );
};

export default RowData;
