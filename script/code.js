if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * Crypto.
 */
window.bhv.code = {
  encoded: ['01j01Z02300d01j01Z023', '01F01901R00101F01901R', '00E00400Q01400E00400Q', '00F00500R01500F00500R', '01O01U01400Q01O01U014'],
  chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  decode: function(str, pw) {
    if (pw === null || pw === undefined
        || typeof pw != 'string' || pw == '') {
      return null;
    }
    if (typeof str !== 'string' || str.length % 3 !== 0) {
      return null
    }
    // var key = 'b'.codePointAt(0);
    var key = 'b'.charCodeAt(0);
    for (var i = 0; i < pw.length; ++i) {
      // key = key ^ pw.codePointAt(i);
      key = key ^ pw.charCodeAt(i);
    }
    var result = '';
    for (var j = 0; j < str.length; j += 3) {
      var part = str.substr(j, 3);
      var pos = this._from62(part) ^ key;
      // result += String.fromCodePoint(pos);
      result += String.fromCharCode(pos);
    }
    return result;
  },
  _from62: function(str) {
    var result = 0;
    for (var i = 0; i < str.length; ++i) {
      result = result * 62 + this.chars.indexOf(str.substr(i, 1));
    }
    return result;
  },

  check: function(pw) {
    if (pw === undefined) {
      pw = window.localStorage.getItem('pw');
      //console.log('password from local storage');
    }
    for (var i = 0; i <= 4; ++i) {
      if (this.decode(this.encoded[i], pw) === 'bhv.bhv') {
        return i;
      }
    }

    return -1;
  }
}
