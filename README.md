# heal

写给无法送达的人——本地私密安放（清晨留白 UI）。纯静态站点，无需构建。

## 本地预览

在仓库根目录：

```bash
python3 -m http.server 8080
```

打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)。

不要用 `file://` 做功能验收。

## GitHub Pages 托管

站点入口已在仓库根目录（`index.html`），适合从分支直接发布：

1. 打开仓库 **Settings → Pages**
2. **Source** 选 **Deploy from a branch**
3. Branch 选 `research/heal-requirements-research`（或合并后的 `main`），文件夹选 `/ (root)`
4. 保存后等待一两分钟，站点地址一般为：  
   `https://ycl-coder.github.io/heal/`

百度统计里填写的域名需与上述 Pages 域名一致。

## 自动化测试

```bash
node --test js/storage.test.mjs js/analytics.test.mjs js/seal-motion.test.mjs
```

## 百度统计

编辑 `js/analytics.js` 中的 `BAIDU_SITE_ID`（将 `YOUR_BAIDU_SITE_ID` 换成真实站点 ID）。获取步骤见 `docs/superpowers/specs/2026-09-10-heal-web-local-mvp-design.md` §3.2。

## 隐私与反馈

- 信件仅存本机浏览器，不上云。
- 反馈：`yincuilong@126.com`
