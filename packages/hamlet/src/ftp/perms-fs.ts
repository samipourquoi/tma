import { FileSystem as FileSystemBase, FtpConnection } from "ftp-srv";
import { Archive } from "../models/archive-model";

export class PermsFs
  extends FileSystemBase {
  constructor(connection: FtpConnection,
              private readonly id: number) {
    super(
      connection,
      { root: "../../store", cwd: "/" }
    );
  }

  async write(fileName: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.write(fileName);
  }

  async mkdir(path: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.mkdir(path);
  }

  async delete(path: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.delete(path);
  }

  async rename(from: string, to: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.rename(from, to);
  }

  async chmod(path: string, mode: string): Promise<any> {
    throw new Error("you don't have rights to do that");
  }

  async throwIfNotOwner() {
    if (this.cwd == "/")
      throw new Error("you don't have write access to the root.");

    const archiveID = +this.cwd.split("/")[1];
    if (Number.isNaN(archiveID))
      throw new Error("you are supposed to be in an archive directory. :thonk:");

    const isOwner = Boolean(await Archive.count({
      where: {
        id: archiveID,
        authorID: this.id
      }
    }));

    if (!isOwner)
      throw new Error("you are not the author of this archive.");
  }
}
