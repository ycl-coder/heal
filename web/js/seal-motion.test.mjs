import { test } from "node:test";
import assert from "node:assert/strict";
import { prefersReducedMotion, playSealMotion } from "./seal-motion.js";

test("prefersReducedMotion reads matchMedia", () => {
  assert.equal(
    prefersReducedMotion(() => ({ matches: true })),
    true,
  );
  assert.equal(
    prefersReducedMotion(() => ({ matches: false })),
    false,
  );
});

test("playSealMotion skips long motion when reduced", async () => {
  const classes = new Set();
  const el = {
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
    },
    addEventListener() {},
  };
  const t0 = Date.now();
  await playSealMotion(el, { reducedMotion: true, durationMs: 1500 });
  assert.ok(Date.now() - t0 < 800);
  assert.ok(classes.has("is-sealed"));
  assert.equal(classes.has("is-sealing"), false);
});
