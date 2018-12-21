if (window.bhv === undefined) {
  window.bhv = {};
}

window.bhv.db = {
  write: function(key, value) {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  },

  read: function(key) {
    if (localStorage) {
      return localStorage.getItem(key);
    }
  },

  xdelete: function(key) {
    if (localStorage) {
      localStorage.removeItem(key);
    }
  }
}
