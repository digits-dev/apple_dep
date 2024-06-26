import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from '@inertiajs/react'
import PageShowHandler from "./Components/PageHandler/PageHandler";

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
        },
    setup({ el, App, props }) {
        createRoot(el).render(
            <React.StrictMode>
                <PageShowHandler />
                <App {...props} />
            </React.StrictMode>
        );
    },
});
