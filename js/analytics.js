export const BAIDU_SITE_ID = "17688037a04ed39e073435846288b8b5";

export function isAnalyticsConfigured(id = BAIDU_SITE_ID) {
  return Boolean(id) && id !== "YOUR_BAIDU_SITE_ID";
}

/**
 * initAnalytics 动态注入百度统计（若页面已有 #heal-baidu-hm 则跳过，避免重复）。
 * 生产页请在 index.html 放官方片段，便于百度爬虫检测。
 */
export function initAnalytics(doc = document, id = BAIDU_SITE_ID) {
  if (!isAnalyticsConfigured(id)) {
    return;
  }
  if (doc.getElementById && doc.getElementById("heal-baidu-hm")) {
    return;
  }
  globalThis._hmt = globalThis._hmt || [];
  const hm = doc.createElement("script");
  hm.id = "heal-baidu-hm";
  hm.src = "https://hm.baidu.com/hm.js?" + id;
  const head = doc.head || doc.getElementsByTagName("head")[0];
  if (head && head.appendChild) {
    head.appendChild(hm);
    return;
  }
  const s = doc.getElementsByTagName("script")[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(hm, s);
  }
}
