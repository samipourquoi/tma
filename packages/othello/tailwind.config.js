const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
	purge: [
	  "./src/**/*.tsx"
  ],
	darkMode: "class",
	theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        contrast: Object.fromEntries(
          [ 300, 400, 500, 600, 700, 800
          ].map(n => [n, `var(--cl-contrast-${n})`])
        ),
        tags: {
          "redstone":      "#f29ea0",
          "slimestone":    "#b0d9af",
          "storage":       "#46504e",
          "farms":         "#f1e0a4",
          "mob-farms":     "#aeb2d7",
          "bedrock":       "#262626",
          "computational": "#fcac55",
          "other":         "#d5d9d5"
        },
        main: {
          "green": "#8EC67B",
          "beige": "#ECCFAA",
          "dark-beige": "#D1B898",
          "dark-green": "#0E2F16"
        }
      },
      fontFamily: {
        "logo": ["Arlon", "sans-serif"],
        "sans": ["Rubik", "sans-serif"],
        "serif": ["Lora", "serif"],
        "helvetica": ["Helvetica", "sans-serif"],
        "mono": ["Source Code Pro", "mono"]
        // "sans": ["Arial"]
      }
    }
	},
  variants: {
    extend: {
      backgroundColor: [ "odd", "children" ]
    },
  },
	plugins: [
	  // require("tailwindcss-children")
  ],
}
