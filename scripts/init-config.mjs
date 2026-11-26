import { readFile, writeFile } from "node:fs/promises";

const example = await readFile(".bree.example.json");

try {
  await writeFile(".bree.local.json", example, { flag: "wx", mode: 0o600 });
  console.log("Created .bree.local.json from the example.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("Kept the existing .bree.local.json.");
}
