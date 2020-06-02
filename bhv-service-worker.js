'use strict';

// the names and the files of the cache
const CACHE = {
  'main': 'bhv-infoapp-e73736174a4c5dcc854990b7b3185c0d',
  'data': 'bhv-infoapp-4643ba8e72625237c69999b2b62f64c7',
  'system4': 'bhv-infoapp-3a74649350f1923a75308d111795c28c',
  'system6': 'bhv-infoapp-ae27fd018f4793588733f92091e95965',
  'favicons': 'bhv-infoapp-330b73fc504d548333704fb32f4ddb85',
  'info': 'bhv-infoapp-14545db906177853eedc9ed447cbd3db',
  'statistics_19': 'bhv-infoapp-1721c54a73e426c061a4da259e61d823',
  'teambuilding_19': 'bhv-infoapp-9aeecfc5514d12fd7a4ac6ca488835d7',
  'teambuilding_21': 'bhv-infoapp-54e1f6f5301d4eb52424549a4eccf732'
}
const FILES = {
  'main': [
    '/404.html',
    '/diary.html',
    '/imageview.html',
    '/',
    '/index.html',
    '/ov.html',
    '/players.html',
    '/presence.html',
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
    '/image/ball32.png',
    '/image/bhv1.gif',
    '/image/bhv2.gif',
    '/script/animator.js',
    '/script/base64.js',
    '/script/db.js',
    '/script/pako_inflate.min.js',
    '/script/players.js',
    '/script/polyfills.js',
    '/script/presence.js',
    '/script/request.js',
    '/script/results.js',
    '/script/schedule.js',
    '/script/standings.js',
    '/script/svgviewer.js',
    '/script/utils.js',
    '/u12/certificate.jpeg',
    '/u13/certificate.jpeg'
  ],
  'data': [
    '/data/training/a.json',
    '/data/training/diary_a.json'
  ],
  'system4': [
    '/system4/angriff2.png',
    '/system4/angriff3.png',
    '/system4/angriff4.png',
    '/system4/annahme.png',
    '/system4/annahme2.png',
    '/system4/aufspiel_v.png',
    '/system4/aufspiel.png',
    '/system4/aufspiel2.png',
    '/system4/basis.png',
    '/system4/basis2.png',
    '/system4/block2.png',
    '/system4/block22.png',
    '/system4/block3l.png',
    '/system4/block3r.png',
    '/system4/block4.png',
    '/system4/index_.html',
    '/system4/',
    '/system4/index.html',
    '/system4/ohne.png',
    '/system4/ohne2.png',
    '/system4/ohne3.png',
    '/system4/ohne4.png'
  ],
  'system6': [
    '/system6/annahme/zudritt.html',
    '/system6/annahme/zudritt.png',
    '/system6/aufspiel/angriff_06.html',
    '/system6/aufspiel/angriff_2.html',
    '/system6/aufspiel/angriff_5v.html',
    '/system6/aufspiel/angriff06.png',
    '/system6/aufspiel/angriff2.png',
    '/system6/aufspiel/angriff5v.png',
    '/system6/aufspiel/images/set_0_hi.png',
    '/system6/aufspiel/images/set_0.png',
    '/system6/aufspiel/images/set_1_hi.png',
    '/system6/aufspiel/images/set_1.png',
    '/system6/aufspiel/images/set_2_hi.png',
    '/system6/aufspiel/images/set_2.png',
    '/system6/aufspiel/images/set_3_hi.png',
    '/system6/aufspiel/images/set_3.png',
    '/system6/aufspiel/images/set_4_hi.png',
    '/system6/aufspiel/images/set_4.png',
    '/system6/aufspiel/images/set_5a_hi.png',
    '/system6/aufspiel/images/set_5a.png',
    '/system6/aufspiel/images/set_5b_hi.png',
    '/system6/aufspiel/images/set_5b.png',
    '/system6/aufspiel/images/set_6_hi.png',
    '/system6/aufspiel/images/set_6.png',
    '/system6/aufspiel/images/set_7_hi.png',
    '/system6/aufspiel/images/set_7.png',
    '/system6/aufspiel/images/set_8_hi.png',
    '/system6/aufspiel/images/set_8.png',
    '/system6/aufspiel/',
    '/system6/aufspiel/index.html',
    '/system6/aufspiel/plan.png',
    '/system6/aufspiel/vorbereitung_1.html',
    '/system6/aufspiel/vorbereitung_2.html',
    '/system6/aufspiel/vorbereitung1.png',
    '/system6/aufspiel/vorbereitung2.png',
    '/system6/aufspiel/wann_1.html',
    '/system6/aufspiel/wann_2.html',
    '/system6/aufspiel/wann1.png',
    '/system6/aufspiel/wann2.png',
    '/system6/aufspiel/wo.html',
    '/system6/aufspiel/wo.png',
    '/system6/blockinfo/aktiv.gif',
    '/system6/blockinfo/bewegung.gif',
    '/system6/blockinfo/bewegung3.png',
    '/system6/blockinfo/bewegung4.png',
    '/system6/blockinfo/block.html',
    '/system6/blockinfo/block1.gif',
    '/system6/blockinfo/block2.gif',
    '/system6/blockinfo/grundstellung.gif',
    '/system6/blockinfo/grundstellung2.gif',
    '/system6/blockinfo/passiv.gif',
    '/system6/blockinfo/zur_mitte.gif',
    '/system6/',
    '/system6/index.html',
    '/system6/spielfeld/',
    '/system6/spielfeld/index.html',
    '/system6/spielfeld/positionen.png',
    '/system6/spielfeld/spielfeld.png',
    '/system6/verteidigung/basis_1.html',
    '/system6/verteidigung/basis_1b.html',
    '/system6/verteidigung/basis_2.html',
    '/system6/verteidigung/basis1.png',
    '/system6/verteidigung/basis1b.png',
    '/system6/verteidigung/basis2.png',
    '/system6/verteidigung/block_2.html',
    '/system6/verteidigung/block_3.html',
    '/system6/verteidigung/block_31.html',
    '/system6/verteidigung/block_33.html',
    '/system6/verteidigung/block_35.html',
    '/system6/verteidigung/block_4.html',
    '/system6/verteidigung/block2.png',
    '/system6/verteidigung/block3.png',
    '/system6/verteidigung/block31.png',
    '/system6/verteidigung/block33.png',
    '/system6/verteidigung/block35.png',
    '/system6/verteidigung/block4.png',
    '/system6/verteidigung/ohne_1.html',
    '/system6/verteidigung/ohne_2.html',
    '/system6/verteidigung/ohne1.png',
    '/system6/verteidigung/ohne2.png'
  ],
  'favicons': [
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
    '/favicons/safari-pinned-tab.svg'
  ],
  'info': [
    '/info/gesucht.html',
    '/info/gesucht.jpeg',
    '/info/info19.html',
    '/info/info20.html',
    '/info/info21.html',
    '/info/u12.html',
    '/info/u13.html',
    '/info/u14.html',
    '/info/u15.html',
    '/info/u16.html',
    '/info/u18.html',
    '/info/u20.html',
    '/info/wunschzettel.html'
  ],
  'statistics_19': [
    '/statistics/19/br3.html',
    '/statistics/19/mpo.html',
    '/statistics/19/u12.html',
    '/statistics/19/u13.html',
    '/statistics/19/u13x.html',
    '/statistics/19/u15.html',
    '/statistics/19/u15AR.html',
    '/statistics/19/u15FD.html',
    '/statistics/19/u15pn.html',
    '/statistics/19/u17.html'
  ],
  'teambuilding_19': [
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
  ],
  'teambuilding_21': [
    '/teambuilding/herzhirn_21/2005241.jpeg',
    '/teambuilding/herzhirn_21/2005242.jpeg',
    '/teambuilding/herzhirn_21/',
    '/teambuilding/herzhirn_21/index.html'
  ]
}

self.addEventListener('install', (evt) => {
  console.log('[sw] install')

  // init cache with files
  const parts = Object.keys(CACHE)
  evt.waitUntil(
    parts.forEach((part) => {
      caches.open(CACHE[part])
        .then((cache) => {
          console.log('create cache: ' + part + ' - '+ CACHE[part])
          return cache.addAll(FILES[part])
        })
    })
  )

  self.skipWaiting()
})


self.addEventListener('activate', (evt) => {
  console.log('[sw] activate')

  // remove old cache data
  const valid_names = Object.values(CACHE)
  evt.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        if (valid_names.indexOf(name) == -1) {
          console.log('remove cache ' + name)
          return caches.delete(name)
        }
      }))
    })
  )

  self.clients.claim()
})


self.addEventListener('fetch', (evt) => {
  console.log('[sw] fetch', evt.request.url)

  // get right cache
  // link to dir with index.html is fetched without trailing /, then with trailing /
  let nameCache = CACHE['main']
  if (evt.request.url.indexOf('/data/') > -1) {
    nameCache = CACHE['data']
  } else if (evt.request.url.indexOf('/system4') > -1) {
    nameCache = CACHE['system4']
  } else if (evt.request.url.indexOf('/system6') > -1) {
    nameCache = CACHE['system6']
  } else if (evt.request.url.indexOf('/favicons/') > -1) {
    nameCache = CACHE['system6']
  } else if (evt.request.url.indexOf('/info/') > -1) {
    nameCache = CACHE['info']
  } else if (evt.request.url.indexOf('/statistics/19/') > -1) {
    nameCache = CACHE['statistics_19']
  } else if (evt.request.url.indexOf('/teambuilding/br3_19') > -1) {
    nameCache = CACHE['teambuilding_19']
  } else if (evt.request.url.indexOf('/teambuilding/herzhirn_21') > -1) {
    nameCache = CACHE['teambuilding_21']
  }

  // fetch a ressource
  evt.respondWith(
    caches.open(nameCache)
      .then((cache) => {
        return cache.match(evt.request, { 'ignoreSearch': true })
          .then((response) => {
            console.log(' -->', (response ? 'found' : 'not found') + ' in ' + nameCache, evt.request.url)
            return response || fetch(evt.request)
          })
      })
  )
})


self.addEventListener('message', messageEvent => {
  // start the waiting new serviceworker
  if (messageEvent.data === 'skipWaiting') {
    console.log('[sw] start waiting service worker')
    return skipWaiting();
  }
});
