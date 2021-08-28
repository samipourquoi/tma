import { FtpSrv } from "ftp-srv";
import { PermsFs } from "./perms-fs";
import { FtpController } from "../controllers/ftp-controller";

export const ftp = new FtpSrv({
  url: "ftp://127.0.0.1:6900",
  greeting: "welcome to blocky game archive"
});

ftp.on("login", async (data, resolve, reject) => {
  const { connection, username: email, password } = data;

  const ftpUser = await FtpController.getFtpUser(email, password);

  if (!ftpUser)
    return reject(new Error("invalid credentials"));

  resolve({
    fs: new PermsFs(connection, ftpUser.user.id)
  });
});

ftp.listen()
  .then(() => console.log("ftp server listening to port 6900"));
