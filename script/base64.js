// UTF8 Module
// from: https://gist.github.com/Nijikokun/5192472
var utf8 = {

  'encode': function(str) {
    var result, index, charCode;

    if (typeof str !== 'string') {
      return str;
    } else {
      // new line
      str = str.replace(/\r\n/g, '\n');
    }

    result = '';
    for (index = 0; index < str.length; index++) {
      charCode = str.charCodeAt(index);

      if (charCode < 128) {
        result += String.fromCharCode(charCode);
      } else if ((charCode > 127) && (charCode < 2048)) {
        result += String.fromCharCode((charCode >> 6) | 192);
        result += String.fromCharCode((charCode & 63) | 128);
      } else {
        result += String.fromCharCode((charCode >> 12) | 224);
        result += String.fromCharCode(((charCode >> 6) & 63) | 128);
        result += String.fromCharCode((charCode & 63) | 128);
      }
    }

    return result;
  },

  'decode': function(str) {
    var result = '',
        index = 0,
        charCode;

    if (typeof str !== 'string') {
      return str;
    }

    while (index < str.length) {
      charCode = str.charCodeAt(index);

      if (charCode < 128) {
        result += String.fromCharCode(charCode);
        ++index;
      } else if ((charCode > 191) && (charCode < 224)) {
        result += String.fromCharCode(((charCode & 31) << 6)
          | (str.charCodeAt(index + 1) & 63));
        index += 2;
      } else {
        result += String.fromCharCode(((charCode & 15) << 12)
          | ((str.charCodeAt(index + 1) & 63) << 6)
          | (str.charCodeAt(index + 2) & 63));
        index += 3;
      }
    }

    return result;
  }
};

// base 64 encoding/decoding to replace atob/btoa
var base64 = {
  // the characters
  'map': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  /**
   * Encodes a string.
   * @param {string} input The string to encode.
   * @return {string} The base64 encoded string.
   */
  'encode': function(input) {
    var result = '',
        index = 0,
        char1, char2, char3,
        code1, code2, code3, code4;

    if (typeof input !== 'string') {
      return input;
    } else {
      input = utf8.encode(input);
    }

    while (index < input.length) {
      char1 = input.charCodeAt(index++);
      char2 = input.charCodeAt(index++);
      char3 = input.charCodeAt(index++);

      code1 = char1 >> 2;
      code2 = ((char1 & 3) << 4) | (char2 >> 4);
      code3 = ((char2 & 15) << 2) | (char3 >> 6);
      code4 = char3 & 63;

      if (isNaN(char2)) {
        code3 = code4 = 64;
      } else if (isNaN(char3)) {
        code4 = 64;
      }

      result += this.map.charAt(code1) + this.map.charAt(code2)
        + this.map.charAt(code3) + this.map.charAt(code4);
    }

    return result;
  },

  /**
   * Decodes a base64 encoded string.
   * @param {string} input The encoded string to encode.
   * @return {string} The decoded string.
   */
  'decode': function(input) {
    var result = '',
        char1, char2, char3,
        code1, code2, code3, code4,
        index = 0;

    // check for string
    if (typeof input !== 'string') {
      return input;
    } else {
      // remove all unallowed characters (e.g. line breaks)
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    }

    // handle each character from input
    while (index < input.length) {
      // get four characters
      code1 = this.map.indexOf(input.charAt(index++));
      code2 = this.map.indexOf(input.charAt(index++));
      code3 = this.map.indexOf(input.charAt(index++));
      code4 = this.map.indexOf(input.charAt(index++));

      // create three resulting characters
      char1 = (code1 << 2) | (code2 >> 4);
      char2 = ((code2 & 15) << 4) | (code3 >> 2);
      char3 = ((code3 & 3) << 6) | code4;

      // create string from char code
      result += String.fromCharCode(char1);
      if (code3 != 64) {
        result += String.fromCharCode(char2);
      }
      if (code4 != 64) {
        result += String.fromCharCode(char3);
      }
    }

    // utf8 handling, then return result
    return utf8.decode(result);
  }
};
