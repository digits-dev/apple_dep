import React, { createContext, useState, useEffect } from "react";

export const NavbarContext = createContext();

const capitalizeWords = (str) => {
    const smallWords = [
        "a",
        "an",
        "and",
        "as",
        "at",
        "but",
        "by",
        "for",
        "if",
        "in",
        "nor",
        "of",
        "on",
        "or",
        "so",
        "the",
        "to",
        "up",
        "yet",
    ];

    return str
        .split("_")
        .map((word, index) => {
            if (index === 0 && word === word.toUpperCase()) {
                return word;
            } else if (!smallWords.includes(word.toLowerCase())) {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            } else {
                return word.toLowerCase();
            }
        })
        .join(" ");
};

const formatPathname = (pathname) => {
    const segments = pathname.split("/");
    const lastSegment = segments.pop() || segments.pop();
    return capitalizeWords(lastSegment);
};

export const NavbarProvider = ({ children }) => {
    const [title, setTitle] = useState(
        formatPathname(window.location.pathname)
    );

    return (
        <NavbarContext.Provider value={{ title, setTitle }}>
            {children}
        </NavbarContext.Provider>
    );
};
