import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

const CONTRACT = "9JK2U7aEkp3tWaFNuaJowWRgNys5DVaKGxWk73VT5ray";

test("index.html declares the document and page basics", async () => {
  const html = await read("index.html");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>Nummus Engine/);
  assert.match(html, /id="hero-title"/);
  assert.ok(html.includes('href="./styles.css'));
  assert.ok(html.includes('src="./app.js'));
});

test("index.html uses local assets and the infographic background", async () => {
  const html = await read("index.html");
  assert.ok(html.includes("assets/nummus-logo.png"));
  assert.ok(html.includes("assets/infografica3.png"));
  assert.ok(html.includes("assets/favicon.png"));
});

test("index.html contains all engine sections and anchors", async () => {
  const html = await read("index.html");
  for (const id of ["reserve", "engine", "governance", "access"]) {
    assert.ok(html.includes(`id="${id}"`), `missing section #${id}`);
  }
});

test("index.html keeps the token contract address consistent", async () => {
  const html = await read("index.html");
  assert.match(html, new RegExp(CONTRACT.replace(/\d/g, "\\d")));
  assert.ok(html.includes('data-copy-address="9JK2U7aEkp3tWaFNuaJowWRgNys5DVaKGxWk73VT5ray"'));
});

test("index.html links to the main nummus.meme site and official channels", async () => {
  const html = await read("index.html");
  assert.ok(html.includes("https://nummus.meme"));
  assert.ok(html.includes("https://happydao.github.io/Nummus.Aeternitas/"));
  assert.ok(html.includes("https://v2.realms.today/dao/2Czvw7p29thfqNJznuicygBKxh33xoCMuGMH7zbPQ2gp"));
  assert.ok(html.includes("https://happydao.github.io/Nummus.burn/"));
  assert.ok(html.includes("https://happydao.github.io/Nummus.Hub/"));
  assert.ok(html.includes("https://jup.ag/tokens/9JK2U7aEkp3tWaFNuaJowWRgNys5DVaKGxWk73VT5ray"));
});

test("index.html opens external links in a new tab safely", async () => {
  const html = await read("index.html");
  const anchors = [...html.matchAll(/<a[^>]*>/g)].map((m) => m[0]);
  const external = anchors.filter((tag) => /href="https?:\/\//.test(tag));
  assert.ok(external.length > 0, "expected at least one external link");
  for (const tag of external) {
    if (tag.includes('class="nav-cta"')) continue; // opens in the same tab by design
    assert.match(tag, /target="_blank"/, `missing target="_blank": ${tag}`);
    assert.match(tag, /rel="noopener noreferrer"/, `missing rel on ${tag}`);
  }
});

test("app.js handles the copy-address button", async () => {
  const js = await read("app.js");
  assert.ok(js.includes(".copy-address-button"));
  assert.ok(js.includes("data-copy-address"));
});
