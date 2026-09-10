# heal 网页本地 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付可在 http(s) 下使用的纯静态单页：写信 → 封存 → 本机归档；百度统计可配置；邮件反馈可用。

**Architecture:** 无构建静态站。`storage.js` 封装 IndexedDB（降级 localStorage）；`app.js` 驱动四段 UI；`analytics.js` 仅在配置了站点 ID 时注入百度脚本且永不上传信件正文。

**Tech Stack:** HTML5、CSS3、原生 ES modules；Node.js 内置 `node:test` 测 storage（内存后端）；本地预览用 `python3 -m http.server` 或 `npx serve`。

## Global Constraints

- 纯静态 HTML/CSS/JS；无 React/Vue；无构建步骤；无可写业务服务端
- 信件仅本机（IndexedDB → 降级 localStorage）；出站请求不得携带 `body`
- 百度统计：占位 `YOUR_BAIDU_SITE_ID`；空/占位时不加载脚本
- 反馈：`mailto:yincuilong@126.com?subject=heal%20%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88`；页脚可复制邮箱
- 文案：发泄与安放；非治疗、非挽回；信件仅本机；清缓存会丢
- 无「发送给对方」、无社交分享、无账号云同步
- 规格：`docs/superpowers/specs/2026-09-10-heal-web-local-mvp-design.md`
- 验收以 **http(s)** 为准，不以 `file://` 为准

---

## File Structure

| 文件 | 职责 |
|------|------|
| `web/index.html` | 单页壳、四段 DOM、页脚反馈 |
| `web/css/app.css` | 布局与可读样式（克制，非营销站） |
| `web/js/storage.js` | Letter CRUD；IndexedDB + localStorage 降级 |
| `web/js/storage.test.mjs` | storage 单元测试（内存后端） |
| `web/js/analytics.js` | 百度统计加载（可配置 ID） |
| `web/js/app.js` | 段切换、写信/封存/归档 UI |
| `web/README.md` | 如何本地预览、填百度 ID、部署 |

---

### Task 1: Scaffold `web/` shell + README

**Files:**
- Create: `web/index.html`
- Create: `web/css/app.css`
- Create: `web/js/app.js` (stub: `console.log("heal app stub")`)
- Create: `web/js/storage.js` (stub export empty object for later)
- Create: `web/js/analytics.js` (stub)
- Create: `web/README.md`

**Interfaces:**
- Consumes: 规格 §3.1 目录
- Produces: 可 http 打开的空壳；`index.html` 用 `<script type="module" src="./js/app.js">`

- [ ] **Step 1: 创建目录与空壳 HTML**

`web/index.html` 最小结构（四段容器 id 固定，供后续 Task 使用）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>heal — 写给无法送达的人</title>
  <link rel="stylesheet" href="./css/app.css" />
</head>
<body>
  <header class="site-header">
    <p class="brand">heal</p>
  </header>
  <main id="app">
    <section id="view-entry" class="view" hidden></section>
    <section id="view-write" class="view" hidden></section>
    <section id="view-seal" class="view" hidden></section>
    <section id="view-archive" class="view" hidden></section>
  </main>
  <footer class="site-footer">
    <a id="feedback-mailto" href="mailto:yincuilong@126.com?subject=heal%20%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88">意见反馈</a>
    <span> · </span>
    <button type="button" id="copy-email" data-email="yincuilong@126.com">复制邮箱</button>
  </footer>
  <script type="module" src="./js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 写入最小 CSS 与 JS stub**

`web/css/app.css`：基础排版（`body` 最大宽 ~40rem、居中、可读行高）；`.view[hidden]{display:none}`。

`web/js/app.js`：

```js
console.log("heal app stub");
```

`web/js/storage.js`：

```js
export {};
```

`web/js/analytics.js`：

```js
export function initAnalytics() {}
```

- [ ] **Step 3: 写 README**

`web/README.md` 必须包含：

1. 本地预览：`cd web && python3 -m http.server 8080` → 打开 `http://127.0.0.1:8080/`
2. 百度 ID：编辑 `js/analytics.js` 中 `BAIDU_SITE_ID`；获取步骤见规格 §3.2
3. 信件不上云；反馈邮箱 `yincuilong@126.com`
4. 不要用 `file://` 做功能验收

- [ ] **Step 4: 验证空壳可打开**

Run:

```bash
cd web && python3 -m http.server 8765
```

另开终端：`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8765/`  
Expected: `200`  
然后停掉 server（Ctrl+C）。

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "$(cat <<'EOF'
feat(web): scaffold static heal shell and README

EOF
)"
```

---

### Task 2: `storage.js` + 单元测试（内存后端）

**Files:**
- Create: `web/js/storage.test.mjs`
- Modify: `web/js/storage.js`

**Interfaces:**
- Consumes: 规格 Letter 模型
- Produces:

```js
/** @typedef {{ id: string, createdAt: number, sealedAt: number|null, status: "draft"|"sealed", scene: string, promptsUsed: string[], body: string, title: string, noContactUntil: number|null }} Letter */

export function createMemoryBackend() // Map-based; for tests
export async function openStorage(backend?) // default tries IndexedDB then localStorage
// openStorage returns:
//   createDraft({ scene, promptsUsed, body, title }): Promise<Letter>
//   saveDraft(letter): Promise<Letter>  // throws if sealed
//   seal(id, { noContactUntil? }): Promise<Letter>
//   get(id): Promise<Letter|null>
//   list(): Promise<Letter[]>  // sealed first by sealedAt desc, then drafts
//   remove(id): Promise<void>
```

- [ ] **Step 1: 写失败测试**

`web/js/storage.test.mjs`：

```js
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
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `node --test web/js/storage.test.mjs`  
Expected: FAIL（模块未实现或断言失败）

- [ ] **Step 3: 实现 `storage.js`**

实现要点（完整写入文件）：

1. `createMemoryBackend()`：`{ async getAll(), async put(letter), async delete(id) }`
2. IndexedDB backend：DB `heal-local`，store `letters`，keyPath `id`
3. localStorage backend：key `heal-local-letters`，JSON 数组（单封 body 建议上限约 50_000 字符，超限抛错）
4. `openStorage(backend?)`：若传入 backend 用它；否则 try IndexedDB，失败则 localStorage，再失败 throw
5. `id` 用 `crypto.randomUUID()`（Node 测试可用）；若无则简易 uuid
6. `saveDraft`：若 `status==="sealed"` throw `Error("sealed letter is read-only")`
7. `seal`：设 `status="sealed"`, `sealedAt=Date.now()`，可选 `noContactUntil`

- [ ] **Step 4: Run tests — expect PASS**

Run: `node --test web/js/storage.test.mjs`  
Expected: 2 passed

- [ ] **Step 5: Commit**

```bash
git add web/js/storage.js web/js/storage.test.mjs
git commit -m "$(cat <<'EOF'
feat(web): add local letter storage with memory-backed tests

EOF
)"
```

---

### Task 3: `analytics.js`（百度统计可配置）

**Files:**
- Modify: `web/js/analytics.js`
- Modify: `web/js/app.js`（调用 `initAnalytics()`）
- Create: `web/js/analytics.test.mjs`

**Interfaces:**
- Consumes: 无
- Produces:

```js
export const BAIDU_SITE_ID = "YOUR_BAIDU_SITE_ID"; // placeholder
export function isAnalyticsConfigured(id = BAIDU_SITE_ID): boolean
export function initAnalytics(doc = document, id = BAIDU_SITE_ID): void
// initAnalytics: if !isAnalyticsConfigured, return; else inject hm.js once
// MUST NOT accept or send letter body
```

- [ ] **Step 1: 写测试**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { isAnalyticsConfigured, initAnalytics } from "./analytics.js";

test("placeholder id is not configured", () => {
  assert.equal(isAnalyticsConfigured("YOUR_BAIDU_SITE_ID"), false);
  assert.equal(isAnalyticsConfigured(""), false);
  assert.equal(isAnalyticsConfigured("abc123"), true);
});

test("initAnalytics no-ops for placeholder and does not set src with body", () => {
  const scripts = [];
  const fakeDoc = {
    createElement(tag) {
      const el = { tagName: tag, src: "", async: false };
      return el;
    },
    getElementsByTagName() {
      return [{ parentNode: { insertBefore(node) { scripts.push(node); } } }];
    },
  };
  initAnalytics(fakeDoc, "YOUR_BAIDU_SITE_ID");
  assert.equal(scripts.length, 0);
  initAnalytics(fakeDoc, "deadbeefcafebabe");
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /hm\.baidu\.com\/hm\.js\?deadbeefcafebabe$/);
  assert.equal(String(scripts[0].src).includes("body="), false);
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `node --test web/js/analytics.test.mjs`

- [ ] **Step 3: 实现 analytics.js**

```js
export const BAIDU_SITE_ID = "YOUR_BAIDU_SITE_ID";

export function isAnalyticsConfigured(id = BAIDU_SITE_ID) {
  return Boolean(id) && id !== "YOUR_BAIDU_SITE_ID";
}

export function initAnalytics(doc = document, id = BAIDU_SITE_ID) {
  if (!isAnalyticsConfigured(id)) return;
  if (doc.getElementById && doc.getElementById("heal-baidu-hm")) return;
  window._hmt = window._hmt || [];
  const hm = doc.createElement("script");
  hm.id = "heal-baidu-hm";
  hm.src = "https://hm.baidu.com/hm.js?" + id;
  const s = doc.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
}
```

（Node 测试中 `window` 可能不存在：实现里用 `globalThis._hmt = globalThis._hmt || []`。）

- [ ] **Step 4: Run — expect PASS**；`app.js` 顶部 `import { initAnalytics } from "./analytics.js"; initAnalytics();`

- [ ] **Step 5: Commit**

```bash
git add web/js/analytics.js web/js/analytics.test.mjs web/js/app.js
git commit -m "$(cat <<'EOF'
feat(web): add configurable Baidu analytics loader

EOF
)"
```

---

### Task 4: 入口段 + 页脚复制邮箱

**Files:**
- Modify: `web/index.html`（填满 `#view-entry` 文案）
- Modify: `web/css/app.css`
- Modify: `web/js/app.js`

**Interfaces:**
- Consumes: `initAnalytics`；footer 已有 mailto
- Produces: `showView("entry"|"write"|"seal"|"archive")`；入口「开始写信」→ write

- [ ] **Step 1: 写入入口文案（必须含）**

- 标题级：写给这次分开 / 无法送达的人  
- 隐私三句：信件仅存本机；清缓存或换设备会丢失；访问统计匿名且不含正文  
- 边界：非治疗、非挽回  
- 按钮：开始写信  
- 链接：查看本机已安放（→ archive）  
- 援助：外链推荐使用 `https://www.crisis.org.cn/` 或卫健委/当地权威热线说明页（实现时选 1 个稳定 https 公益页，文案写「心理援助资源（非本产品危机干预）」）

- [ ] **Step 2: 实现 `showView` + 复制邮箱**

```js
function showView(name) {
  for (const el of document.querySelectorAll(".view")) {
    el.hidden = el.id !== "view-" + name;
  }
}

document.getElementById("copy-email").addEventListener("click", async () => {
  const email = "yincuilong@126.com";
  await navigator.clipboard.writeText(email);
});
```

入口显示：`showView("entry")` on boot。

- [ ] **Step 3: 手动验收**

Run: `cd web && python3 -m http.server 8765`  
打开浏览器：见入口文案、mailto、复制邮箱、无控制台报错。

- [ ] **Step 4: Commit**

```bash
git add web/index.html web/css/app.css web/js/app.js
git commit -m "$(cat <<'EOF'
feat(web): add entry view copy and feedback helpers

EOF
)"
```

---

### Task 5: 写信段（草稿自动保存）

**Files:**
- Modify: `web/index.html`（`#view-write` 表单）
- Modify: `web/js/app.js`

**Interfaces:**
- Consumes: `openStorage()` → createDraft/saveDraft/get
- Produces: 当前 `activeLetterId`；「去封存」进入 seal（body 非空）

- [ ] **Step 1: HTML 表单**

字段：

- 场景：`<select id="scene">` 选项：`分手` / `单恋` / `不得不分开` / `其他`
- prompt 提示区：`#prompt-text`（随场景切换 1–3 句固定文案，见下）
- `#title`、`#body` textarea
- 按钮：保存草稿、去封存、返回入口

场景 prompt 文案（写死在 app.js）：

```js
const PROMPTS = {
  "分手": ["最想对 TA 说却没能说的话", "若对方此刻能听见，你希望他/她明白什么", "你想为自己留下的一句了结"],
  "单恋": ["从未说出口的那句", "你希望被看见的心情", "你想对自己说的安放"],
  "不得不分开": ["现实里说不清的委屈", "你想拜托对方记住的", "你想拜托自己放下的"],
  "其他": ["写给无法送达的人", "此刻最堵在胸口的话", "封存前想留给自己的一句"],
};
```

- [ ] **Step 2: 逻辑**

- 进入 write：若无草稿则 `createDraft`；有 `?id=` 或 session 中的 id 则 `get` 加载（简单做法：用 `sessionStorage.activeLetterId`）
- `body`/`title`/`scene` change 时 debounce 400ms `saveDraft`
- 已 sealed 的信不可进入 write 编辑（若误入则只读提示并回 archive）
- 「去封存」：body trim 为空则 alert；否则 `showView("seal")`

- [ ] **Step 3: 手动验收**

http 下：开始写信 → 输入 → 刷新 → 内容仍在（同一草稿）。

- [ ] **Step 4: Commit**

```bash
git add web/index.html web/js/app.js web/css/app.css
git commit -m "$(cat <<'EOF'
feat(web): add write view with local draft autosave

EOF
)"
```

---

### Task 6: 封存仪式段（主动作）

**Files:**
- Modify: `web/index.html`（`#view-seal`）
- Modify: `web/js/app.js`

**Interfaces:**
- Consumes: `store.seal(id, { noContactUntil })`
- Produces: 封存成功 → 完成文案 → 可去 archive；无发送按钮

- [ ] **Step 1: UI**

- 摘要：标题、场景、字数（不展示全文到确认框外；确认区可折叠预览）
- 二次确认 checkbox：「我确认将此信安放在本机，无法通过本产品发送给对方」
- 可选：勾选「开始 7 / 14 / 30 天不再联系标记」（写 `noContactUntil`，无推送；文案说明仅本机日期）
- 按钮：确认封存、返回修改

- [ ] **Step 2: 封存成功态**

- 调用 `seal` 后展示「已安放」
- 再次声明非治疗非挽回；援助链接
- 按钮：查看归档、再写一封（清 session id 并 new draft）

- [ ] **Step 3: 手动验收**

封存后刷新：写信页不能改该信；归档可见。

- [ ] **Step 4: Commit**

```bash
git add web/index.html web/js/app.js web/css/app.css
git commit -m "$(cat <<'EOF'
feat(web): add seal ritual as primary action

EOF
)"
```

---

### Task 7: 归档列表（只读 / 删除）

**Files:**
- Modify: `web/index.html`（`#view-archive`）
- Modify: `web/js/app.js`
- Modify: `web/css/app.css`

**Interfaces:**
- Consumes: `list`, `get`, `remove`
- Produces: 列表 UI；详情只读；删除需 confirm

- [ ] **Step 1: 列表与详情**

- 列出 `status==="sealed"`（草稿可另区「未完成」或入口继续写）
- 点击打开只读正文；显示 `noContactUntil` 若有
- 删除：`confirm` 后 `remove` 并刷新列表
- 空态：「还没有安放的信」+ 去写信

- [ ] **Step 2: 手动验收**

封存两封 → 列表两条 → 删一 → 剩一；刷新仍正确。

- [ ] **Step 3: Commit**

```bash
git add web/index.html web/js/app.js web/css/app.css
git commit -m "$(cat <<'EOF'
feat(web): add local archive list read and delete

EOF
)"
```

---

### Task 8: 端到端验收 + README 收尾

**Files:**
- Modify: `web/README.md`（补验收清单勾选说明）
- Modify: 任意小修（文案/无障碍）

**Interfaces:**
- Consumes: 全站
- Produces: 规格 §4 验收全部可演示

- [ ] **Step 1: 跑自动化测试**

Run: `node --test web/js/storage.test.mjs web/js/analytics.test.mjs`  
Expected: all pass

- [ ] **Step 2: 浏览器对照规格 §4**

| # | 检查 | 结果 |
|---|------|------|
| 1 | 入口→写信→封存→归档 | |
| 2 | 刷新持久化；删除生效 | |
| 3 | Network 无信件正文出站（可有 hm.js） | |
| 4 | 占位 ID 时无 hm.js；换成假 ID 形态应注入（真实 PV 等正式 ID） | |
| 5 | mailto 收件人正确；复制邮箱可用 | |
| 6 | 无框架、无业务后端 | |

- [ ] **Step 3: README 写明测试命令与验收**

- [ ] **Step 4: Commit**

```bash
git add web/
git commit -m "$(cat <<'EOF'
docs(web): record MVP acceptance notes and verify checklist

EOF
)"
```

---

## Plan Self-Review

| 规格项 | Task |
|--------|------|
| 四段流程 | 4–7 |
| IndexedDB + 降级 | 2 |
| 百度统计可配置、不传正文 | 3 |
| mailto + 可复制邮箱 | 1, 4 |
| 隐私/非治疗文案 + 援助链 | 4, 6 |
| 明确不做（无发送/云/框架） | Global + 验收 |
| 成功标准 / §4 验收 | 8 |

占位符：`YOUR_BAIDU_SITE_ID` 为规格允许的部署配置，非未决产品决策。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-10-heal-web-local-mvp.md`. Two execution options:

**1. Subagent-Driven (recommended)** — 每 Task 新子代理 + 审查  

**2. Inline Execution** — 本会话按 Task 连续实现  

Which approach?
