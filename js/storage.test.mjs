import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryBackend, openStorage } from "./storage.js";

test("createDraft then seal makes letter read-only via saveDraft throw", async () => {
  const store = await openStorage(createMemoryBackend());
  const draft = await store.createDraft({
    scene: "分手",
    promptsUsed: ["最想说的三句话"],
    body: "你好",
    title: "你好",
  });
  assert.equal(draft.status, "draft");
  const sealed = await store.seal(draft.id, {});
  assert.equal(sealed.status, "sealed");
  assert.ok(sealed.sealedAt);
  await assert.rejects(() => store.saveDraft({ ...sealed, body: "改" }), /sealed|只读|read-only/i);
});

test("list returns sealed letters and remove deletes", async () => {
  const store = await openStorage(createMemoryBackend());
  const d = await store.createDraft({
    scene: "单恋",
    promptsUsed: [],
    body: "a",
    title: "a",
  });
  await store.seal(d.id, { noContactUntil: Date.now() + 86400000 });
  const all = await store.list();
  assert.equal(all.length, 1);
  await store.remove(d.id);
  assert.equal((await store.list()).length, 0);
});
