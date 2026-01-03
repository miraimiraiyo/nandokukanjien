const CACHE = "nankunquiz-v1";

const ASSETS = [
  "/kanji/exam/",
  "/kanji/exam/index.html",
  "/kanji/exam/style.css",
  "/kanji/exam/script.js",
  "/kanji/manifest.json",
  "/kanji/assets/yakasuri.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
