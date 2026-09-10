# heal

写给无法送达的人——一次本机私密安放。

**在线使用：** [https://ycl-coder.github.io/heal/](https://ycl-coder.github.io/heal/)

这不是治疗，也不是挽回。信件只留在你这台设备的浏览器里，不上云、不公开、不含 AI 陪伴。

## 适合谁

- 分手、单恋、不得不分开，想说却不能说出口
- 想把情绪写下来、封存起来，而不是发到社交网络
- 接受「清缓存 / 换设备会丢失」这一本地存储前提

## 怎么用

1. 打开上面的链接（建议用手机或电脑的常规浏览器）
2. 点「开始写信」：选场景、写正文，可先存草稿
3. 去封存：确认后完成本机安放
4. 之后可在「查看本机已安放」里回看已封存的信件

## 隐私说明

| 内容 | 去向 |
| --- | --- |
| 信件正文 / 草稿 | 仅本机（IndexedDB，必要时降级 localStorage） |
| 访问统计 | 百度统计匿名 PV/UV，不含信件内容 |
| 服务端存信 | 无 |

清站点数据、换浏览器或换设备，信件会丢失。重要内容请自行备份。

反馈：`yincuilong@126.com`

## 本地预览（开发）

纯静态站点，无需构建。在仓库根目录：

```bash
python3 -m http.server 8080
```

打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)。不要用 `file://` 做功能验收。

## 自动化测试

```bash
node --test js/storage.test.mjs js/analytics.test.mjs js/seal-motion.test.mjs
```

## GitHub Pages

站点入口在仓库根目录（`index.html`）。发布方式：

1. 仓库 **Settings → Pages**
2. **Source** → **Deploy from a branch**
3. Branch 选 `master`，文件夹选 `/ (root)`
4. 地址：`https://ycl-coder.github.io/heal/`

百度统计后台填写的域名需与 Pages 域名一致（`ycl-coder.github.io`）。统计脚本已写在 `index.html`（供后台代码检测）与 `js/analytics.js`。
