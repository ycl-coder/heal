# heal 网页本地 MVP 设计规格

**日期：** 2026-09-10  
**状态：** 已批准（brainstorming）  
**上游依据：** `docs/research/2026-09-09-heal-requirements-research-report.md`（做 / 窄门可试 / D+A）

## 1. 目标与边界

### 1.1 一句话目标

纯静态网页：用户完成「写给无法送达的人 → 封存仪式 → 本机归档」；**信件不上云**；仅百度统计记录匿名访问；意见反馈走邮件。

### 1.2 已确认约束

| 项 | 结论 |
|----|------|
| 技术形态 | 纯静态 HTML/CSS/JS，无框架、无构建 |
| 产品形态 | 主 D（仪式归档）+ 辅 A（私密书写）；单页流程 |
| 信件存储 | 仅浏览器（IndexedDB，降级 localStorage） |
| 访问数据 | 百度统计（匿名 PV/来源等）；**不采集信件正文** |
| 意见反馈 | `mailto:yincuilong@126.com`（预填主题） |
| 市场 / 资源 | 中国大陆；个人副业；先验证使用 |
| 定位 | 发泄与安放；非治疗、非挽回 |

### 1.3 做

1. 单页四段：入口 → 写信 → 封存 → 本机归档（可再读 / 删除）
2. IndexedDB 存信件；轻量偏好可用 localStorage
3. 百度统计脚本（站点 ID 配置化；无 ID 时不加载或 no-op）
4. 页脚反馈：`mailto:yincuilong@126.com?subject=heal%20%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88`；另显示可复制邮箱
5. 隐私与边界文案：信件仅本机；清缓存/换设备会丢；统计匿名；反馈走邮件；非治疗非挽回
6. 完成页附 1 个官方心理援助资源外链（不做危机干预）

### 1.4 不做（MVP）

- 账号、云同步、服务端存信
- 公域树洞 / 拟人 AI 陪伴 / 内容 Feed
- 治疗、挽回、危机干预承诺
- React/Vue 等框架、原生 App
- 加密导出 / 跨设备备份（列后续即可）
- 将信件字段打入统计自定义事件

### 1.5 成功标准

1. 陌生人约 15 分钟内完成一次封存闭环  
2. 配置百度站点 ID 后，后台可见访问  
3. 用户可通过 mailto 向 `yincuilong@126.com` 发反馈  

## 2. 页面流程与数据

### 2.1 单页四段

| 段 | 行为 | 对应研究最小功能 |
|----|------|------------------|
| 0 入口 | 定位文案、隐私三句、非治疗/非挽回、反馈入口 | 场景入口 + 边界 |
| 1 写信 | 场景标签（分手/单恋/不得不分开等）→ 1–3 条 prompt → 正文可反复改 | 结构化书写 + 辅 A |
| 2 封存 | 二次确认 → 短仪式反馈 → 状态「已安放」、不可误发 | **主动作** |
| 3 归档 | 本机列表（标题/日期/场景）；只读回看；可删除；可选「N 天不再联系」本机日期标记（无推送） | 归档 + 抽离轻量 |

全局：页脚反馈 mailto；百度统计全站一次加载。

### 2.2 数据模型

IndexedDB 库名建议：`heal-local`。

```text
Letter {
  id: string                 // uuid
  createdAt: number
  sealedAt: number | null
  status: "draft" | "sealed"
  scene: string
  promptsUsed: string[]
  body: string               // 仅本机
  title: string
  noContactUntil: number | null
}
```

- 封存前：同一草稿 `id` 可覆盖保存  
- 封存后：`body` 只读；无「发送给对方」、无社交分享  
- 删除：本机硬删  
- **隔离：** 任何出站请求不得携带 `body`

### 2.3 失败与边界

| 情况 | 处理 |
|------|------|
| IndexedDB 不可用 | 降级 localStorage（限长）并提示存储能力有限 |
| 用户清站点数据 | 信件丢失（入口已说明） |
| `file://` 打开 | IndexedDB 可能受限；验收以 http(s) 为准 |

## 3. 技术结构

### 3.1 目录

```text
web/
  index.html
  css/app.css
  js/
    app.js         # 段切换与封存流程
    storage.js     # IndexedDB（降级 localStorage）
    analytics.js   # 百度统计（站点 ID 配置）
  README.md        # 本地 http 预览与静态托管说明
```

可部署至任意静态托管（GitHub Pages、OSS、Nginx 等）。

### 3.2 百度统计站点 ID 如何获取

1. 打开 https://tongji.baidu.com/ ，登录百度账号  
2. 管理 → 添加网站：填写名称与**实际上线域名**  
3. 复制跟踪代码；`hm.js?` **后面的字符串**即为站点 ID（site signature）  
4. 填入 `analytics.js` 配置项（实现阶段用占位符 `YOUR_BAIDU_SITE_ID`，上线前替换）  
5. 验证：后台「实时访客」，或 DevTools Network 出现 `hm.baidu.com/hm.js?<ID>`

未配置 ID 时：不注入脚本或 no-op，页面功能不受影响。

可选（非必须）：仅计数、无正文的事件如 `seal_completed`；若接入成本高，MVP 只记 PV。

### 3.3 邮件反馈

- 链接：`mailto:yincuilong@126.com?subject=heal%20%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88`  
- 无系统邮件客户端时：页脚展示可复制地址 `yincuilong@126.com`

## 4. 验收清单

1. http(s) 下走通：入口 → 写信 → 封存 → 归档可见  
2. 刷新后草稿/已封存仍在；删除后消失  
3. DevTools 确认无网络请求携带信件正文  
4. 填入真实百度 ID 后脚本加载，后台可见 PV  
5. 反馈链收件人为 `yincuilong@126.com`  
6. 无前端框架、无可写业务服务端  

## 5. 下一步

1. 用户审阅本规格；有修改先改规格  
2. writing-plans 产出 `web/` 实现计划  
3. 按计划实现静态页；百度 ID 可在部署前再填  

## 6. 规格自检

- 无 TBD 决策项；百度 ID 为部署配置，获取步骤已写明  
- 与调研报告 D+A、本地私密、明确不做列表一致  
- 统计/邮件与信件存储隔离已写死  
- 范围适合单次实现计划（纯静态单页）
