if (window.bhv === undefined) {
  window.bhv = {};
}

window.bhv.db = {

  /**
   * Writes a string value into the store.
   * @param {string} key The key where to store the value.
   * @param {string} value The value to write.
   * @return {void}
   */
  'write': function(key, value) {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  },

  /**
   * Writes an object into the store.
   * @param {string} key The key where to store the value.
   * @param {string} value The value to write - it is serialized before writing.
   * @return {void}
   */
  'writeObj': function(key, value) {
    this.write(key, JSON.stringify(value));
  },

  /**
   * Reads a string value from the store.
   * @param {string} key The key of the value.
   * @return {string} The value or undefined.
   */
  'read': function(key) {
    if (localStorage) {
      return localStorage.getItem(key);
    }
    return undefined;
  },

  /**
   * Reads an object from the store.
   * @param {string} key The key of the value.
   * @return {object} The object or undefined.
   */
  'readObj': function(key) {
    var val = this.read(key);
    if (val !== undefined) {
      return JSON.parse(val);
    }
    return undefined;
  },

  /**
   * Deletes a value from the store.
   * @param {string} key The key of the value.
   * @return {void}
   */
  'delete': function(key) {
    if (localStorage) {
      localStorage.removeItem(key);
    }
  }
}
