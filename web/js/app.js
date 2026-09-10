import { initAnalytics } from "./analytics.js";
import { openStorage } from "./storage.js";

initAnalytics();

const PROMPTS = {
  分手: ["最想对 TA 说却没能说的话", "若对方此刻能听见，你希望他/她明白什么", "你想为自己留下的一句了结"],
  单恋: ["从未说出口的那句", "你希望被看见的心情", "你想对自己说的安放"],
  不得不分开: ["现实里说不清的委屈", "你想拜托对方记住的", "你想拜托自己放下的"],
  其他: ["写给无法送达的人", "此刻最堵在胸口的话", "封存前想留给自己的一句"],
};

const ACTIVE_ID_KEY = "activeLetterId";
const AUTOSAVE_MS = 400;
const DEFAULT_SCENE = "分手";
const MS_PER_DAY = 86400000;

/** @type {Awaited<ReturnType<typeof openStorage>>|null} */
let store = null;
/** @type {import("./storage.js").Letter|null} */
let activeLetter = null;
/** @type {ReturnType<typeof setTimeout>|null} */
let autosaveTimer = null;

export function showView(name) {
  for (const el of document.querySelectorAll(".view")) {
    el.hidden = el.id !== "view-" + name;
  }
}

async function initStore() {
  if (!store) {
    store = await openStorage();
  }
  return store;
}

function getLetterIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function getActiveLetterId() {
  return getLetterIdFromURL() || sessionStorage.getItem(ACTIVE_ID_KEY);
}

function setActiveLetterId(id) {
  sessionStorage.setItem(ACTIVE_ID_KEY, id);
}

function renderPrompts(scene) {
  const el = document.getElementById("prompt-text");
  const lines = PROMPTS[scene] ?? PROMPTS[DEFAULT_SCENE];
  el.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
}

function populateForm(letter) {
  document.getElementById("scene").value = letter.scene;
  document.getElementById("title").value = letter.title;
  document.getElementById("body").value = letter.body;
  renderPrompts(letter.scene);
}

function collectFormData() {
  const scene = document.getElementById("scene").value;
  return {
    scene,
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    promptsUsed: PROMPTS[scene] ?? PROMPTS[DEFAULT_SCENE],
  };
}

async function persistDraft() {
  if (!activeLetter || !store) {
    return;
  }
  activeLetter = {
    ...activeLetter,
    ...collectFormData(),
  };
  await store.saveDraft(activeLetter);
}

function clearAutosaveTimer() {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
    autosaveTimer = null;
  }
}

function scheduleAutosave() {
  clearAutosaveTimer();
  autosaveTimer = setTimeout(() => {
    persistDraft().catch((err) => console.error("autosave failed", err));
  }, AUTOSAVE_MS);
}

function resetSealView() {
  document.getElementById("seal-confirm").hidden = false;
  document.getElementById("seal-success").hidden = true;
}

function populateSealSummary(letter) {
  const titleEl = document.getElementById("seal-summary-title");
  titleEl.textContent = letter.title.trim() || "（无标题）";
  document.getElementById("seal-summary-scene").textContent = letter.scene;
  document.getElementById("seal-summary-count").textContent = String(letter.body.length);
  document.getElementById("seal-preview-body").textContent = letter.body;
  document.getElementById("seal-confirm-check").checked = false;
  document.getElementById("btn-confirm-seal").disabled = true;
  const noneRadio = document.querySelector('input[name="noContactDays"][value=""]');
  if (noneRadio) {
    noneRadio.checked = true;
  }
}

function getNoContactUntil() {
  const selected = document.querySelector('input[name="noContactDays"]:checked');
  if (!selected || !selected.value) {
    return null;
  }
  const days = Number(selected.value);
  return Date.now() + days * MS_PER_DAY;
}

async function enterSealView() {
  resetSealView();
  if (!activeLetter) {
    await enterWriteView();
    return;
  }
  await persistDraft();
  activeLetter = {
    ...activeLetter,
    ...collectFormData(),
  };
  populateSealSummary(activeLetter);
  showView("seal");
}

async function confirmSeal() {
  if (!activeLetter || !store) {
    return;
  }
  const noContactUntil = getNoContactUntil();
  activeLetter = await store.seal(activeLetter.id, { noContactUntil });
  document.getElementById("seal-confirm").hidden = true;
  document.getElementById("seal-success").hidden = false;
}

function clearActiveLetterSession() {
  sessionStorage.removeItem(ACTIVE_ID_KEY);
  activeLetter = null;
}

async function enterWriteView() {
  await initStore();
  const id = getActiveLetterId();
  activeLetter = null;

  if (id) {
    const letter = await store.get(id);
    if (letter?.status === "sealed") {
      alert("此信已封存，无法编辑");
      showView("archive");
      return;
    }
    if (letter) {
      activeLetter = letter;
    }
  }

  if (!activeLetter) {
    activeLetter = await store.createDraft({
      scene: DEFAULT_SCENE,
      promptsUsed: PROMPTS[DEFAULT_SCENE],
      body: "",
      title: "",
    });
  }

  setActiveLetterId(activeLetter.id);
  populateForm(activeLetter);
  showView("write");
}

document.getElementById("copy-email").addEventListener("click", async () => {
  const email = "yincuilong@126.com";
  await navigator.clipboard.writeText(email);
});

document.getElementById("btn-start-write").addEventListener("click", () => {
  enterWriteView().catch((err) => console.error("enter write failed", err));
});

document.getElementById("btn-go-archive").addEventListener("click", () => {
  showView("archive");
});

document.getElementById("scene").addEventListener("change", () => {
  renderPrompts(document.getElementById("scene").value);
  scheduleAutosave();
});

document.getElementById("title").addEventListener("input", scheduleAutosave);
document.getElementById("body").addEventListener("input", scheduleAutosave);

document.getElementById("btn-save-draft").addEventListener("click", () => {
  clearAutosaveTimer();
  persistDraft().catch((err) => console.error("save draft failed", err));
});

document.getElementById("btn-go-seal").addEventListener("click", () => {
  clearAutosaveTimer();
  persistDraft()
    .then(() => {
      const body = document.getElementById("body").value.trim();
      if (!body) {
        alert("请先写下正文");
        return;
      }
      return enterSealView();
    })
    .catch((err) => console.error("go seal failed", err));
});

document.getElementById("seal-confirm-check").addEventListener("change", (event) => {
  document.getElementById("btn-confirm-seal").disabled = !event.target.checked;
});

document.getElementById("btn-confirm-seal").addEventListener("click", () => {
  confirmSeal().catch((err) => console.error("seal failed", err));
});

document.getElementById("btn-back-write").addEventListener("click", () => {
  showView("write");
});

document.getElementById("btn-seal-go-archive").addEventListener("click", () => {
  showView("archive");
});

document.getElementById("btn-seal-write-another").addEventListener("click", () => {
  clearActiveLetterSession();
  enterWriteView().catch((err) => console.error("write another failed", err));
});

document.getElementById("btn-back-entry").addEventListener("click", () => {
  showView("entry");
});

showView("entry");
