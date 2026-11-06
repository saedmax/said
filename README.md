# Sentence Builder

A tile-based English sentence learning app. Each sentence is broken into
word tiles; tapping a tile opens its list of alternatives so you can swap
in a different or similar meaning. The rebuilt sentence, its Arabic
translation, and a small emoji illustration all update live, and you can
tap "Listen" to hear the sentence spoken aloud.

This is a static, dependency-free prototype (plain HTML/CSS/JS) — no
build step required.

## Run it

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Run the tests

End-to-end tests use Node's built-in test runner and Playwright:

```sh
npm install   # installs Playwright
npm test
```

They cover rendering, Arabic grammar, punctuation, keyboard use,
saved progress, every word combination, and a 320px phone layout.

## How it's structured

- `index.html` — page shell
- `styles.css` — layout and theming (light/dark aware)
- `app.js` — sentence data (tiles, alternatives, Arabic translations,
  emoji icons) and the rendering/interaction logic
- `tests/app.test.mjs` — browser tests

## Adding a new sentence

Add an entry to the `SENTENCES` array in `app.js`: a list of slots (each
an array of `{ en, ar, icon }` alternatives), a `punctAfter(sel)` function
returning inline punctuation, and `joinEN`/`joinAR` functions that assemble the
final English and Arabic sentences from the selected options.

## Claude Code setup (ECC)

This repo enables the [ECC](https://github.com/affaan-m/ECC) plugin
(`ecc@ecc`) via `.claude/settings.json`. Claude Code loads its agents,
skills, commands, and hooks on session start.

Rule packs live in `.claude/rules/ecc/`:

- `common/` — workflow, testing, security, git rules
- `web/` — frontend style, design, performance rules

Remove the `enabledPlugins` entry to disable ECC.
