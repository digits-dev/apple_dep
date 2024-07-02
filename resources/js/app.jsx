import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";

createInertiaApp({
    title: title => `Apple DEP | ${title ? `${title}` : 'System'}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        page.default.layout =
            name.startsWith("Auth/") || name == "Dashboard"
                ? undefined
                : (page) => <Layout children={page}></Layout>;
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <React.StrictMode>
                <App {...props} />
            </React.StrictMode>
        );
    },
});
