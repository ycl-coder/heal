import { initAnalytics } from "./analytics.js";

initAnalytics();

export function showView(name) {
  for (const el of document.querySelectorAll(".view")) {
    el.hidden = el.id !== "view-" + name;
  }
}

document.getElementById("copy-email").addEventListener("click", async () => {
  const email = "yincuilong@126.com";
  await navigator.clipboard.writeText(email);
});

document.getElementById("btn-start-write").addEventListener("click", () => {
  showView("write");
});

document.getElementById("btn-go-archive").addEventListener("click", () => {
  showView("archive");
});

showView("entry");
