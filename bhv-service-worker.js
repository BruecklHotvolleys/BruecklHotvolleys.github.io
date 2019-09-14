'use strict';

// the name of the cache
const CACHE_NAME = 'bhv-infoapp-k0jxgq4q';

// all the files
const FILES_TO_CACHE = [
  '/404.html',
  '/imageview.html',
  '/',
  '/index.html',
  '/ov.html',
  '/results.html',
  '/schedule.html',
  '/standings.html',
  '/styles.css',
  '/README.md',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/archive/19/kidsschedules.xml.gz',
  '/archive/19/results.xml.gz',
  '/archive/19/standings.xml.gz',
  '/calendar/calendar.html',
  '/calendar/controller.js',
  '/calendar/input.html',
  '/elements/expander/script.js',
  '/elements/expander/styles.css',
  '/favicons/android-chrome-192x192.png',
  '/favicons/android-chrome-512x512.png',
  '/favicons/apple-touch-icon-120x120-precomposed.png',
  '/favicons/apple-touch-icon-120x120.png',
  '/favicons/apple-touch-icon-152x152-precomposed.png',
  '/favicons/apple-touch-icon-152x152.png',
  '/favicons/apple-touch-icon-180x180-precomposed.png',
  '/favicons/apple-touch-icon-180x180.png',
  '/favicons/apple-touch-icon-60x60-precomposed.png',
  '/favicons/apple-touch-icon-60x60.png',
  '/favicons/apple-touch-icon-76x76-precomposed.png',
  '/favicons/apple-touch-icon-76x76.png',
  '/favicons/apple-touch-icon-precomposed.png',
  '/favicons/apple-touch-icon.png',
  '/favicons/browserconfig.xml',
  '/favicons/favicon-16x16.png',
  '/favicons/favicon-32x32.png',
  '/favicons/favicon.ico',
  '/favicons/mstile-144x144.png',
  '/favicons/mstile-150x150.png',
  '/favicons/mstile-310x150.png',
  '/favicons/mstile-310x310.png',
  '/favicons/mstile-70x70.png',
  '/favicons/safari-pinned-tab.svg',
  '/image/ball32.png',
  '/image/bhv1.gif',
  '/image/bhv2.gif',
  '/info/gesucht.html',
  '/info/gesucht.jpeg',
  '/info/info19.html',
  '/info/info20.html',
  '/info/u13.html',
  '/info/u14.html',
  '/info/u15.html',
  '/info/u16.html',
  '/info/u18.html',
  '/info/u20.html',
  '/info/wunschzettel.html',
  '/script/animator.js',
  '/script/base64.js',
  '/script/db.js',
  '/script/pako_inflate.min.js',
  '/script/polyfills.js',
  '/script/request.js',
  '/script/results.js',
  '/script/schedule.js',
  '/script/standings.js',
  '/script/svgviewer.js',
  '/u12/certificate.jpeg',
  '/u13/certificate.jpeg',
  '/statistics/19/br3.html',
  '/statistics/19/mpo.html',
  '/statistics/19/u12.html',
  '/statistics/19/u13.html',
  '/statistics/19/u13x.html',
  '/statistics/19/u15.html',
  '/statistics/19/u15AR.html',
  '/statistics/19/u15FD.html',
  '/statistics/19/u15pn.html',
  '/statistics/19/u17.html',
  '/teambuilding/br3_19/',
  '/teambuilding/br3_19/index.html',
  '/teambuilding/br3_19/item1_small.jpg',
  '/teambuilding/br3_19/item1.jpg',
  '/teambuilding/br3_19/item2a_small.jpg',
  '/teambuilding/br3_19/item2a.jpg',
  '/teambuilding/br3_19/item2b_small.jpg',
  '/teambuilding/br3_19/item2b.jpg',
  '/teambuilding/br3_19/item3_small.jpg',
  '/teambuilding/br3_19/item3.jpg'
];

self.addEventListener('install', (evt) => {
  console.log('[sw] install');

  // init cache with main files
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[cache-' + CACHE_NAME + '] create');
         return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[sw] activate');

  // remove old cache data
  evt.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        if (name !== CACHE_NAME) {
          console.log('[cache-' + name +'] remove');
          return caches.delete(name);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[sw] fetch', evt.request.url);

  // fetch a ressource
  evt.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.match(evt.request, { 'ignoreSearch': true })
          .then((response) => {
            console.log(' -->', (response ? 'found' : 'not found'), evt.request.url);
            return response || fetch(evt.request);
          });
      })
  );
});
