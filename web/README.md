# heal web

本地静态站点，无需构建工具。

## 本地预览

```bash
cd web && python3 -m http.server 8080
```

浏览器打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)。

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
- 意见反馈邮箱：`yincuilong@126.com`

## 验收注意

不要用 `file://` 打开页面做功能验收；请始终通过本地 HTTP 服务预览。
