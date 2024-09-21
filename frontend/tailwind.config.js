/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-1': '#313338',
        'primary-2': '#2B2D31',
        'primary-3': '#1E1F22',
        'main': '#5E66F4',
        'green': '#40A456',
        'gray-1': '#B6BAC1',
        'gray-2': '#A9ADB3',
        'gray-3': '#7b7f88',
        'blue-1': '#3fa3f5',
        'red-1': "#d0393d"
      },
    },
  },
  plugins: [],
}