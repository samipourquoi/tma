import { FileSystem as FileSystemBase, FtpConnection } from "ftp-srv";
import { Archive } from "../models/archive-model";
import { SearchSystem } from "../search-system";

export class PermsFs
  extends FileSystemBase {
  constructor(connection: FtpConnection,
              private readonly id: number) {
    super(
      connection,
      { root: "../../store", cwd: "/" }
    );
  }

  async list(path?: string): Promise<any> {
    return await super.list(path)
      .then((files: any[]) =>
        files.filter((file: any) =>
            ![".git", "readme.json", "tags.json"].includes(file.name)));
  }

  async write(fileName: string): Promise<any> {
    await this.throwIfNotOwner();
    const res = await super.write(fileName);
    this.throwIfUndeletableFile(fileName);
    return res;
  }

  async mkdir(path: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.mkdir(path);
  }

  async delete(path: string): Promise<any> {
    await this.throwIfNotOwner();
    await this.throwIfUndeletableFile(path)
    return await super.delete(path);
  }

  async rename(from: string, to: string): Promise<any> {
    await this.throwIfNotOwner();
    return await super.rename(from, to);
  }

  async chmod(path: string, mode: string): Promise<any> {
    throw new Error("you don't have rights to do that");
  }

  throwIfUndeletableFile(file: string) {
    if ([".git", "readme.json", "tags.json"].some(f => file.endsWith(f)))
      throw new Error("you can't delete that file")
  }

  async throwIfNotOwner() {
    if (this.cwd == "/")
      throw new Error("you don't have write access to the root.");

    const archiveID = +this.cwd.split("/")[1];
    if (Number.isNaN(archiveID))
      throw new Error("you shouldn't be able to see this...");

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
