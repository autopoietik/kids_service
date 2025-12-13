/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-blue': '#2563EB', // High contrast blue
                'brand-pink': '#DB2777', // High contrast pink
                'brand-dark': '#1F2937', // Readable dark text
                'brand-bg': '#F3F4F6',   // Soft background
            },
            fontSize: {
                'base': '1.125rem', // 18px base for better readability
                'lg': '1.25rem',
                'xl': '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
                '4xl': '3rem',
            },
        },
    },
    plugins: [],
}
