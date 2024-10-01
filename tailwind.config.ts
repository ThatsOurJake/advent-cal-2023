import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      aspectRatio: {
        card: '3 / 4',
      },
      colors: {
        main: '#ff6b6b',
        mainAccent: '#ff3333', // not needed for shadcn components
        overlay: 'rgba(0,0,0,0.8)', // background color overlay for alert dialogs, modals, etc.
  
        // light mode
        bg: '#fcd7d7',
        text: '#000',
        border: '#000',
  
        // dark mode
        darkBg: '#1D1F27',
        darkText: '#eeefe9',
        darkBorder: '#000',
        secondaryBlack: '#1b1b1b', // opposite of plain white, not used pitch black because borders and box-shadows are that color 
      },
      borderRadius: {
        base: '5px'
      },
      boxShadow: {
        light: '4px 4px 0px 0px #fff',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
  
    },
  },
  plugins: [],
}
export default config
