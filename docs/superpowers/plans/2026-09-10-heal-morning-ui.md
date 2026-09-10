# heal 清晨留白 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 `web/` 视觉升级为清晨留白 × 雾蓝点缀，并为封存加入适中合封动效（尊重 reduced-motion），不改业务流程。

**Architecture:** CSS 设计令牌驱动全局样式；`index.html` 仅增语义 class 与封存动画壳；从 `app.js` 抽出可测的 `seal-motion.js`（reduced-motion 判断 + 动画完成 Promise），`confirmSeal` 在展示成功态前 await 动画。

**Tech Stack:** 纯静态 HTML/CSS/原生 ES modules；`node:test` 测 motion 辅助函数；无 UI/动画库。

## Global Constraints

- 色值必须使用规格令牌：`--bg #F7F8FA`、`--surface #FFFEFB`、`--ink #2A2E33`、`--ink-muted #6B7280`、`--mist #5B7C99`、`--mist-soft #E8EEF4`、`--line #D5DCE3`、`--danger #A65D5D`
- 标题衬线栈 / 正文无衬线栈按规格；不用 Inter/Roboto/Arial 作品牌字体
- 不改 IndexedDB、统计、mailto、四段业务步骤与校验逻辑
- 无构建工具、无 Lottie/音效、无暗色主题开关
- 合封约 1.2–1.8s；`prefers-reduced-motion: reduce` 时跳过合封、淡入成功态
- 规格：`docs/superpowers/specs/2026-09-10-heal-morning-ui-design.md`

---

## File Structure

| 文件 | 职责 |
|------|------|
| `web/css/app.css` | 令牌 + 四屏样式 + 合封 keyframes |
| `web/index.html` | 入口层次、信纸壳、封存动画节点 class |
| `web/js/seal-motion.js` | `prefersReducedMotion()`、`playSealMotion(el)` |
| `web/js/seal-motion.test.mjs` | motion 辅助单测 |
| `web/js/app.js` | `confirmSeal` 接入动画；其余业务不动 |
| `web/README.md` | 补一句 UI 主题说明（可选短段） |

---

### Task 1: CSS 设计令牌 + 全局壳

**Files:**
- Modify: `web/css/app.css`（文件头部插入 `:root` 与 `body` 重写；保留后续分区，本 Task 先打底）

**Interfaces:**
- Consumes: 规格 §2 色板与字体
- Produces: 全局可用 CSS 变量；`body` 使用 `--bg`/`--ink`/`--font-body`

- [ ] **Step 1: 在 `app.css` 最顶部写入令牌**

```css
:root {
  --bg: #f7f8fa;
  --surface: #fffefb;
  --ink: #2a2e33;
  --ink-muted: #6b7280;
  --mist: #5b7c99;
  --mist-soft: #e8eef4;
  --line: #d5dce3;
  --danger: #a65d5d;
  --radius: 6px;
  --font-display: "Songti SC", "Noto Serif SC", "STSong", "SimSun", serif;
  --font-body: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --content-width: 38rem;
}
```

- [ ] **Step 2: 重写 `body` 与基础按钮色**

```css
body {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
  line-height: 1.7;
  font-family: var(--font-body);
  color: var(--ink);
  background-color: var(--bg);
  background-image: radial-gradient(
    ellipse 80% 50% at 50% -10%,
    var(--mist-soft),
    transparent 70%
  );
  min-height: 100vh;
  box-sizing: border-box;
}

.btn-primary {
  background: var(--mist);
  border-color: var(--mist);
  color: #fff;
  border-radius: var(--radius);
  min-height: 2.75rem;
  padding: 0.65rem 1.35rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--ink);
  color: var(--ink);
  border-radius: var(--radius);
  min-height: 2.75rem;
}

.btn-danger {
  border-color: var(--danger);
  color: var(--danger);
  background: transparent;
  border-radius: var(--radius);
}
```

将旧的硬编码 `#333`/`#fff` 按钮规则改为上述（可删除冲突旧规则）。`.storage-degraded-notice` 改用 `--mist-soft` / `--ink-muted`，去掉土黄警示风。

- [ ] **Step 3: 浏览器快速看一眼**

Run: `cd web && python3 -m http.server 8080`  
打开入口：背景应为冷灰白 + 淡雾蓝光晕，主按钮雾蓝。

- [ ] **Step 4: Commit**

```bash
git add web/css/app.css
git commit -m "$(cat <<'EOF'
style(web): add morning-blank design tokens and base shell

EOF
)"
```

---

### Task 2: 入口首屏构图

**Files:**
- Modify: `web/index.html`（`#view-entry` + `.brand`）
- Modify: `web/css/app.css`

**Interfaces:**
- Consumes: 令牌
- Produces: 入口 DOM 层次：品牌 → 主句 → 短支撑 → CTA → 次链；援助仅页脚附近

- [ ] **Step 1: 调整入口 HTML 结构（文案语义不变）**

将 header 品牌与入口合并视觉：`#view-entry` 内结构示例：

```html
<section id="view-entry" class="view" hidden>
  <p class="brand brand-hero">heal</p>
  <h1 class="entry-title">写给这次分开 / 无法送达的人</h1>
  <p class="entry-lede">
    信件只留在这台设备上。这不是治疗，也不是挽回——只是一次私密安放。
  </p>
  <ul class="entry-privacy-quiet">
    <li>清缓存或换设备会丢失</li>
    <li>访问统计匿名且不含正文</li>
  </ul>
  <button type="button" id="btn-start-write" class="btn-primary">开始写信</button>
  <p class="entry-nav">
    <button type="button" id="btn-go-archive" class="link-btn">查看本机已安放</button>
  </p>
</section>
```

原「隐私说明」标题清单墙改为 `entry-lede` + 更短列表。页顶 `<header class="site-header">` 若与 hero 重复：入口显示时隐藏小 header，或删掉小 header 仅保留 hero brand（实现时二选一，避免双 brand）。援助链接保留在入口底部或页脚（规格：首屏不抢戏 → **移出主 CTA 上方，放入口最底部小字或仅页脚**）。

- [ ] **Step 2: 入口 CSS**

```css
.brand-hero {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 3.25rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  margin: 2.5rem 0 1.25rem;
  color: var(--ink);
}

.entry-title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 400;
  margin: 0 0 1rem;
  line-height: 1.45;
}

.entry-lede {
  color: var(--ink-muted);
  margin: 0 0 1rem;
  max-width: 28rem;
}

.entry-privacy-quiet {
  color: var(--ink-muted);
  font-size: 0.9rem;
  margin: 0 0 2rem;
  padding-left: 1.1rem;
}

.link-btn {
  color: var(--mist);
}
```

- [ ] **Step 3: 验收** — 首屏一眼看到 heal + 主句 + 一个雾蓝按钮

- [ ] **Step 4: Commit**

```bash
git add web/index.html web/css/app.css
git commit -m "$(cat <<'EOF'
style(web): restyle entry as single morning composition

EOF
)"
```

---

### Task 3: 写信信纸面

**Files:**
- Modify: `web/index.html`（`#view-write` 外包 `.letter-sheet`）
- Modify: `web/css/app.css`

**Interfaces:**
- Consumes: 令牌
- Produces: `.letter-sheet` 信纸容器样式；prompt 左雾蓝竖线

- [ ] **Step 1: HTML 包裹**

```html
<section id="view-write" class="view" hidden>
  <div class="letter-sheet">
    <!-- 现有 write 字段全部移入此 div -->
  </div>
</section>
```

- [ ] **Step 2: CSS**

```css
.letter-sheet {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem 1.35rem 1.75rem;
  box-shadow: 0 1px 0 rgba(42, 46, 51, 0.04);
}

.write-title {
  font-family: var(--font-display);
  font-weight: 400;
}

.write-field {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  color: var(--ink);
}

.write-field:focus {
  outline: 2px solid var(--mist-soft);
  border-color: var(--mist);
}

.prompt-text {
  background: var(--mist-soft);
  border-left: 3px solid var(--mist);
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--ink-muted);
}

.write-body {
  min-height: 14rem;
}
```

- [ ] **Step 3: 验收** — 写信区呈纸面；prompt 有雾蓝竖线

- [ ] **Step 4: Commit**

```bash
git add web/index.html web/css/app.css
git commit -m "$(cat <<'EOF'
style(web): add letter-sheet surface for write view

EOF
)"
```

---

### Task 4: `seal-motion.js` + 单测

**Files:**
- Create: `web/js/seal-motion.js`
- Create: `web/js/seal-motion.test.mjs`

**Interfaces:**
- Consumes: 无
- Produces:

```js
export function prefersReducedMotion(media = globalThis.matchMedia) // boolean
export function playSealMotion(element, opts = {}) 
// opts: { durationMs = 1500, reducedMotion? }
// Returns Promise that resolves when animation should end
// If reducedMotion (or prefersReducedMotion()): add class "is-sealed" only, resolve ~200ms
// Else: add "is-sealing", wait durationMs or animationend, then add "is-sealed", remove "is-sealing"
```

- [ ] **Step 1: 写失败测试**

```js
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
```

- [ ] **Step 2: Run — expect FAIL**

`node --test web/js/seal-motion.test.mjs`

- [ ] **Step 3: 实现 `seal-motion.js`**

完整实现上述 API；`durationMs` 默认 `1500`（落在 1.2–1.8s）。

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add web/js/seal-motion.js web/js/seal-motion.test.mjs
git commit -m "$(cat <<'EOF'
feat(web): add testable seal motion helper

EOF
)"
```

---

### Task 5: 封存动画壳 + CSS keyframes + 接入 `confirmSeal`

**Files:**
- Modify: `web/index.html`（`#view-seal` 增加 `#seal-motion-stage` 包裹确认摘要区）
- Modify: `web/css/app.css`
- Modify: `web/js/app.js`

**Interfaces:**
- Consumes: `playSealMotion` from `./seal-motion.js`
- Produces: 封存成功前播放动画；业务 `store.seal` 调用顺序保持：先 seal 成功，再动画，再显示 success（或先动画再显示——规格：确认后合封再已安放；**推荐：await store.seal → playSealMotion(stage) → show success**，避免动画中失败难回滚）

- [ ] **Step 1: HTML**

在 `#seal-confirm` 内用：

```html
<div id="seal-motion-stage" class="seal-motion-stage">
  <!-- summary + preview 放入 stage；checkbox/fieldset/actions 可留在 stage 外或内，动画主要作用于 stage -->
</div>
```

- [ ] **Step 2: CSS 动画**

```css
.seal-motion-stage {
  transform-origin: center top;
  transition: transform 1.5s ease-in, opacity 1.5s ease-in;
}

.seal-motion-stage.is-sealing {
  transform: scaleY(0.08) translateY(12px);
  opacity: 0.35;
}

.seal-motion-stage.is-sealed {
  opacity: 0;
}

@keyframes seal-fade-in {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: none; }
}

#seal-success.is-visible {
  animation: seal-fade-in 0.45s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .seal-motion-stage {
    transition: opacity 0.2s ease;
  }
  .seal-motion-stage.is-sealing {
    transform: none;
    opacity: 0.5;
  }
}
```

封存标题用 `--font-display`；成功标题更大、字重正常。

- [ ] **Step 3: 改 `confirmSeal`**

```js
import { playSealMotion } from "./seal-motion.js";
// ...
async function confirmSeal() {
  // ... existing validation + store.seal ...
  clearActiveLetterSession();
  const stage = document.getElementById("seal-motion-stage");
  await playSealMotion(stage);
  document.getElementById("seal-confirm").hidden = true;
  const success = document.getElementById("seal-success");
  success.hidden = false;
  success.classList.add("is-visible");
}
```

进入 `enterSealView` 时复位 stage classList（remove `is-sealing`/`is-sealed`）与 success `is-visible`。

- [ ] **Step 4: 手动验收** — 合封可见；DevTools 开 prefers-reduced-motion 时迅速到成功态；存储仍成功

- [ ] **Step 5: Commit**

```bash
git add web/index.html web/css/app.css web/js/app.js
git commit -m "$(cat <<'EOF'
feat(web): wire moderate seal-close motion into confirm flow

EOF
)"
```

---

### Task 6: 归档样式 + 页脚 + 回归

**Files:**
- Modify: `web/css/app.css`（归档、详情、footer）
- Modify: `web/README.md`（短段：UI 主题清晨留白）
- 可选微调 `web/index.html` class

**Interfaces:**
- Consumes: 令牌
- Produces: 归档列表细线风；详情信纸面；footer 细线 + muted

- [ ] **Step 1: 归档 CSS**

```css
.archive-item-btn {
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: var(--radius);
}

.archive-item-btn:hover {
  background: var(--mist-soft);
}

.archive-detail-body {
  background: var(--surface);
  border: 1px solid var(--line);
}

.site-footer {
  border-top: 1px solid var(--line);
  color: var(--ink-muted);
  margin-top: 3rem;
}

.archive-title,
.seal-title,
.seal-success-title {
  font-family: var(--font-display);
  font-weight: 400;
}
```

- [ ] **Step 2: 跑全部单测**

```bash
node --test web/js/storage.test.mjs web/js/analytics.test.mjs web/js/seal-motion.test.mjs
```

Expected: all pass

- [ ] **Step 3: 对照规格 §5 清单自检并更新 README 一句**

- [ ] **Step 4: Commit**

```bash
git add web/css/app.css web/README.md web/index.html
git commit -m "$(cat <<'EOF'
style(web): restyle archive footer and finish morning UI pass

EOF
)"
```

---

## Plan Self-Review

| 规格要求 | Task |
|----------|------|
| 设计令牌色板/字体 | 1 |
| 入口一个构图 | 2 |
| 写信信纸 + prompt 竖线 | 3 |
| 合封动效 + reduced-motion | 4–5 |
| 归档克制样式 | 6 |
| 不改业务存储/统计 | Global；仅 confirmSeal 插动画 |
| 验收清单 | 6 |

无产品 TBD；动画时长默认 1500ms 在规格范围内。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-10-heal-morning-ui.md`. Two execution options:

**1. Subagent-Driven (recommended)**  
**2. Inline Execution**

Which approach?
