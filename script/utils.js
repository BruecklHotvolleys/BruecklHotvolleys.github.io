if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * Some utilities.
 */
window.bhv.utils = {

  setBack: function(region) {
    var i, lnks,
        key = window.bhv.request.utils.getKey();

    if (key) {
      lnks = document.querySelectorAll('div#header a');
      if (lnks) {
        for (i = 0; i < lnks.length; ++i) {
          lnks[i].setAttribute('href', lnks[i].getAttribute('href') + '#'
            + region + '_' + key);
        }
      }
    }
  },

  // -- toolbox for service worker -------------------------------------------

  /**
   * Registers the service worker.
   * @return {void}
   */
  registerSW: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {

        navigator.serviceWorker
          .register('/bhv-service-worker.js')
          .then((reg) => {
            console.log('BHV Info App service worker registered.', reg);

            window.bhv.utils.listenForWaitingServiceWorker(reg, window.bhv.utils.promptUserToRefresh);
          });

        window.bhv.utils.initReload();
      });
    }
  },

  /**
   * Connects to the service worker.
   * @return {void}
   */
  connectSW: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {

        navigator.serviceWorker
          .getRegistration()
          .then((reg) => {
            console.log('BHV Info App service worker connected.', reg);
            window.bhv.utils.listenForWaitingServiceWorker(reg, window.bhv.utils.promptUserToRefresh);
          });

        window.bhv.utils.initReload();
      });
    }
  },

  /**
   * A helper function to listen for a waiting service worker.
   * @return {void}
   */
  listenForWaitingServiceWorker: function(reg, callback) {
    function awaitStateChange() {
      reg.installing.addEventListener('statechange', function() {
        if (this.state === 'installed') callback(reg);
      });
    }
    if (!reg) return;
    if (reg.waiting) return callback(reg);
    if (reg.installing) awaitStateChange();
    reg.addEventListener('updatefound', awaitStateChange);
  },

  promptUserToRefresh: function(reg) {
    // todo use notification instead of confirm
    if (window.confirm("New version available! OK to refresh?")) {
      // post to activate new service worker
      reg.waiting.postMessage('skipWaiting');
    }
  },

  // reload once when the new Service Worker starts activating
  refreshing: false,

  initReload: function() {
    navigator.serviceWorker.addEventListener('controllerchange',
      function() {
        if (!window.bhv.utils.refreshing) {
          window.bhv.utils.refreshing = true;
          console.log('[sw] reload page');
          window.location.reload();
        }
      }
    );
  }
}
