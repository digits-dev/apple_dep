import React, { useContext, useEffect, useState } from "react";

const AppFooter = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    return (
        <div className="layout-footer p-[10px] px-5 flex justify-between select-none">
            <div className="font-nunito-sans text-[12px] font-semibold">
                Copyright © {currentYear}. All Rights Reserved
            </div>
            <div className="font-nunito-sans text-[12px] font-semibold">
                Powered by Digits
            </div>
        </div>
    );
};

export default AppFooter;
