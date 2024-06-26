import React, { useContext } from "react";

const AppFooter = () => {
    return (
        <div className="layout-footer p-[10px] px-5 flex justify-between">
            <div className="font-nunito-sans text-[12px] font-semibold">
                Copyright © 2024. All Rights Reserved
            </div>
            <div className="font-nunito-sans text-[12px] font-semibold">
                Powered by Digits
            </div>
        </div>
    );
};

export default AppFooter;
