import crypto from "node:crypto";
import { existsSync, promises } from "node:fs";
import path from "node:path";

export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

export async function readArrBuffer(listPath: string[]) {
  let arrBuffer: Uint8Array[] = [];

  for (const path of listPath) {
    const file = Bun.file(path);
    const arrbuf = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrbuf);

    arrBuffer.push(byteArray);
  }

  return arrBuffer;
}

export async function clearFolder(directory: string): Promise<void> {
  await promises.rm(directory, { force: true, recursive: true });
}

//* Download session (based on: https://stackoverflow.com/questions/21999877/node-express-generate-a-one-time-route-link-download)

// Path where we store the download sessions
const DL_SESSION_FOLDER = "tmp/download";

/* Creates a download session */
export async function createDownloadSession(filePath: string) {
  const downloadPath = path.resolve(DL_SESSION_FOLDER);
  // Check the existence of DL_SESSION_FOLDER
  if (!existsSync(downloadPath))
    throw new Error("Session directory does not exist");

  // Check the existence of the file
  if (!existsSync(filePath)) throw new Error("File doest not exist");

  // Generate the download sid (session id)
  var downloadSid = crypto
    .createHash("md5")
    .update(Math.random().toString())
    .digest("hex");

  // Generate the download session filename
  var dlSessionFileName = path.join(
    DL_SESSION_FOLDER,
    downloadSid + ".download"
  );

  // Write the link of the file to the download session file
  try {
    await promises.writeFile(dlSessionFileName, filePath);
    return downloadSid;
  } catch (error) {
    throw error;
  }
}

/* Gets the download file path related to a download sid */
export async function getDownloadFilePath(downloadSid: string) {
  // Get the download session file name
  var dlSessionFileName = path.join(
    DL_SESSION_FOLDER,
    downloadSid + ".download"
  );

  // Check if the download session exists
  if (!existsSync(dlSessionFileName))
    throw new Error("Download does not exist");

  // Get the file path
  try {
    const data = await promises.readFile(dlSessionFileName, "utf8");
    return data;
  } catch (error) {
    throw error;
  }
}

/* Deletes a download session */
export async function deleteDownloadSession(downloadSid: string) {
  // Get the download session file name
  var dlSessionFileName = path.join(
    DL_SESSION_FOLDER,
    downloadSid + ".download"
  );

  // Check if the download session exists
  if (!existsSync(dlSessionFileName))
    throw new Error("Download does not exist");

  // Delete the download session
  try {
    await promises.unlink(dlSessionFileName);
  } catch (error) {
    throw error;
  }
}
