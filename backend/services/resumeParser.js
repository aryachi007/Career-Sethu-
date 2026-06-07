const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const parseResume = async (filePath, mimeType) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      filePath.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
    } else if (
      mimeType === "text/plain" || filePath.endsWith(".txt")
    ) {
      extractedText = fileBuffer.toString("utf8");
    } else {
      throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
    }

    // Clean up excessive whitespace
    return extractedText.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to parse resume file");
  }
};

module.exports = {
  parseResume,
};
