const colors = require("tailwindcss/colors");

module.exports = {
	purge: [
	  "./src/**/*.tsx"
  ],
	darkMode: false, // or 'media' or 'class'
	theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        tags: {
          "redstone":      "#f29ea0",
          "slimestone":    "#b0d9af",
          "storage":       "#46504e",
          "farms":         "#f1e0a4",
          "mob-farms":     "#aeb2d7",
          "bedrock":       "#262626",
          "computational": "#fcac55",
          "other":         "#d5d9d5"
        }
      }
    },
    fontFamily: {
      "logo": ["Arlon", "sans-serif"],
      "sans": ["Rubik", "sans-serif"]
    }
	},
  variants: {
    extend: {
      backgroundColor: [ "odd", "children" ]
    },
  },
	plugins: [
	  require("tailwindcss-children")
  ],
}
