# heal web

本地静态站点，无需构建工具。UI 主题为「清晨留白」：浅色大留白、细线分隔、雾蓝点缀，衬线标题 + 无框架纯静态页。

## 本地预览

```bash
cd web && python3 -m http.server 8080
```

浏览器打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)。

不要用 `file://` 打开页面做功能验收；请始终通过本地 HTTP 服务预览。

## 自动化测试

在项目根目录运行：

```bash
node --test web/js/storage.test.mjs web/js/analytics.test.mjs web/js/seal-motion.test.mjs
```

覆盖：草稿→封存只读、列表与删除、百度占位 ID 不注入脚本、真实形态 ID 注入 `hm.js` 且 URL 不含正文。

## 百度统计

编辑 `js/analytics.js` 中的 `BAIDU_SITE_ID`（上线前将占位符 `YOUR_BAIDU_SITE_ID` 替换为真实站点 ID）。

获取步骤见规格 §3.2：

1. 打开 https://tongji.baidu.com/ ，登录百度账号
2. 管理 → 添加网站：填写名称与实际上线域名
3. 复制跟踪代码；`hm.js?` 后面的字符串即为站点 ID
4. 填入 `analytics.js` 配置项
5. 验证：后台「实时访客」，或 DevTools Network 出现 `hm.baidu.com/hm.js?<ID>`

未配置 ID 时页面功能不受影响。

## 隐私与反馈

- 信件内容仅保存在本机浏览器，不上云。
- 意见反馈邮箱：`yincuilong@126.com`（页脚 mailto 与「复制邮箱」按钮）

## 规格 §4 验收清单（2026-09-10）

| # | 检查 | 结果 |
|---|------|------|
| 1 | 入口→写信→封存→归档 | ✅ 浏览器 E2E：四段视图切换与封存成功页正常 |
| 2 | 刷新持久化；删除生效 | ✅ IndexedDB 路径：刷新后仍可见；删除后列表为空 |
| 3 | Network 无信件正文出站（可有 hm.js） | ✅ 代码无 `fetch`/XHR；仅本地 storage API |
| 4 | 占位 ID 无 hm.js；假 ID 形态应注入 | ✅ 占位时无 `#heal-baidu-hm`；单测验证假 ID 注入 |
| 5 | mailto 收件人正确；复制邮箱可用 | ✅ `yincuilong@126.com`；页脚按钮绑定 clipboard |
| 6 | 无框架、无业务后端 | ✅ 纯 HTML/CSS/ESM；`package.json` 仅 `"type":"module"` |

**说明：** 自动化单测 + 静态审查 + 本地 HTTP 浏览器走通主流程。上线前建议在目标浏览器再手动 spot-check 一次 Network 面板。
