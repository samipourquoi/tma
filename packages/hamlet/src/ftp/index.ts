import { FtpSrv } from "ftp-srv";
import { PermsFs } from "./perms-fs";

export const ftp = new FtpSrv({
	url: "ftp://127.0.0.1:6900"
});

const writeCommands = ["ALLO", "APPE", "DELE", "MKD", "RMD", "RNRF", "RNTO", "STOR", "STRU"];

ftp.on("login", (data, resolve, reject) => {
	const { connection } = data;



	resolve({
		// blacklist: writeCommands
		fs: new PermsFs(connection, 4)
	});
});

ftp.listen()
	.then(() => console.log("ftp server listening to port 6900"));
