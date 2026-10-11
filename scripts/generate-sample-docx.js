const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");
const fs = require("fs");
const path = require("path");

async function generateSampleDocx() {
  const dir = path.join(__dirname, "..", "public", "sample-documents");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "The Forgotten Sanctuary of Eldermere",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "By Lady Genevieve Thorne",
                italics: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Chapter 1: The Silver Key in the Briars",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(
                "High upon the western bluffs, where Atlantic gale winds bend the twisted juniper trees into supplication, stood the ruins of Eldermere Abbey. For two hundred winters, no traveler had crossed the drawbridge."
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Lydia brushed aside the frozen briars. Beneath the frosted moss, a tarnished silver key gleamed in the pale twilight. Its handle was forged in the likeness of an owl with eyes of river amber."
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "“Do not turn the latch,” ",
                bold: true,
              }),
              new TextRun(
                "warned the shepherd who stood fifty paces back upon the heath. But Lydia’s heart was already bound to the riddle."
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Chapter 2: The Chamber of Floating Candles",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(
                "The key slipped into the lock with a sound like ringing silver bells. The heavy oak door groaned on hinges of Roman bronze, swinging inward into profound darkness."
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "As she stepped across the threshold, hundred upon hundred of wax tapers ignited in midair, suspended by no visible thread. The room was octagonal, walled with cedar bookshelves stretching three stories into the vaulted ceiling."
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "“Here rest the stories the world chose to forget,” ",
                italics: true,
              }),
              new TextRun(
                "whispered an echo from the gallery. Lydia stepped forward, eager to read."
              ),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(dir, "the-forgotten-sanctuary.docx");
  fs.writeFileSync(filePath, buffer);
  console.log("Sample DOCX written to:", filePath);
}

generateSampleDocx().catch(console.error);
