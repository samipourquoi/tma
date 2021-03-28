import { FtpSrv } from "ftp-srv";

export const ftp = new FtpSrv({
	url: "ftp://127.0.0.1:6900"
});

const writeCommands = ["ALLO", "APPE", "DELE", "MKD", "RMD", "RNRF", "RNTO", "STOR", "STRU"];

ftp.on("login", (data, resolve, reject) => {
	const { connection } = data;

	resolve({
		root: "../../store",
		blacklist: writeCommands
	});
});

ftp.listen()
	.then(() => console.log("ftp server listening to port 6900"));
