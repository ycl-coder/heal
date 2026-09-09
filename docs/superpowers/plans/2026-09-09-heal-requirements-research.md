# heal 需求调研 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按已批准规格完成桌面需求调研，产出可决策报告：要不要做 + 若做则 MVP 形态/定位/最小功能集。

**Architecture:** 形态对照为主（A–E 五类竞品池统一打分），用户旅程四阶段作补强；全部为 Markdown 桌面研究，不写产品代码。最终一份报告 + 一张评分工作表，用规格中的 go/no-go 规则锁死结论。

**Tech Stack:** Markdown 文档；桌面信息源（应用商店页、产品官网/介绍、小红书/公开评测/内容热度观察）；可选 WebSearch；Git 提交文档里程碑。

## Global Constraints

- 市场：中国大陆优先；海外样本每形态最多 1 个参照
- 人群：广义「失恋 / 失去亲密关系」
- 资源：个人副业、低成本、单人可交付；MVP 主动作应可在约 2–4 周业余做出演示
- 商业化：先验证有人用；短期不追求赚钱；可变现难度仅作备注
- 禁止：产品代码、完整 UI、融资 BP、临床/治疗宣称、编造下载量或营收
- 质量：每形态 ≥3 大陆样本；评分 1–5 且每分一句依据；不确定标置信度（高/中/低）；区分事实与推断
- 规格来源：`docs/superpowers/specs/2026-09-09-heal-requirements-research-design.md`

---

## File Structure

| 文件 | 职责 |
|------|------|
| `docs/superpowers/specs/2026-09-09-heal-requirements-research-design.md` | 已批准规格（只读，执行中不改规则） |
| `docs/research/competitor-scores.md` | 五形态样本清单 + 统一评分表（工作表） |
| `docs/research/2026-09-09-heal-requirements-research-report.md` | 正式调研报告（七章结构，含最终决策） |

---

### Task 1: 搭建调研骨架与工作表模板

**Files:**
- Create: `docs/research/competitor-scores.md`
- Create: `docs/research/2026-09-09-heal-requirements-research-report.md`

**Interfaces:**
- Consumes: 规格 §2、§5
- Produces: 空结构报告七章标题；评分表列定义（供 Task 3–7 填行）

- [ ] **Step 1: 创建目录并写入评分工作表**

创建 `docs/research/competitor-scores.md`，内容必须包含以下结构（可原样粘贴后填空）：

```markdown
# heal 竞品评分工作表

评分维度（1–5）：直击度 | 即时性 | 安全性 | 副业可复制 | 差异化空间  
每分必须附「依据」一句。置信度：高/中/低。禁止编造下载量/营收。

## 形态 A — 私密书写 / 情绪日记

| 产品 | 大陆/海外 | 核心功能 | 获客 | 短板 | 直击 | 即时 | 安全 | 副业 | 差异 | 依据摘要 | 置信度 | 与 heal 重合 |
|------|-----------|----------|------|------|------|------|------|------|------|----------|--------|--------------|
|      | 大陆      |          |      |      |      |      |      |      |      |          |        |              |

（本表至少 3 行大陆样本；可选 1 行海外参照）

## 形态 B — 匿名树洞 / 倾诉社区
（同上表头，至少 3 行大陆）

## 形态 C — AI 陪伴 / 疏导对话
（同上表头，至少 3 行大陆）

## 形态 D — 仪式 / 关系归档工具
（同上表头，至少 3 行大陆；若不足 3 个独立 App，可用「小程序/内容向仪式玩法/备忘录模板」计为样本，并在依据中说明形态边界）

## 形态 E — 内容 / 共鸣型
（同上表头；样本可以是平台话题/账号/产品，至少 3 个大陆观察对象）

## 形态均分汇总

| 形态 | 直击均分 | 即时均分 | 安全均分 | 副业均分 | 差异均分 | 一句话缺口 |
|------|----------|----------|----------|----------|----------|------------|
| A    |          |          |          |          |          |            |
| B    |          |          |          |          |          |            |
| C    |          |          |          |          |          |            |
| D    |          |          |          |          |          |            |
| E    |          |          |          |          |          |            |
```

- [ ] **Step 2: 写入报告骨架**

创建 `docs/research/2026-09-09-heal-requirements-research-report.md`：

```markdown
# heal 需求调研报告

**日期：** 2026-09-09  
**状态：** 进行中  
**对应规格：** `docs/superpowers/specs/2026-09-09-heal-requirements-research-design.md`  
**约束摘要：** 大陆优先；副业单人；先验证使用；非治疗非挽回。

## 1. 背景与决策问题

（待填：复述初衷；本报告要拍板「做不做 + MVP」）

## 2. 用户旅程痛点补强（四阶段）

（待填）

## 3. 五形态竞品对照与评分表

（待填：摘要 + 指向 `docs/research/competitor-scores.md`）

## 4. 方向校验结论（维持 / 微调 / 转向）

（待填：必须三选一写死）

## 5. 前景与风险

（待填：值得试 / 窄门可试 / 不建议现在做）

## 6. 决策建议

### 6.1 做或不做
（待填）

### 6.2 若做：MVP
- 主形态：
- 一句话定位：
- 优先旅程阶段（1–2 个）：
- 最小功能集（列表）：
- 明确不做：

### 6.3 若暂缓
- 原因：
- 替代观察项：

## 7. 待验证假设（最多 5 条）

| # | 假设 | 建议验证方式 | 置信度 |
|---|------|--------------|--------|
| 1 |      |              |        |
```

- [ ] **Step 3: 自检骨架**

Run: `test -f docs/research/competitor-scores.md && test -f docs/research/2026-09-09-heal-requirements-research-report.md && rg -n "^## " docs/research/2026-09-09-heal-requirements-research-report.md`

Expected: 两个文件存在；报告含 `## 1.` … `## 7.` 七个一级章节。

- [ ] **Step 4: Commit**

```bash
git add docs/research/competitor-scores.md docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: scaffold heal research report and score worksheets

EOF
)"
```

---

### Task 2: 填写用户旅程四阶段痛点

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（§1、§2）

**Interfaces:**
- Consumes: 规格 §1、§2.3
- Produces: 四阶段「需要 / 现有替代 / 缺口」表；建议 MVP 优先阶段候选（可标「待竞品后确认」）

- [ ] **Step 1: 写 §1 背景与决策问题**

在报告 §1 写入（可微调措辞，不可改变约束）：

- 初衷：爱而不得 / 不得不分开 → 发泄与安放工具  
- 决策问题两句：① 值不值得副业投入 ② 若值得，MVP 落在哪一形态  
- 约束表：大陆、广义失去、副业、先验证使用、非治疗非挽回  

- [ ] **Step 2: 写 §2 旅程表**

用桌面观察（小红书/公开讨论中的分手、单恋、不得不分开叙事）填写下表，每格 1–3 句；标置信度：

```markdown
| 阶段 | 用户在做什么 / 感觉 | 常见替代行为 | 未被很好满足的点 | 更匹配形态 | 置信度 |
|------|---------------------|--------------|------------------|------------|--------|
| 冲击期 | | | | B/C | |
| 反刍期 | | | | A/C/D | |
| 抽离期 | | | | D/A | |
| 重建期 | | | | A/E 或退出 | |
```

文末加两句：

1. 「各阶段最缺的是：…」  
2. 「副业 MVP 优先候选阶段（待竞品校验）：…」  

信息源示例查询（执行时实际检索并在段末列 2–4 个来源链接或标题）：

- `分手 难受 怎么办 小红书`
- `单恋 发泄 树洞`
- `分手 删照片 断联 仪式`

- [ ] **Step 3: 验收**

Run: `rg -n "冲击期|反刍期|抽离期|重建期|置信度" docs/research/2026-09-09-heal-requirements-research-report.md`

Expected: 四阶段均出现；§2 含置信度列或标注。

- [ ] **Step 4: Commit**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: add journey-stage pain points for heal research

EOF
)"
```

---

### Task 3: 形态 A — 私密书写 / 情绪日记竞品

**Files:**
- Modify: `docs/research/competitor-scores.md`（形态 A 区）

**Interfaces:**
- Consumes: 评分维度定义（Task 1）
- Produces: ≥3 大陆样本完整行；可选 1 海外参照

- [ ] **Step 1: 建样本池并检索**

检索并选定至少 3 个大陆产品（日记/情绪记录/心情笔记类）。推荐查询：

- `情绪日记 App 推荐`
- `心情日记 隐私`
- App Store / 应用宝 搜索：`情绪日记`、`心情记录`

对每款记录：产品名、平台、一句话定位、是否提到分手/失恋场景（事实）。

- [ ] **Step 2: 填评分行**

在 `competitor-scores.md` 形态 A 表填满 ≥3 行；五维各 1–5 + 依据摘要 + 置信度 + 与 heal 重合（高/中/低/无）。

- [ ] **Step 3: 写形态 A 一句话缺口**

在「形态均分汇总」中先填 A 行均分（可先手算）与「一句话缺口」。

- [ ] **Step 4: 验收**

Run: `rg -n "形态 A|私密书写" -A 20 docs/research/competitor-scores.md | head -n 40`

Expected: 至少 3 个产品名；每行可见数字分。

- [ ] **Step 5: Commit**

```bash
git add docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: score form-A journaling competitors for heal

EOF
)"
```

---

### Task 4: 形态 B — 匿名树洞 / 倾诉社区竞品

**Files:**
- Modify: `docs/research/competitor-scores.md`（形态 B 区）

**Interfaces:**
- Consumes: 同 Task 1 表头
- Produces: ≥3 大陆样本完整行

- [ ] **Step 1: 建样本池并检索**

查询示例：`树洞 App`、`匿名倾诉`、`倾听 树洞`、`深夜树洞`。优先大陆产品；注明是否强依赖 UGC/审核。

- [ ] **Step 2: 填评分行（≥3）+ B 均分与一句话缺口**

特别关注维度：安全性（隐私/二次伤害）、副业可复制（社区冷启动成本应拉低副业分）。

- [ ] **Step 3: 验收**

Run: `rg -n "形态 B|树洞" docs/research/competitor-scores.md`

Expected: 形态 B 区有 ≥3 样本名。

- [ ] **Step 4: Commit**

```bash
git add docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: score form-B tree-hole competitors for heal

EOF
)"
```

---

### Task 5: 形态 C — AI 陪伴 / 疏导对话竞品

**Files:**
- Modify: `docs/research/competitor-scores.md`（形态 C 区）

**Interfaces:**
- Consumes: 同 Task 1 表头
- Produces: ≥3 大陆样本完整行；可选 1 海外参照

- [ ] **Step 1: 建样本池并检索**

查询示例：`AI 情感陪伴 App`、`AI 心理 倾诉`、`聊会`、`AI 树洞`。记录：是否主打分手；是否偏通用陪伴；是否有订阅门槛（事实描述即可，不编造营收）。

- [ ] **Step 2: 填评分行（≥3）+ C 均分与一句话缺口**

特别关注：直击度（泛陪伴 vs 失去场景）、副业可复制（模型/API 成本）、安全性（依赖/不当建议）。

- [ ] **Step 3: 验收**

Run: `rg -n "形态 C|AI" docs/research/competitor-scores.md | head -n 30`

Expected: ≥3 样本；含安全性与副业相关依据字样或分数。

- [ ] **Step 4: Commit**

```bash
git add docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: score form-C AI companion competitors for heal

EOF
)"
```

---

### Task 6: 形态 D — 仪式 / 关系归档工具竞品

**Files:**
- Modify: `docs/research/competitor-scores.md`（形态 D 区）

**Interfaces:**
- Consumes: 同 Task 1 表头
- Produces: ≥3 大陆样本（允许含小程序、内容向仪式玩法、清单模板，须在依据中标明「非独立 App」）

- [ ] **Step 1: 建样本池并检索**

查询示例：`分手 仪式`、`烧掉信件`、`分手清单`、`断联 归档`、`写给前任的信 不发送`。若独立 App 不足 3 个，用规格允许的边界扩展样本，并降低「产品成熟度」相关表述的置信度。

- [ ] **Step 2: 填评分行（≥3）+ D 均分与一句话缺口**

特别关注：直击度通常应较高；副业可复制通常应较高；差异化空间可能最高或最低——如实写。

- [ ] **Step 3: 验收**

Run: `rg -n "形态 D|仪式|归档" docs/research/competitor-scores.md`

Expected: ≥3 样本行。

- [ ] **Step 4: Commit**

```bash
git add docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: score form-D ritual and archive competitors for heal

EOF
)"
```

---

### Task 7: 形态 E — 内容 / 共鸣型竞品与替代

**Files:**
- Modify: `docs/research/competitor-scores.md`（形态 E 区）

**Interfaces:**
- Consumes: 同 Task 1 表头
- Produces: ≥3 大陆观察对象（可为平台话题、典型账号形态、情绪电台/播客产品）

- [ ] **Step 1: 建观察池并检索**

查询示例：`失恋 小红书`、`分手文案 抖音`、`网易云 热评 失恋`、`情绪电台`。评分时把「刷内容发泄」当作真实替代品，不要只评垂直 App。

- [ ] **Step 2: 填评分行（≥3）+ E 均分与一句话缺口**

特别关注：即时性高、直击度中高、副业做「又一个内容平台」应极低分；差异化空间通常低。

- [ ] **Step 3: 填完「形态均分汇总」全表**

五形态均分与一句话缺口全部非空。

- [ ] **Step 4: 验收**

Run: `rg -n "形态均分汇总" -A 12 docs/research/competitor-scores.md`

Expected: A–E 五行均有数字均分与缺口句。

- [ ] **Step 5: Commit**

```bash
git add docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: score form-E content alternatives and finish form averages

EOF
)"
```

---

### Task 8: 竞品综合写入报告 §3

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（§3）

**Interfaces:**
- Consumes: `docs/research/competitor-scores.md` 全表
- Produces: 报告 §3 可读摘要（不复制全部大表，但必须有对照结论）

- [ ] **Step 1: 写 §3**

必须包含：

1. 指向工作表路径的链接/相对路径  
2. 五形态「谁做得好 / 谁没对准失去场景 / 副业可做性」对照段（每形态 3–6 句）  
3. 一张精简对照表：

```markdown
| 形态 | 直击 | 副业可复制 | 差异化 | 对 heal 的含义 |
|------|------|------------|--------|----------------|
| A | | | | |
| B | | | | |
| C | | | | |
| D | | | | |
| E | | | | |
```

（表中可用「高/中/低」转写均分，并在脚注说明换算。）

- [ ] **Step 2: 验收**

Run: `rg -n "competitor-scores|形态 A|对 heal 的含义" docs/research/2026-09-09-heal-requirements-research-report.md`

Expected: §3 含工作表引用与五形态含义。

- [ ] **Step 3: Commit**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: synthesize competitor findings into research report

EOF
)"
```

---

### Task 9: 方向校验（规格 §3 规则）

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（§4）

**Interfaces:**
- Consumes: 规格 §3.1–§3.3；报告 §2–§3
- Produces: 校验表填写结果；**维持 / 微调 / 转向** 三选一写死句

- [ ] **Step 1: 填校验对照**

按规格表格逐项写「观察到的信号」与「建议动作」：人群、场景、动作、承诺。

- [ ] **Step 2: 套用 go/no-go 清单**

列出「倾向做」5 条中命中了哪几条（逐条 Yes/No + 一句证据）。  
列出「倾向不做」3 条中是否触碰（逐条 Yes/No）。

- [ ] **Step 3: 写死方向结论**

用以下句式之一结尾（只能选一种）：

- `方向结论：维持。主形态为 X。`
- `方向结论：微调。从「广义发泄」调整为「……」。主形态为 X（辅 Y 可选）。`
- `方向结论：转向/暂缓。原因：……。观察项：……。`

- [ ] **Step 4: 验收**

Run: `rg -n "方向结论：" docs/research/2026-09-09-heal-requirements-research-report.md`

Expected: 恰好一行明确结论；含「维持」或「微调」或「转向」。

- [ ] **Step 5: Commit**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: lock direction validation conclusion for heal

EOF
)"
```

---

### Task 10: 前景与风险（规格 §4）

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（§5）

**Interfaces:**
- Consumes: §3–§4 结论
- Produces: 四块定性分析 + 三档前景句 + 风险表

- [ ] **Step 1: 写四块前景**

各写一小段（禁止伪造市场规模数字）：

1. 需求韧性  
2. 竞争烈度  
3. 副业窗口  
4. 风险清单表：

```markdown
| 风险 | 说明 | 处置（规避/接受/因此不做） |
|------|------|----------------------------|
| 隐私泄露 | | |
| 情绪依赖 | | |
| 自伤相关内容 | | |
| UGC 治理 | | |
| 医疗/心理咨询合规误归类 | | |
```

- [ ] **Step 2: 写死前景档位**

句式：`前景结论：值得试。` 或 `前景结论：窄门可试。关键假设：……` 或 `前景结论：不建议现在做。关键假设：……`

若方向为「转向/暂缓」，前景档位应与之一致或更保守。

- [ ] **Step 3: 验收**

Run: `rg -n "前景结论：|规避|接受|因此不做" docs/research/2026-09-09-heal-requirements-research-report.md`

Expected: 有前景结论句；风险表含处置列取值。

- [ ] **Step 4: Commit**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: add prospects and risk register for heal research

EOF
)"
```

---

### Task 11: 决策建议、MVP、待验证假设

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（§6、§7）；页眉状态改为「已完成」

**Interfaces:**
- Consumes: §4 方向结论、§5 前景、规格 §1.5 成功标准
- Produces: 做/不做；若做则主形态 + 一句话定位 + 1–2 旅程阶段 + 最小功能集 + 明确不做；≤5 条假设

- [ ] **Step 1: 写 §6 决策**

若「做」或「窄门可试且选择做」：

- 主形态（五类代号）  
- 一句话定位（用户能用来解释「为何不用小红书/备忘录/通用 AI」）  
- 优先旅程阶段 1–2 个  
- 最小功能集：3–7 条可演示能力（主动作唯一）  
- 明确不做：社区/医疗宣称/挽回辅导等（按实际选择列出）  

若「暂缓/不做」：填 §6.3，§6.2 写「不适用」并引用原因。

可选备注：「以后若变现」难度一句（不做方案）。

- [ ] **Step 2: 写 §7 假设表（1–5 条）**

每条假设必须可被「5–10 人访谈」或「纸面/静态原型」在两周内验证；禁止无法验证的空话。

- [ ] **Step 3: 更新页眉**

`**状态：** 已完成`

并在文首加「执行摘要」5 行以内：做不做、主形态、定位、前景档位、最大风险。

- [ ] **Step 4: 对照规格成功标准自检**

Checklist（全部打勾才可提交）：

- [ ] 读者能判断做或不做  
- [ ] 若做：有主形态、一句话定位、最小功能集  
- [ ] 方向三选一已写死  
- [ ] 前景三档已写死  
- [ ] 无编造下载量/营收  
- [ ] 假设 ≤5  

- [ ] **Step 5: Commit**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md
git commit -m "$(cat <<'EOF'
docs: finalize heal requirements research decision and MVP

EOF
)"
```

---

### Task 12: 全报告一致性审阅

**Files:**
- Modify: `docs/research/2026-09-09-heal-requirements-research-report.md`（仅修矛盾）
- Modify: `docs/research/competitor-scores.md`（仅修与报告矛盾的均分/缺口）

**Interfaces:**
- Consumes: 全份报告 + 工作表 + 规格
- Produces: 无自相矛盾的终稿

- [ ] **Step 1: 矛盾扫描**

检查并修正：

1. §4 方向结论 vs §6 MVP 主形态是否同一代号  
2. §5 前景档位 vs §6 做/不做是否同向  
3. §2 优先阶段 vs §6 优先阶段是否一致  
4. 报告精简表 vs `competitor-scores.md` 均分是否同向（允许四舍五入，不允许「报告说 D 差异高、表里 D 差异均分最低」这类反转）  
5. 是否出现治疗/挽回承诺用语 → 删除或改为「发泄与安放」

- [ ] **Step 2: 运行最终检查命令**

```bash
rg -n "方向结论：|前景结论：|一句话定位|待填|TBD|TODO" docs/research/2026-09-09-heal-requirements-research-report.md
wc -l docs/research/competitor-scores.md docs/research/2026-09-09-heal-requirements-research-report.md
```

Expected: 有方向结论与前景结论；无「待填/TBD/TODO」；两文件均有实质行数（报告建议 >120 行，工作表因表格会较短但五行汇总非空）。

- [ ] **Step 3: Commit（若有修改）**

```bash
git add docs/research/2026-09-09-heal-requirements-research-report.md docs/research/competitor-scores.md
git commit -m "$(cat <<'EOF'
docs: consistency pass on heal research deliverables

EOF
)"
```

若无修改：`git status` 清洁即可，不必空提交。

---

## Plan Self-Review

| 规格要求 | 对应 Task |
|----------|-----------|
| 竞品调研（五形态、≥3 样本、统一评分） | Task 3–7，汇总 Task 8 |
| 旅程补强 | Task 2 |
| 方向校验三选一 + go/no-go | Task 9 |
| 前景四块 + 三档 + 风险处置 | Task 10 |
| 做不做 + MVP 定位/功能集 | Task 11 |
| 待验证假设 ≤5 | Task 11 |
| 质量底线（依据、置信度、不编造） | Global Constraints + 各 Task 验收 |
| 不写代码 / 非治疗 | Global Constraints；Task 12 用语扫描 |

占位符扫描：计划内模板使用「待填」仅出现在 Task 1 骨架中，作为初始文件内容，由后续 Task 覆盖；终稿验收禁止残留。无「implement later」类步骤。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-09-heal-requirements-research.md`. Two execution options:

**1. Subagent-Driven (recommended)** — 每个 Task 派一个新子代理，Task 间审查，迭代快  

**2. Inline Execution** — 本会话用 executing-plans 按 Task 推进，设检查点  

Which approach?
