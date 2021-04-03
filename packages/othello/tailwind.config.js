const colors = require("tailwindcss/colors");

module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
    extend: {
      colors: {
        gray: colors.trueGray
      }
    },
    fontFamily: {
      "logo": ["Arlon", "sans-serif"],
      "sans": ["Rubik", "sans-serif"]
    }
	},
	variants: {
		extend: {
		  backgroundColor: ["odd"]
    },
	},
	plugins: [],
}
