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
            },
            backgroundImage: {
                "mobile-gradient":
                    "linear-gradient(to bottom, #060505, #333232)",
            },
        },
    },
    plugins: [],
};
