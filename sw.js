// sw.js

const CACHE_NAME = 'chatbot-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icons/delete-chat.png',
  '/icons/icon.png',
  '/icons/icon-512x512.png',
  '/icons/icon-192x192.png',
  '/fonts/YekanBakh-Bold.ttf',
  '/manifest.json'
];

// هنگام نصب سرویس‌ورکر
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching important files');
        return cache.addAll(urlsToCache);
      })
  );
});

// هنگام فعال‌سازی سرویس‌ورکر
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // حذف کش‌های قدیمی
          }
        })
      );
    })
  );
});

// هنگام درخواست از شبکه
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // اگر فایل در کش موجود باشد، از آن استفاده می‌کنیم
        if (cachedResponse) {
          return cachedResponse;
        }

        // در غیر این صورت درخواست به شبکه ارسال می‌شود
        return fetch(event.request)
          .then((response) => {
            // کش کردن پاسخ برای استفاده در آینده
            if (event.request.url.includes('.png') || event.request.url.includes('.jpg')) {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, response.clone());
                  return response;
                });
            }
            return response;
          });
      })
  );
});

// ارسال نوتیفیکیشن‌های محلی (اختیاری)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-64x64.png',
  };

  event.waitUntil(
    self.registration.showNotification('ChatBot Notification', options)
  );
});
