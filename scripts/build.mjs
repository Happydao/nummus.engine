import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(new URL("assets/", output), { recursive: true });

const files = ["index.html", "styles.css", "app.js"];
for (const file of files) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, output));
}
for (const file of ["nummus-logo.png", "favicon.png", "infografica3.png"]) {
  await cp(new URL(`../assets/${file}`, import.meta.url), new URL(`assets/${file}`, output));
}
await writeFile(new URL(".nojekyll", output), "");
console.log("Production site built in dist/");
