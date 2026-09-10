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
