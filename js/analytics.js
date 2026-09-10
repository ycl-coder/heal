export const BAIDU_SITE_ID = "YOUR_BAIDU_SITE_ID";

export function isAnalyticsConfigured(id = BAIDU_SITE_ID) {
  return Boolean(id) && id !== "YOUR_BAIDU_SITE_ID";
}

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
  const s = doc.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
}
