import { readFile, readdir, writeFile } from "node:fs/promises";

const directory = new URL("./", import.meta.url);
const modules = (await readdir(new URL("modules/", directory)))
  .filter(name => name.endsWith(".html"))
  .sort();
const paths = ["_base.html", ...modules.map(name => "modules/" + name), "_footer.html"];
const parts = await Promise.all(paths.map(path => readFile(new URL(path, directory))));
await writeFile(new URL("index.html", directory), Buffer.concat(parts));
console.log("Built course/index.html.");
