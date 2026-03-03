/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                primary: 'var(--color-primary)',
                accent: 'var(--color-accent)',
                'text-main': 'var(--color-text-main)',
                muted: 'var(--color-text-muted)',
                border: 'var(--color-border)',
                danger: 'var(--color-danger)',
                success: 'var(--color-success)',
            }
        },
    },
    plugins: [],
}
