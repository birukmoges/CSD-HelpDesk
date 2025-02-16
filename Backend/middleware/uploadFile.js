const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = async (req, uploadDir) => {
  try {
   
    const uploadedFiles = {};

    if (!req.files) {
      // If req.files is null or undefined, return an empty object
      return uploadedFiles;
    }

    

    const decodeFilename = (encodedName) => {
      return Buffer.from(encodedName, "binary").toString("utf-8");
    };

    const processFile = async (file, subDir) => {
      if (!file || !file.name || !file.data) {
        throw new Error("Invalid file object.");
      }

      const decodedName = decodeFilename(file.name);
      const fileExtension = path.extname(decodedName);
      const baseName = path.basename(decodedName, fileExtension);

      const uniqueName = `${baseName}-${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, subDir, uniqueName);

      await fs.mkdir(path.join(uploadDir, subDir), { recursive: true });
      await fs.writeFile(filePath, file.data);

      return filePath;
    };

    const baseUploadDir = path.join("files", uploadDir);
    await fs.mkdir(baseUploadDir, { recursive: true });

    // Process Image File
    const imageFile = req.files.image;
    uploadedFiles.image = await processFile(imageFile, "images");

    // Process PDF File
    const pdfFile = req.files.pdf;
    uploadedFiles.pdf = await processFile(pdfFile, "pdfs");

    return uploadedFiles;
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadFile };
