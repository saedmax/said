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

## How it's structured

- `index.html` — page shell
- `styles.css` — layout and theming (light/dark aware)
- `app.js` — sentence data (tiles, alternatives, Arabic translations,
  emoji icons) and the rendering/interaction logic

## Adding a new sentence

Add an entry to the `SENTENCES` array in `app.js`: a list of slots (each
an array of `{ en, ar, icon }` alternatives), a `punctAfter` map for
inline punctuation, and `joinEN`/`joinAR` functions that assemble the
final English and Arabic sentences from the selected options.
