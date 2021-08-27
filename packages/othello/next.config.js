module.exports = {
  mode: "jit",
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: process.env.DOCKER ?
					"http://host.docker.internal:3001/:path*" :
					"http://localhost:3001/:path*"
      }
		]
	},
  images: {
	  domains: [
	    "cdn.discordapp.com"
    ]
  }
}
