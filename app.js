// Sentence Builder: tap a tile to swap the word and watch the sentence,
// its Arabic translation, and a small illustration update together.

const SENTENCES = [
  {
    id: "appointment",
    title: "Appointment",
    slots: [
      [
        { en: "I can't", ar: "لا أستطيع" },
        { en: "I won't", ar: "لن" },
        { en: "I don't want to", ar: "لا أريد أن" },
      ],
      [
        { en: "go", ar: "الذهاب", icon: "🚶" },
        { en: "come", ar: "المجيء", icon: "🚶‍♂️" },
        { en: "leave", ar: "المغادرة", icon: "🏃" },
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
    punctAfter: { 2: ",", 4: "." },
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}, ${sel[3].en} ${sel[4].en}.`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar} ${sel[2].ar}، ${sel[3].ar} ${sel[4].ar}.`;
    },
  },
  {
    id: "cafe",
    title: "Café order",
    slots: [
      [
        { en: "Can I get", ar: "هل يمكنني الحصول على", icon: "🙋" },
        { en: "I would like", ar: "أريد", icon: "🙂" },
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
    punctAfter: { 2: "?" },
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}?`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar} ${sel[2].ar}؟`;
    },
  },
  {
    id: "directions",
    title: "Directions",
    slots: [
      [
        { en: "Where is", ar: "أين", icon: "❓" },
        { en: "Can you show me", ar: "هل يمكنك أن تريني", icon: "👀" },
        { en: "I'm looking for", ar: "أنا أبحث عن", icon: "🔍" },
      ],
      [
        { en: "the nearest bus station", ar: "أقرب محطة حافلات", icon: "🚌" },
        { en: "the nearest pharmacy", ar: "أقرب صيدلية", icon: "💊" },
        { en: "the nearest hospital", ar: "أقرب مستشفى", icon: "🏥" },
        { en: "the nearest bank", ar: "أقرب بنك", icon: "🏦" },
      ],
    ],
    punctAfter: { 1: "?" },
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en}?`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar}؟`;
    },
  },
  {
    id: "plans",
    title: "Weekend plans",
    slots: [
      [
        { en: "Let's meet", ar: "فلنلتقِ", icon: "🤝" },
        { en: "Let's study", ar: "فلندرس", icon: "📖" },
        { en: "Let's have lunch", ar: "فلنتناول الغداء", icon: "🍽️" },
      ],
      [
        { en: "at the park", ar: "في الحديقة", icon: "🌳" },
        { en: "at the library", ar: "في المكتبة", icon: "📚" },
        { en: "at my house", ar: "في منزلي", icon: "🏠" },
        { en: "at the mall", ar: "في المول", icon: "🛍️" },
      ],
      [
        { en: "this weekend", ar: "نهاية هذا الأسبوع", icon: "📆" },
        { en: "tomorrow", ar: "غدًا", icon: "📅" },
        { en: "tonight", ar: "الليلة", icon: "🌙" },
        { en: "next week", ar: "الأسبوع القادم", icon: "🗓️" },
      ],
    ],
    punctAfter: { 2: "." },
    joinEN(sel) {
      return `${sel[0].en} ${sel[1].en} ${sel[2].en}.`;
    },
    joinAR(sel) {
      return `${sel[0].ar} ${sel[1].ar} ${sel[2].ar}.`;
    },
  },
];

const state = {
  sentenceId: SENTENCES[0].id,
  choices: {}, // sentenceId -> array of selected option indices
  slow: false,
};

for (const s of SENTENCES) {
  state.choices[s.id] = s.slots.map(() => 0);
}

const tabsEl = document.getElementById("sentenceTabs");
const tilesEl = document.getElementById("tiles");
const previewEl = document.getElementById("preview");
const sceneEl = document.getElementById("scene");
const translationEl = document.getElementById("translation");
const speakBtn = document.getElementById("speakBtn");
const slowBtn = document.getElementById("slowBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Speech playback isn't supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
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

function renderTabs() {
  tabsEl.innerHTML = "";
  for (const s of SENTENCES) {
    const btn = document.createElement("button");
    btn.textContent = s.title;
    btn.role = "tab";
    btn.setAttribute("aria-selected", String(s.id === state.sentenceId));
    if (s.id === state.sentenceId) btn.classList.add("active");
    btn.addEventListener("click", () => {
      state.sentenceId = s.id;
      closeOpenDropdown();
      renderAll();
    });
    tabsEl.appendChild(btn);
  }
}

let openDropdownSlot = null;

function closeOpenDropdown() {
  openDropdownSlot = null;
}

function renderTiles() {
  const s = currentSentence();
  const idxs = state.choices[s.id];
  tilesEl.innerHTML = "";

  s.slots.forEach((options, slotIndex) => {
    const wrap = document.createElement("span");
    wrap.className = "tile-wrap";
    if (openDropdownSlot === slotIndex) wrap.classList.add("open");

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.textContent = options[idxs[slotIndex]].en;
    tile.setAttribute("aria-haspopup", "listbox");
    tile.setAttribute("aria-expanded", String(openDropdownSlot === slotIndex));

    tile.addEventListener("click", (e) => {
      e.stopPropagation();
      openDropdownSlot = openDropdownSlot === slotIndex ? null : slotIndex;
      renderTiles();
    });

    const speakTileBtn = document.createElement("button");
    speakTileBtn.type = "button";
    speakTileBtn.className = "tile-speak";
    speakTileBtn.textContent = "🔊";
    speakTileBtn.title = "Hear this word";
    speakTileBtn.setAttribute("aria-label", "Hear this word");
    speakTileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      speak(options[idxs[slotIndex]].en);
    });

    wrap.appendChild(tile);
    wrap.appendChild(speakTileBtn);

    if (openDropdownSlot === slotIndex) {
      const menu = document.createElement("div");
      menu.className = "options";
      menu.setAttribute("role", "listbox");
      options.forEach((opt, optIndex) => {
        const row = document.createElement("div");
        row.className = "option-row";

        const optBtn = document.createElement("button");
        optBtn.type = "button";
        optBtn.className = "option-word";
        optBtn.textContent = opt.en;
        optBtn.role = "option";
        if (optIndex === idxs[slotIndex]) optBtn.classList.add("selected");
        optBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const changed = idxs[slotIndex] !== optIndex;
          idxs[slotIndex] = optIndex;
          openDropdownSlot = null;
          renderTiles();
          renderPreview();
          renderScene();
          renderTranslation();
          if (changed) flashTile(slotIndex);
        });

        const optSpeakBtn = document.createElement("button");
        optSpeakBtn.type = "button";
        optSpeakBtn.className = "option-speak";
        optSpeakBtn.textContent = "🔊";
        optSpeakBtn.title = "Hear this word";
        optSpeakBtn.setAttribute("aria-label", "Hear this word");
        optSpeakBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          speak(opt.en);
        });

        row.appendChild(optBtn);
        row.appendChild(optSpeakBtn);
        menu.appendChild(row);
      });
      wrap.appendChild(menu);
    }

    tilesEl.appendChild(wrap);

    const punct = s.punctAfter && s.punctAfter[slotIndex];
    if (punct) {
      const p = document.createElement("span");
      p.className = "punct";
      p.textContent = punct;
      tilesEl.appendChild(p);
    }
  });
}

function flashTile(slotIndex) {
  const wraps = tilesEl.querySelectorAll(".tile-wrap");
  const wrap = wraps[slotIndex];
  if (!wrap) return;
  wrap.classList.remove("changed");
  // Force reflow so the animation restarts.
  void wrap.offsetWidth;
  wrap.classList.add("changed");
}

function renderPreview() {
  const s = currentSentence();
  previewEl.textContent = s.joinEN(currentSelection());
}

function renderScene() {
  const sel = currentSelection();
  const icons = sel.map((o) => o.icon).filter(Boolean);
  const display = icons.length ? icons.join("  ") : "💬";
  sceneEl.innerHTML = `<div style="font-size:56px; line-height:1; text-align:center;">${display}</div>`;
}

function renderTranslation() {
  const s = currentSentence();
  translationEl.textContent = s.joinAR(currentSelection());
}

function renderAll() {
  renderTabs();
  renderTiles();
  renderPreview();
  renderScene();
  renderTranslation();
}

document.addEventListener("click", () => {
  if (openDropdownSlot !== null) {
    openDropdownSlot = null;
    renderTiles();
  }
});

speakBtn.addEventListener("click", () => {
  const s = currentSentence();
  speak(s.joinEN(currentSelection()));
});

slowBtn.addEventListener("click", () => {
  state.slow = !state.slow;
  slowBtn.classList.toggle("active", state.slow);
  slowBtn.setAttribute("aria-pressed", String(state.slow));
});

shuffleBtn.addEventListener("click", () => {
  const s = currentSentence();
  const idxs = state.choices[s.id];
  s.slots.forEach((options, i) => {
    idxs[i] = Math.floor(Math.random() * options.length);
  });
  openDropdownSlot = null;
  renderAll();
});

resetBtn.addEventListener("click", () => {
  const s = currentSentence();
  state.choices[s.id] = s.slots.map(() => 0);
  openDropdownSlot = null;
  renderAll();
});

renderAll();
