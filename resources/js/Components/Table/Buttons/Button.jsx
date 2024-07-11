import { Link } from "@inertiajs/react";
import React from "react";

const Button = ({
    children,
    onClick,
    disabled,
    extendClass,
    type = "button",
    href,
}) => {
    return (
        <>
            {type == "button" ? (
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={`bg-primary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 ${extendClass}`}
                >
                    {children}
                </button>
            ) : (
                <Link
                    href={href}
                    className={`bg-primary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 ${extendClass}`}
                >
                    {children}
                </Link>
            )}
        </>
    );
};

export default Button;
