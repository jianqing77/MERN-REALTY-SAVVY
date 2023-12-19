/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                mulish: ['Mulish', 'sans-serif'],
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
            },
            colors: {
                primary: {
                    dark: '#1c343c',
                    100: '#fefae0',
                    200: '#dda15e',
                    300: '#bc6c25',
                },
            },
        },
    },
    plugins: [],
};
