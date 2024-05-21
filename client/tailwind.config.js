/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/tailwind-datepicker-react/dist/**/*.js', // <--- Add this line
    ],
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
                    100: '#fefae0',
                    200: '#dda15e',
                    300: '#bc6c25',
                    400: '#a47d4a',
                    500: '#f9f7f1',
                },
                dark: {
                    100: '#1c343c',
                    200: '#254e5c',
                },
            },
        },
    },
    plugins: [formsPlugin, aspectRatioPlugin],
};
