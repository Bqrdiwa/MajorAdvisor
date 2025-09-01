const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */

module.exports = {
  plugins: [
    heroui({
      themes: {
        "pargarX": {
          extend: "light",
          colors: {
            background: "#D9D7D8",
            foreground: "#314659",
            content2: "#FFFFFF",
            brown: "#A67064",
            primary: {
              DEFAULT: "#314659",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#0DA7A7",
              foreground: "#F3F3F3"
            },
            focus: "#314659",
          },
        },
      },
    }),
  ],
};