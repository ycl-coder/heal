import { initAnalytics } from "./analytics.js";
import { playSealMotion } from "./seal-motion.js";
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

/** @type {string|null} */
let selectedArchiveId = null;

function formatDisplayDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayTitle(letter) {
  return letter.title.trim() || "（无标题）";
}

function createArchiveListItem(letter, onSelect) {
  const li = document.createElement("li");
  li.className = "archive-item";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "archive-item-btn";
  btn.dataset.id = letter.id;
  const title = document.createElement("span");
  title.className = "archive-item-title";
  title.textContent = displayTitle(letter);
  const meta = document.createElement("span");
  meta.className = "archive-item-meta";
  if (letter.status === "sealed") {
    meta.textContent = `${letter.scene} · ${formatDisplayDate(letter.sealedAt ?? letter.createdAt)}`;
  } else {
    meta.textContent = `${letter.scene} · 草稿`;
  }
  btn.append(title, meta);
  btn.addEventListener("click", () => {
    onSelect(letter.id);
  });
  li.append(btn);
  return li;
}

function renderArchiveList(letters) {
  const sealed = letters.filter((item) => item.status === "sealed");
  const drafts = letters.filter((item) => item.status === "draft");
  const emptyEl = document.getElementById("archive-empty");
  const listViewEl = document.getElementById("archive-list-view");
  const sealedListEl = document.getElementById("archive-sealed-list");
  const draftsSectionEl = document.getElementById("archive-drafts-section");
  const draftListEl = document.getElementById("archive-draft-list");
  const isEmpty = sealed.length === 0 && drafts.length === 0;

  emptyEl.hidden = !isEmpty;
  listViewEl.hidden = isEmpty;
  sealedListEl.replaceChildren();
  draftListEl.replaceChildren();

  for (const letter of sealed) {
    sealedListEl.append(createArchiveListItem(letter, openArchiveDetail));
  }

  draftsSectionEl.hidden = drafts.length === 0;
  for (const letter of drafts) {
    draftListEl.append(createArchiveListItem(letter, continueDraftFromArchive));
  }
}

function showArchiveListMode() {
  selectedArchiveId = null;
  document.getElementById("archive-list-view").hidden = false;
  document.getElementById("archive-empty").hidden =
    document.getElementById("archive-sealed-list").children.length === 0 &&
    document.getElementById("archive-draft-list").children.length === 0;
  document.getElementById("archive-detail").hidden = true;
}

function populateArchiveDetail(letter) {
  document.getElementById("archive-detail-title").textContent = displayTitle(letter);
  document.getElementById("archive-detail-scene").textContent = letter.scene;
  document.getElementById("archive-detail-date").textContent = formatDisplayDate(
    letter.sealedAt ?? letter.createdAt,
  );
  const noContactEl = document.getElementById("archive-detail-nocontact");
  if (letter.noContactUntil) {
    noContactEl.hidden = false;
    document.getElementById("archive-detail-nocontact-date").textContent = formatDisplayDate(
      letter.noContactUntil,
    );
  } else {
    noContactEl.hidden = true;
  }
  document.getElementById("archive-detail-body").textContent = letter.body;
}

async function openArchiveDetail(id) {
  await initStore();
  const letter = await store.get(id);
  if (!letter || letter.status !== "sealed") {
    return;
  }
  selectedArchiveId = id;
  populateArchiveDetail(letter);
  document.getElementById("archive-list-view").hidden = true;
  document.getElementById("archive-empty").hidden = true;
  document.getElementById("archive-detail").hidden = false;
}

async function continueDraftFromArchive(id) {
  setActiveLetterId(id);
  await enterWriteView();
}

async function enterArchiveView() {
  await initStore();
  showArchiveListMode();
  const letters = await store.list();
  renderArchiveList(letters);
  showView("archive");
}

async function deleteSelectedArchiveLetter() {
  if (!selectedArchiveId || !store) {
    return;
  }
  const confirmed = window.confirm("确定删除这封信？删除后无法恢复。");
  if (!confirmed) {
    return;
  }
  await store.remove(selectedArchiveId);
  if (sessionStorage.getItem(ACTIVE_ID_KEY) === selectedArchiveId) {
    clearActiveLetterSession();
  }
  await enterArchiveView();
}

function showStorageDegradedNotice() {
  const noticeEl = document.getElementById("storage-degraded-notice");
  if (noticeEl) {
    noticeEl.hidden = false;
  }
}

async function initStore() {
  if (!store) {
    store = await openStorage();
    if (store.isDegraded) {
      showStorageDegradedNotice();
    }
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
  const success = document.getElementById("seal-success");
  success.hidden = true;
  success.classList.remove("is-visible");
  const stage = document.getElementById("seal-motion-stage");
  stage.classList.remove("is-sealing", "is-sealed");
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
  clearActiveLetterSession();
  const stage = document.getElementById("seal-motion-stage");
  await playSealMotion(stage);
  document.getElementById("seal-confirm").hidden = true;
  const success = document.getElementById("seal-success");
  success.hidden = false;
  success.classList.add("is-visible");
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
      clearActiveLetterSession();
    } else if (letter) {
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
  enterArchiveView().catch((err) => console.error("enter archive failed", err));
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
  enterArchiveView().catch((err) => console.error("enter archive failed", err));
});

document.getElementById("btn-archive-write").addEventListener("click", () => {
  enterWriteView().catch((err) => console.error("enter write failed", err));
});

document.getElementById("btn-archive-back").addEventListener("click", () => {
  showArchiveListMode();
});

document.getElementById("btn-archive-delete").addEventListener("click", () => {
  deleteSelectedArchiveLetter().catch((err) => console.error("delete archive failed", err));
});

document.getElementById("btn-archive-back-entry").addEventListener("click", () => {
  showView("entry");
});

document.getElementById("btn-seal-write-another").addEventListener("click", () => {
  clearActiveLetterSession();
  enterWriteView().catch((err) => console.error("write another failed", err));
});

document.getElementById("btn-back-entry").addEventListener("click", () => {
  showView("entry");
});

showView("entry");
