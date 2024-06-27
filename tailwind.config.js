/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                "login-bg-color": "#383838",
                "camera-color": "#342D2D",
                "screen-color": "#E8E8E8",
                "status-success": "#57C769",
                "status-error": "#57C769",
                secondary: "#797878",
                primary: "#282222",
                stroke: "9f9d9d",
                "sidebar-hover-color": "#323232",
            },
            backgroundImage: {
                "mobile-gradient":
                    "linear-gradient(to bottom, #060505, #333232)",
            },
        },
    },
    plugins: [],
};
