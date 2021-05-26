module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: process.env.DOCKER ?
					"http://api/:path*" :
					"http://localhost:3001/:path*"
      }
		]
	}
}
