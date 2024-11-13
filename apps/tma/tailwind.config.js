/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Europa"],
      body: ["Europa"],
    },
    extend: {
      colors: {
        whiteM: "#ffffff",
        grayBGM: "#1F1F1F",
        grayM: "#C6C7C6",
        darkGrayM: "#767676",
        secondDark: "#252525",
        darkM: "#121212",
        primaryM: "#e8c421",
        secondaryM: "#87e88b",
        thirdlyM: "#e8cb9a",
        borderM: "#5E5E5E",
        grayT: "rgba(255, 255, 255, 0.07)",
        primaryT: "rgba(232, 203, 153, 0.07)",
        thirdlyT: "rgba(128, 212, 133, 0.07)",
      },
      fontSize: {
        "2xs": ".625rem",
        "3xs": ".5rem",
        "4xs": ".375rem",
      },
      boxShadow: {
        "inner-m":
          "inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.5), 4px 4px 10px rgba(0, 0, 0, 0.5)",
      },
      gridTemplateColumns: {
        "item-info": "1fr auto 1fr",
        "market-items": "4rem auto auto",
      },
      transform: {
        "mirror-y": "scaleX(-1)",
      },
      boxShadow: {},
      dropShadow: {
        m: "5px 4px 2px rgba(0, 0, 0, 0.18)",
        ml: "0 0 18.5px rgba(254, 255, 254, 0.43)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".clip-down": {
          clipPath:
            "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)",
        },
        ".clip-down-xl": {
          clipPath:
            "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
        },
        ".clip-up": {
          clipPath:
            "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
