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
                "status-success":'#57C769',
                "status-error":'#57C769',
                "secondary" : '#797878',
                "primary" : '#282222',
                'stroke':'9f9d9d',
            },
            backgroundImage: {
                "mobile-gradient":
                    "linear-gradient(to bottom, #060505, #333232)",
            },
        },
    },
    plugins: [],
};
