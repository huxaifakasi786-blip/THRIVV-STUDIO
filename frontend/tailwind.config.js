/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                card: '#111111',
                accent: '#00FFFF',
                accentSecondary: '#AA00FF',
            },
            fontFamily: {
                sans: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
