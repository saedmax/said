// Sentence Builder: tap a tile to swap the word and watch the sentence,
// its Arabic translation, and a small illustration update together.

// Verb options carry two Arabic forms because the right one depends on the
// chosen opener: "لا أستطيع الذهاب" uses the verbal noun (inf), while
// "لن أذهب" / "لا أريد أن أذهب" need the present-tense verb (sub).
const SENTENCES = [
  {
    id: "appointment",
    title: "Appointment",
    slots: [
      [
        { en: "I can't", ar: "لا أستطيع", arForm: "inf" },
        { en: "I won't", ar: "لن", arForm: "sub" },
        { en: "I don't want to", ar: "لا أريد أن", arForm: "sub" },
      ],
      [
        { en: "go", ar: { inf: "الذهاب", sub: "أذهب" }, icon: "🚶" },
        { en: "come", ar: { inf: "المجيء", sub: "آتي" }, icon: "🚶‍♂️" },
        { en: "leave", ar: { inf: "المغادرة", sub: "أغادر" }, icon: "🏃" },
      ],
      [
        { en: "tomorrow", ar: "غدًا", icon: "📅" },
        { en: "today", ar: "اليوم", icon: "☀️" },
        { en: "tonight", ar: "الليلة", icon: "🌙" },
        { en: "this week", ar: "هذا الأسبوع", icon: "🗓️" },
      ],
      [
        { en: "I have", ar: "لدي" },
        { en: "I've got", ar: "عندي" },
      ],
      [
        { en: "an appointment", ar: "موعد", icon: "🩺" },
        { en: "a meeting", ar: "اجتماع", icon: "👥" },
        { en: "a class", ar: "حصة", icon: "📚" },
        { en: "a doctor's visit", ar: "موعد طبيب", icon: "👨‍⚕️" },
      ],
    ],
    punctAfter: () => ({ 2: ",", 4: "." }),
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}, ${sel[3].en} ${sel[4].en}.`;
    },
    joinAR(sel) {
      const verb = sel[1].ar[sel[0].arForm];
      return `${sel[0].ar} ${verb} ${sel[2].ar}، ${sel[3].ar} ${sel[4].ar}.`;
    },
  },
  {
    id: "cafe",
    title: "Café order",
    slots: [
      [
        { en: "Can I get", ar: "هل يمكنني الحصول على", icon: "🙋", question: true },
        { en: "I would like", ar: "أود", icon: "🙂" },
        { en: "I want", ar: "أريد", icon: "👉" },
      ],
      [
        { en: "a coffee", ar: "قهوة", icon: "☕" },
        { en: "a tea", ar: "شاي", icon: "🍵" },
        { en: "a sandwich", ar: "ساندويتش", icon: "🥪" },
        { en: "some water", ar: "بعض الماء", icon: "💧" },
      ],
      [
        { en: "please", ar: "من فضلك" },
        { en: "right now", ar: "الآن" },
        { en: "to go", ar: "للخارج", icon: "🥡" },
      ],
    ],
    punctAfter: (sel) => ({ 2: endMark(sel).en }),
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}${endMark(sel).en}`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar} ${sel[2].ar}${endMark(sel).ar}`;
    },
  },
  {
    id: "directions",
    title: "Directions",
    slots: [
      [
        { en: "Where is", ar: "أين", icon: "❓", question: true },
        { en: "Can you show me", ar: "هل يمكنك أن تريني", icon: "👀", question: true },
        { en: "I'm looking for", ar: "أنا أبحث عن", icon: "🔍" },
      ],
      [
        { en: "the nearest bus station", ar: "أقرب محطة حافلات", icon: "🚌" },
        { en: "the nearest pharmacy", ar: "أقرب صيدلية", icon: "💊" },
        { en: "the nearest hospital", ar: "أقرب مستشفى", icon: "🏥" },
        { en: "the nearest bank", ar: "أقرب بنك", icon: "🏦" },
      ],
    ],
    punctAfter: (sel) => ({ 1: endMark(sel).en }),
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en}${endMark(sel).en}`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar}${endMark(sel).ar}`;
    },
  },
  {
    id: "plans",
    title: "Weekend plans",
    slots: [
      [
        { en: "Let's meet", ar: "لنلتقِ", icon: "🤝" },
        { en: "Let's study", ar: "لندرس", icon: "📖" },
        { en: "Let's have lunch", ar: "لنتناول الغداء", icon: "🍽️" },
      ],
      [
        { en: "at the park", ar: "في الحديقة", icon: "🌳" },
        { en: "at the library", ar: "في المكتبة", icon: "📚" },
        { en: "at my house", ar: "في منزلي", icon: "🏠" },
        { en: "at the mall", ar: "في المول", icon: "🛍️" },
      ],
      [
        { en: "this weekend", ar: "في عطلة نهاية هذا الأسبوع", icon: "📆" },
        { en: "tomorrow", ar: "غدًا", icon: "📅" },
        { en: "tonight", ar: "الليلة", icon: "🌙" },
        { en: "next week", ar: "الأسبوع القادم", icon: "🗓️" },
      ],
    ],
    punctAfter: () => ({ 2: "." }),
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}.`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar} ${sel[2].ar}.`;
    },
  },
];

// A sentence is a question only when its opener is one ("Can I get…?"),
// so "I want a coffee please" ends with a period, not a question mark.
function endMark(sel) {
  return sel[0].question ? { en: "?", ar: "؟" } : { en: ".", ar: "." };
}

const STORAGE_KEY = "sentence-builder:v1";

const state = {
  sentenceId: SENTENCES[0].id,
  choices: {}, // sentenceId -> array of selected option indices
  slow: false,
};

for (const s of SENTENCES) {
  state.choices[s.id] = s.slots.map(() => 0);
}

function loadState() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return;
  }
  if (!saved || typeof saved !== "object") return;
  if (SENTENCES.some((s) => s.id === saved.sentenceId)) {
    state.sentenceId = saved.sentenceId;
  }
  state.slow = saved.slow === true;
  for (const s of SENTENCES) {
    const idxs = saved.choices && saved.choices[s.id];
    if (!Array.isArray(idxs) || idxs.length !== s.slots.length) continue;
    const valid = idxs.every(
      (v, i) => Number.isInteger(v) && v >= 0 && v < s.slots[i].length,
    );
    if (valid) state.choices[s.id] = idxs.slice();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the app still works.
  }
}

const tabsEl = document.getElementById("sentenceTabs");
const tilesEl = document.getElementById("tiles");
const previewEl = document.getElementById("preview");
const sceneEl = document.getElementById("scene");
const translationEl = document.getElementById("translation");
const statusEl = document.getElementById("status");
const speakBtn = document.getElementById("speakBtn");
const slowBtn = document.getElementById("slowBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");

let englishVoice = null;

function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  englishVoice =
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang && v.lang.startsWith("en")) ||
    null;
}

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.hidden = !message;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    showStatus("Speech playback isn't supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  if (englishVoice) utterance.voice = englishVoice;
  utterance.rate = state.slow ? 0.7 : 1;
  window.speechSynthesis.speak(utterance);
}

function currentSentence() {
  return SENTENCES.find((s) => s.id === state.sentenceId);
}

function currentSelection() {
  const s = currentSentence();
  const idxs = state.choices[s.id];
  return s.slots.map((options, i) => options[idxs[i]]);
}

function selectSentence(id, focus) {
  state.sentenceId = id;
  openDropdownSlot = null;
  renderAll();
  saveState();
  if (focus) tabsEl.querySelector(`[data-id="${id}"]`).focus();
}

function renderTabs() {
  tabsEl.textContent = "";
  for (const s of SENTENCES) {
    const selected = s.id === state.sentenceId;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = s.title;
    btn.dataset.id = s.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(selected));
    btn.setAttribute("aria-controls", "sentencePanel");
    btn.tabIndex = selected ? 0 : -1;
    btn.classList.toggle("active", selected);
    btn.addEventListener("click", () => selectSentence(s.id, false));
    tabsEl.appendChild(btn);
  }
}

// Arrow keys move between tabs (WAI-ARIA tabs pattern).
tabsEl.addEventListener("keydown", (e) => {
  const i = SENTENCES.findIndex((s) => s.id === state.sentenceId);
  let next = null;
  if (e.key === "ArrowRight") next = (i + 1) % SENTENCES.length;
  else if (e.key === "ArrowLeft") next = (i - 1 + SENTENCES.length) % SENTENCES.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = SENTENCES.length - 1;
  if (next === null) return;
  e.preventDefault();
  selectSentence(SENTENCES[next].id, true);
});

let openDropdownSlot = null;

function focusTile(slotIndex) {
  const tile = tilesEl.querySelectorAll(".tile")[slotIndex];
  if (tile) tile.focus();
}

function chooseOption(slotIndex, optIndex) {
  const idxs = state.choices[state.sentenceId];
  const changed = idxs[slotIndex] !== optIndex;
  idxs[slotIndex] = optIndex;
  openDropdownSlot = null;
  renderTiles();
  renderPreview();
  renderScene();
  renderTranslation();
  saveState();
  focusTile(slotIndex);
  if (changed) flashTile(slotIndex);
}

function makeSpeakButton(className, word) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.textContent = "🔊";
  btn.title = `Hear "${word}"`;
  btn.setAttribute("aria-label", `Hear "${word}"`);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    speak(word);
  });
  return btn;
}

function renderTiles() {
  const s = currentSentence();
  const idxs = state.choices[s.id];
  const punctAfter = s.punctAfter(currentSelection());
  tilesEl.textContent = "";

  s.slots.forEach((options, slotIndex) => {
    const isOpen = openDropdownSlot === slotIndex;
    const word = options[idxs[slotIndex]].en;
    const menuId = `options-${slotIndex}`;

    const wrap = document.createElement("span");
    wrap.className = "tile-wrap";
    wrap.classList.toggle("open", isOpen);

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.textContent = word;
    tile.setAttribute("aria-haspopup", "true");
    tile.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) tile.setAttribute("aria-controls", menuId);
    tile.addEventListener("click", (e) => {
      e.stopPropagation();
      openDropdownSlot = isOpen ? null : slotIndex;
      renderTiles();
      if (openDropdownSlot === null) {
        focusTile(slotIndex);
      } else {
        const selected = tilesEl.querySelector(".option-word.selected");
        if (selected) selected.focus();
      }
    });
    tile.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        tile.click();
      }
    });

    wrap.appendChild(tile);
    wrap.appendChild(makeSpeakButton("tile-speak", word));

    if (isOpen) {
      const menu = document.createElement("div");
      menu.className = "options";
      menu.id = menuId;
      menu.setAttribute("role", "group");
      menu.setAttribute("aria-label", `Alternatives for "${word}"`);
      options.forEach((opt, optIndex) => {
        const row = document.createElement("div");
        row.className = "option-row";

        const optBtn = document.createElement("button");
        optBtn.type = "button";
        optBtn.className = "option-word";
        optBtn.textContent = opt.en;
        const selected = optIndex === idxs[slotIndex];
        optBtn.classList.toggle("selected", selected);
        optBtn.setAttribute("aria-pressed", String(selected));
        optBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          chooseOption(slotIndex, optIndex);
        });

        row.appendChild(optBtn);
        row.appendChild(makeSpeakButton("option-speak", opt.en));
        menu.appendChild(row);
      });
      menu.addEventListener("keydown", (e) => {
        const words = [...menu.querySelectorAll(".option-word")];
        const i = words.indexOf(document.activeElement);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const step = e.key === "ArrowDown" ? 1 : -1;
          const next = i === -1 ? 0 : (i + step + words.length) % words.length;
          words[next].focus();
        }
      });
      wrap.appendChild(menu);
    }

    tilesEl.appendChild(wrap);

    const punct = punctAfter[slotIndex];
    if (punct) {
      const p = document.createElement("span");
      p.className = "punct";
      p.setAttribute("aria-hidden", "true");
      p.textContent = punct;
      tilesEl.appendChild(p);
    }
  });
}

function flashTile(slotIndex) {
  const wrap = tilesEl.querySelectorAll(".tile-wrap")[slotIndex];
  if (!wrap) return;
  wrap.classList.remove("changed");
  // Force reflow so the animation restarts.
  void wrap.offsetWidth;
  wrap.classList.add("changed");
}

function renderPreview() {
  previewEl.textContent = currentSentence().joinEN(currentSelection());
}

function renderScene() {
  const icons = currentSelection()
    .map((o) => o.icon)
    .filter(Boolean);
  const art = document.createElement("div");
  art.className = "scene-art";
  art.setAttribute("aria-hidden", "true");
  art.textContent = icons.length ? icons.join("  ") : "💬";
  sceneEl.replaceChildren(art);
}

function renderTranslation() {
  translationEl.textContent = currentSentence().joinAR(currentSelection());
}

function renderSlow() {
  slowBtn.classList.toggle("active", state.slow);
  slowBtn.setAttribute("aria-pressed", String(state.slow));
}

function renderAll() {
  renderTabs();
  renderTiles();
  renderPreview();
  renderScene();
  renderTranslation();
  renderSlow();
}

function closeDropdown(restoreFocus) {
  if (openDropdownSlot === null) return;
  const slot = openDropdownSlot;
  openDropdownSlot = null;
  renderTiles();
  if (restoreFocus) focusTile(slot);
}

document.addEventListener("click", () => closeDropdown(false));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdown(true);
});

// Close the menu when keyboard focus leaves it (e.g. Tab past the last option).
tilesEl.addEventListener("focusout", (e) => {
  if (openDropdownSlot === null) return;
  const wrap = tilesEl.querySelectorAll(".tile-wrap")[openDropdownSlot];
  if (wrap && e.relatedTarget && !wrap.contains(e.relatedTarget)) {
    closeDropdown(false);
  }
});

speakBtn.addEventListener("click", () => {
  speak(currentSentence().joinEN(currentSelection()));
});

slowBtn.addEventListener("click", () => {
  state.slow = !state.slow;
  renderSlow();
  saveState();
});

shuffleBtn.addEventListener("click", () => {
  const s = currentSentence();
  state.choices[s.id] = s.slots.map((options) =>
    Math.floor(Math.random() * options.length),
  );
  openDropdownSlot = null;
  renderAll();
  saveState();
});

resetBtn.addEventListener("click", () => {
  const s = currentSentence();
  state.choices[s.id] = s.slots.map(() => 0);
  openDropdownSlot = null;
  renderAll();
  saveState();
});

if ("speechSynthesis" in window) {
  pickVoice();
  window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
}

loadState();
renderAll();
