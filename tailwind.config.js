/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],

  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brandColor: "rgb(61, 65, 77)",
        success: {
          DEFAULT: "#67C23A",
          light: "#85ce61",
          dark: "#5daf34",
        },
        warning: {
          DEFAULT: "#E6A23C",
          light: "#ebb563",
          dark: "#cf9236",
        },
        danger: {
          DEFAULT: "#F56C6C",
          light: "#f78989",
          dark: "#dd6161",
        },
        info: {
          DEFAULT: "#909399",
          light: "#a6a9ad",
          dark: "#82848a",
        },
        border: {
          darkerBorder: "#CDD0D6",
          darkBorder: "#D4D7DE",
          baseBorder: "#DCDFE6",
          lightBorder: "#E4E7ED",
          lighterBorder: "#EBEEF5",
          extraLightBorder: "#F2F6FC",
        },
        text: {
          primaryText: "#303133",
          regularText: "#606266",
          secondaryText: "#909399",
          placeholderText: "#A8ABB2",
          disabledText: "#C0C4CC",
        },
        background: {
          basicBlack: "#000000",
          basicWhite: "#FFFFFF",
          transparent: "transparent",
          pageBackground: "#F2F3F5",
          baseBackground: "#FFFFFF",
          overlayBackground: "#FFFFFF",
          darkerFill: "#E6E8EB",
          darkFill: "#EBEDF0",
          baseFill: "#F0F2F5",
          lightFill: "#F5F7FA",
          lighterFill: "#FAFAFA",
          extraLightFill: "#FAFCFF",
          blankFill: "FFFFFF",
        },

        darkBorder: {
          darkerBorder: "#636466",
          darkBorder: "#58585B",
          baseBorder: "#4C4D4F",
          lightBorder: "#414243",
          lighterBorder: "#363637",
          extraLightBorder: "#2B2B2C",
        },
        darkText: {
          primaryText: "#E5EAF3",
          regularText: "#CFD3DC",
          secondaryText: "#A3A6AD",
          placeholderText: "#8D9095",
          disabledText: "#6C6E72",
        },
        darkBackground: {
          basicBlack: "#000000",
          basicWhite: "#FFFFFF",
          transparent: "transparent",
          pageBackground: "#0A0A0A",
          baseBackground: "#1D1E1F",
          overlayBackground: "#1D1E1F",
          darkerFill: "#424243",
          darkFill: "#39393A",
          baseFill: "#303030",
          lightFill: "#262727",
          lighterFill: "#1D1D1D",
          extraLightFill: "#191919",
          blankFill: "transparent",
        },
      },
      screens: {
        xs: "500px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["dark"],
      textColor: ["dark"],
      borderColor: ["dark"],
    },
  },
  plugins: [],
};
