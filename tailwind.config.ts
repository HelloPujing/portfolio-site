import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        '88': '22rem',
        '120': '30rem',
      },
      height: {
        '160': '40rem',
      },
    },

    // screens: {
    // 'tablet': '640px',
    // 'laptop': '1024px',
    // 'desktop': '1280px',
    // },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      xxl: '1920px',
      xxxl: '2560px',
    },

    // colors: {
    //   'blue': '#1fb6ff',
    //   'pink': '#ff49db',
    //   'orange': '#ff7849',
    //   'green': '#13ce66',
    //   'gray-dark': '#273444',
    //   'gray': '#8492a6',
    //   'gray-light': '#d3dce6',
    // },

    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },

    // extend: {
    //   spacing: {
    //     '128': '32rem',
    //     '144': '36rem',
    //   },
    //   borderRadius: {
    //     '4xl': '2rem',
    //   }
    // }

  },
  plugins: [],
};
export default config;
