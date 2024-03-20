import { getFiles, readArrBuffer } from "@/libs/custom-fs";
import { ChunkFileParams, MergeFileParams } from "@/models/common.model";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

export default abstract class CommonService {
  static async storeChunk(params: ChunkFileParams) {
    const { fileUuid, fileIndex, file } = params;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const configFilePath = join(
      process.cwd(),
      `tmp/chunk/${fileUuid}/${fileIndex}_${fileUuid}.chunk`
    );

    await mkdir(dirname(configFilePath), { recursive: true });
    await Bun.write(configFilePath, buffer);
  }

  static async mergeChunk(params: MergeFileParams) {
    const { fileUuid, fileName } = params;

    const folderPath = join(process.cwd(), `tmp/chunk/${fileUuid}/`);
    const configFilePath = join(process.cwd(), `public/upload/${fileName}`);
    const chunkFilesPath = (await getFiles(folderPath)).sort(
      (a, b) =>
        Number(a.slice(folderPath.length).split("_")[0] ?? "0") -
        Number(b.slice(folderPath.length).split("_")[0] ?? "0")
    );

    let bufferArr: Uint8Array[] = await readArrBuffer(chunkFilesPath);
    let bufferConcat = Buffer.concat(bufferArr);

    await mkdir(dirname(configFilePath), { recursive: true });
    await Bun.write(configFilePath, bufferConcat);

    await rm(folderPath, { recursive: true });
  }
}
