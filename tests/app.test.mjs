// End-to-end tests for Sentence Builder. Run with: npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Playwright is resolved like CommonJS so a global install (NODE_PATH) works too.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL("..", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

let server;
let browser;
let baseURL;

before(async () => {
  server = createServer(async (req, res) => {
    const path = normalize(new URL(req.url, "http://x").pathname);
    const file = join(root, path === "/" ? "index.html" : path);
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  baseURL = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function openApp() {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(baseURL);
  return { page, errors };
}

const text = (page, sel) => page.locator(sel).textContent();

async function pick(page, slot, word) {
  await page.locator(".tile").nth(slot).click();
  await page.locator(".option-word", { hasText: word }).first().click();
}

test("renders the first sentence without errors", async () => {
  const { page, errors } = await openApp();
  assert.equal(await text(page, "#preview"), "I can't go tomorrow, I have an appointment.");
  assert.equal(await text(page, "#translation"), "لا أستطيع الذهاب غدًا، لدي موعد.");
  assert.equal(await page.locator(".tile").count(), 5);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Arabic verb form follows the opener", async () => {
  const { page } = await openApp();
  await pick(page, 0, "I won't");
  assert.equal(await text(page, "#translation"), "لن أذهب غدًا، لدي موعد.");
  await pick(page, 0, "I don't want to");
  await pick(page, 1, "leave");
  assert.equal(await text(page, "#translation"), "لا أريد أن أغادر غدًا، لدي موعد.");
  await page.close();
});

test("statements end with a period, questions with a question mark", async () => {
  const { page } = await openApp();
  await page.getByRole("tab", { name: "Café order" }).click();
  assert.equal(await text(page, "#preview"), "Can I get a coffee please?");
  await pick(page, 0, "I want");
  assert.equal(await text(page, "#preview"), "I want a coffee please.");
  assert.equal(await text(page, "#translation"), "أريد قهوة من فضلك.");
  assert.equal(await page.locator(".punct").last().textContent(), ".");
  await page.close();
});

test("keyboard: arrows move tabs, Escape closes menu and restores focus", async () => {
  const { page } = await openApp();
  await page.getByRole("tab", { name: "Appointment" }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.getByRole("tab", { selected: true }).textContent(), "Café order");

  await page.locator(".tile").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".options").count(), 1);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  assert.equal(await text(page, "#preview"), "I would like a coffee please.");
  assert.equal(await page.evaluate(() => document.activeElement.className), "tile");

  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".options").count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement.className), "tile");
  await page.close();
});

test("choices persist across reloads", async () => {
  const { page } = await openApp();
  await page.getByRole("tab", { name: "Directions" }).click();
  await pick(page, 1, "the nearest bank");
  await page.locator("#slowBtn").click();
  await page.reload();
  assert.equal(await text(page, "#preview"), "Where is the nearest bank?");
  assert.equal(await page.locator("#slowBtn").getAttribute("aria-pressed"), "true");
  await page.close();
});

test("corrupt saved state falls back to defaults", async () => {
  const { page, errors } = await openApp();
  await page.evaluate(() =>
    localStorage.setItem("sentence-builder:v1", '{"sentenceId":"x","choices":{"appointment":[99,0,0,0,0]}}'),
  );
  await page.reload();
  assert.equal(await text(page, "#preview"), "I can't go tomorrow, I have an appointment.");
  assert.deepEqual(errors, []);
  await page.close();
});

test("every combination builds a sentence with no gaps", async () => {
  const { page } = await openApp();
  const bad = await page.evaluate(() => {
    const out = [];
    for (const s of SENTENCES) {
      const walk = (i, sel) => {
        if (i === s.slots.length) {
          for (const t of [s.joinEN(sel), s.joinAR(sel)]) {
            if (/undefined|\[object|  /.test(t)) out.push(t);
          }
          return;
        }
        for (const o of s.slots[i]) walk(i + 1, [...sel, o]);
      };
      walk(0, []);
    }
    return out;
  });
  assert.deepEqual(bad, []);
  await page.close();
});

test("fits a 320px phone screen without horizontal scroll", async () => {
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.goto(baseURL);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  assert.equal(overflow, false);
  await page.close();
});

test("open menu is fully visible, not clipped by its tile", async () => {
  const { page } = await openApp();
  await page.locator(".tile").nth(1).click();
  const options = page.locator(".option-word");
  for (let i = 0; i < (await options.count()); i++) {
    const box = await options.nth(i).boundingBox();
    const hit = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x, y)?.className,
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    assert.match(hit, /option-word/);
  }
  await page.close();
});
