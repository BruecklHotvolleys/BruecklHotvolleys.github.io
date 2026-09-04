(function(){
/**
 * Selects the first matching dom element.
 * @param {string} selector The selector of the element.
 * @param {DOMElement} parent The optional root of the search (default: document).
 * @returns DOMElement The first matching DOM element.
 */
function $(selector, parent) {
  return (parent ? parent : document).querySelector(selector);
}

/**
 * Selects DOMElements.
 * @param {string} selector The selector of the DOMElements.
 * @param {DOMElement} parent The optional root of the search (default: document).
 * @returns {NodeList} The list of matching DOMElements.
 */
function $$(selector, parent) {
  return (parent ? parent : document).querySelectorAll(selector);
}

/**
 * Connects an event handler to a given DOMElement.
 * @param {DOMElement} elem The DOMElement to handle.
 * @param {string} event The name of the event to handle.
 * @param {Function} handler The event handler.
 * @returns {void}
 */
function $event(elem, event, handler) {
  elem.addEventListener(event, handler);
}

/**
 * Finds the main svg image.
 * @returns {DOMElement} The main svg image.
 */
function _getSvgImg() {
  var svg = $('div.img > svg');
  if (!svg) {
    svg = $('svg');
  }
  return svg;
}
/* global animator, animation0 */

/**
 * The effects data and handler.
 */
var effects = {
  /**
   * The effect infos.
   */
  'infos': {
  "ball_148": {
    "topMost": {
      "common": true,
      "hover": true,
      "active": true,
      "activehover": true
    }
  },
  "path_149": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_150": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_151": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_152": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_153": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_154": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_155": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_156": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_157": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_158": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_159": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_160": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_161": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_162": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_163": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_164": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_165": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_166": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_167": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_168": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_169": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_170": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_171": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_172": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_173": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_174": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_175": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_176": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_177": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_178": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_179": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_180": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_181": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_182": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_183": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_184": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_185": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_186": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_187": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_188": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_189": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_190": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_191": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_192": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_193": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_194": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_195": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_196": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_197": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_198": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_199": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_200": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_201": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_202": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_203": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_204": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_205": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_206": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_207": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_208": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_209": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_210": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_211": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_212": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_213": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_214": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_215": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_216": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_217": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_218": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_219": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_220": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_221": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_222": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_223": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_224": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_225": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_226": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_227": {
    "stroke": {
      "common": "#b22222",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "stroke-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "path_228": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "arrow_229": {
    "stroke": {
      "common": "#000000",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "0.5",
      "active": "0.5",
      "activehover": "0.5"
    },
    "toFront": {
      "hover": true
    }
  },
  "rectangle_230": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "text_231": {
    "fill": {
      "common": "#444444",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "rectangle_232": {
    "fill": {
      "common": "#808080",
      "hover": "#ffff00",
      "active": "#ffff00",
      "activehover": "#ffff00"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "stroke": {
      "common": "#696969",
      "hover": "#ffa500",
      "active": "#ffa500",
      "activehover": "#ffa500"
    },
    "stroke-opacity": {
      "common": "1",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    }
  },
  "path_233": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_234": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#d3d3d3",
      "active": "#d3d3d3",
      "activehover": "#d3d3d3"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  },
  "text_235": {
    "fill": {
      "common": "#000000",
      "hover": "#b22222",
      "active": "#b22222",
      "activehover": "#b22222"
    },
    "fill-opacity": {
      "common": "0",
      "hover": "1",
      "active": "1",
      "activehover": "1"
    },
    "toFront": {
      "hover": true
    }
  }
},
  /**
   * The grouping infos.
   */
  'groups': {
  "byId": {
    "path_215": "grp_5h",
    "arrow_216": "grp_5h",
    "path_217": "grp_5h",
    "arrow_218": "grp_5h",
    "rectangle_219": "grp_5h",
    "text_220": "grp_5h",
    "rectangle_221": "grp_5h",
    "path_222": "grp_5h",
    "rectangle_223": "grp_5h",
    "text_224": "grp_5h",
    "text_225": "grp_5h",
    "path_177": "grp_5v",
    "arrow_178": "grp_5v",
    "path_179": "grp_5v",
    "arrow_180": "grp_5v",
    "rectangle_181": "grp_5v",
    "text_182": "grp_5v",
    "rectangle_183": "grp_5v",
    "path_184": "grp_5v",
    "rectangle_185": "grp_5v",
    "text_186": "grp_5v",
    "text_187": "grp_5v",
    "arrow_188": "grp_1",
    "arrow_189": "grp_1",
    "rectangle_190": "grp_1",
    "text_191": "grp_1",
    "rectangle_192": "grp_1",
    "path_193": "grp_1",
    "rectangle_194": "grp_1",
    "text_195": "grp_1",
    "path_204": "grp_EE",
    "arrow_205": "grp_EE",
    "path_206": "grp_EE",
    "arrow_207": "grp_EE",
    "rectangle_208": "grp_EE",
    "text_209": "grp_EE",
    "rectangle_210": "grp_EE",
    "path_211": "grp_EE",
    "rectangle_212": "grp_EE",
    "text_213": "grp_EE",
    "text_214": "grp_EE",
    "path_226": "grp_2",
    "arrow_227": "grp_2",
    "path_228": "grp_2",
    "arrow_229": "grp_2",
    "rectangle_230": "grp_2",
    "text_231": "grp_2",
    "rectangle_232": "grp_2",
    "path_233": "grp_2",
    "rectangle_234": "grp_2",
    "text_235": "grp_2",
    "arrow_196": "grp_3",
    "arrow_197": "grp_3",
    "rectangle_198": "grp_3",
    "text_199": "grp_3",
    "rectangle_200": "grp_3",
    "path_201": "grp_3",
    "rectangle_202": "grp_3",
    "text_203": "grp_3",
    "arrow_169": "grp_4",
    "arrow_170": "grp_4",
    "rectangle_171": "grp_4",
    "text_172": "grp_4",
    "rectangle_173": "grp_4",
    "path_174": "grp_4",
    "rectangle_175": "grp_4",
    "text_176": "grp_4",
    "path_149": "grp_6",
    "arrow_150": "grp_6",
    "path_151": "grp_6",
    "arrow_152": "grp_6",
    "rectangle_153": "grp_6",
    "text_154": "grp_6",
    "rectangle_155": "grp_6",
    "path_156": "grp_6",
    "rectangle_157": "grp_6",
    "text_158": "grp_6",
    "path_159": "grp_8",
    "arrow_160": "grp_8",
    "path_161": "grp_8",
    "arrow_162": "grp_8",
    "rectangle_163": "grp_8",
    "text_164": "grp_8",
    "rectangle_165": "grp_8",
    "path_166": "grp_8",
    "rectangle_167": "grp_8",
    "text_168": "grp_8"
  },
  "byName": {
    "grp_5h": [
      "path_215",
      "arrow_216",
      "path_217",
      "arrow_218",
      "rectangle_219",
      "text_220",
      "rectangle_221",
      "path_222",
      "rectangle_223",
      "text_224",
      "text_225"
    ],
    "grp_5v": [
      "path_177",
      "arrow_178",
      "path_179",
      "arrow_180",
      "rectangle_181",
      "text_182",
      "rectangle_183",
      "path_184",
      "rectangle_185",
      "text_186",
      "text_187"
    ],
    "grp_1": [
      "arrow_188",
      "arrow_189",
      "rectangle_190",
      "text_191",
      "rectangle_192",
      "path_193",
      "rectangle_194",
      "text_195"
    ],
    "grp_EE": [
      "path_204",
      "arrow_205",
      "path_206",
      "arrow_207",
      "rectangle_208",
      "text_209",
      "rectangle_210",
      "path_211",
      "rectangle_212",
      "text_213",
      "text_214"
    ],
    "grp_2": [
      "path_226",
      "arrow_227",
      "path_228",
      "arrow_229",
      "rectangle_230",
      "text_231",
      "rectangle_232",
      "path_233",
      "rectangle_234",
      "text_235"
    ],
    "grp_3": [
      "arrow_196",
      "arrow_197",
      "rectangle_198",
      "text_199",
      "rectangle_200",
      "path_201",
      "rectangle_202",
      "text_203"
    ],
    "grp_4": [
      "arrow_169",
      "arrow_170",
      "rectangle_171",
      "text_172",
      "rectangle_173",
      "path_174",
      "rectangle_175",
      "text_176"
    ],
    "grp_6": [
      "path_149",
      "arrow_150",
      "path_151",
      "arrow_152",
      "rectangle_153",
      "text_154",
      "rectangle_155",
      "path_156",
      "rectangle_157",
      "text_158"
    ],
    "grp_8": [
      "path_159",
      "arrow_160",
      "path_161",
      "arrow_162",
      "rectangle_163",
      "text_164",
      "rectangle_165",
      "path_166",
      "rectangle_167",
      "text_168"
    ]
  }
},

  'ids': null,
  'clicked': null,
  'hover': [],

  // the current style group for the controls - necessary for e.g. visibility in animations
  'current': {},
  'animator': undefined,
  'animation0': undefined,
  // TODO: the connected options handler
  option: null,


  'topMostList': {
    'common': [],
    'active': [],
    'hover': [],
    'activehover': []
  },

  /**
   * Initializes the effects info.
   */
  'init': function() {
    // the ids of all controls with effects
    this.ids = Object.keys(this.infos);
    // connect event handling
    $event(_getSvgImg(), 'click', this.onClick.bind(this));
    $event(_getSvgImg(), 'mouseover', this.onMouseOver.bind(this));
    $event(_getSvgImg(), 'mouseout', this.onMouseOut.bind(this));

    // prepare topmost handling
    this.ids.forEach((id) => {
      var info = this.infos[id];
      if (info && info['topMost']) {
        var tm = info['topMost'];
        if (tm['common']) this.topMostList.common.push(id);
        if (tm['active']) this.topMostList.active.push(id);
        if (tm['hover']) this.topMostList.hover.push(id);
        if (tm['activehover']) this.topMostList.activehover.push(id);
        delete info['topMost'];
      }
    });

    const keys = this.infos ? Object.keys(this.infos) : [];
    if (this.animation0) {
      const keys2 = Object.keys(this.animation0);
      keys2.forEach((key2) => {
        if (keys.indexOf(key2) === -1) {
          keys.push(key2);
        }
      });
    }
    keys.forEach((key) => {
      this.setStyle2($('#' + key), key, "common");
    });

    return this;
  },

  /**
   * Handles a click event to set the active style effects.
   *
   * @param {Event} event The event info.
   * @returns void
   */
  'onClick': function(event) {
    var id = event.target.id,
        id2 = null,
        oldClicked = this.clicked;
    if ((!id || this.ids.indexOf(id) < 0) && event.target.parentNode) {
      id = event.target.parentNode.id;
    }

    if (id && this.ids.indexOf(id) >= 0) {
      id2 = this.groups.byId[id] ? "g" + this.groups.byId[id] : "i" + id;
    }

    // reset if any old
    if (oldClicked) {
      this.setStyle(oldClicked, this.hover.indexOf(oldClicked) >= 0 ? "hover" : "common");
      this.clicked = null;
    }

    // set new clicked item
    if (id2 && id2 !== oldClicked) {
      this.clicked = id2;
      this.setStyle(id2, this.hover.indexOf(id2) >= 0 ? "activehover" : "active");
    }
  },

  /**
   * Handles a mouse over event to set the hover style effects.
   *
   * @param {Event} event The event info.
   * @returns void
   */
  'onMouseOver': function(event) {
    var id = event.target.id, id2;
    if ((!id || this.ids.indexOf(id) < 0) && event.target.parentNode) {
      id = event.target.parentNode.id;
    }

    if (id && this.ids.indexOf(id) >= 0) {
      id2 = this.groups.byId[id] ? "g" + this.groups.byId[id] : "i" + id;

      if (this.hover.indexOf(id2) < 0) {
        this.hover.push(id2);
        this.setStyle(id2, this.clicked === id2 ? "activehover" : "hover");
      }
    }
  },

  /**
   * Handles a mouse leave event to set the hover style effects.
   *
   * @param {Event} event The event info.
   * @returns void
   */
  'onMouseOut': function(event) {
    var id = event.target.id, id2;
    if ((!id || this.ids.indexOf(id) < 0) && event.target.parentNode) {
      id = event.target.parentNode.id;
    }

    if (id && this.ids.indexOf(id) >= 0) {
      id2 = this.groups.byId[id] ? "g" + this.groups.byId[id] : "i" + id;

      var pos = this.hover.indexOf(id2);
      if (pos >= 0) {
        this.hover.splice(pos, 1);
        this.current[id2] = this.clicked === id2 ? "active" : "common";
        this.setStyle(id2, this.clicked === id2 ? "active" : "common");
      }
    }
  },

  /**
   * Sets the styles to set the effects.
   * @param {string} id2 The id of the elem to style.
   * @param {string} key The key of the style to use.
   * @returns void
   */
  'setStyle': function(id2, key) {
    var type = id2.charAt(0),
        id = id2.substr(1);

    if (type === 'g') {
      var items = this.groups.byName[id];
      if (items) {
        items.forEach((item) => this.setStyle('i' + item, key));
      }
    } else if (type === 'i') {
      this.current[id] = key;
      this.setStyle2($('#' + id), id, key);
     }

     // handle topmost list
     if (this.topMostList[key]) {
       this.topMostList[key].forEach((id) => this._toFront($('#' + id)));
     }
  },

  /**
   * Sets the styles to set the effects.
   * @param {Element} elem Th eelem to style.
   * @param {string} id The name of the styles to get.
   * @param {string} key The key of the style to use.
   * @returns void
   */
  'setStyle2': function(elem, id, key) {
    if (!elem || !elem.tagName) {
      return;
    }

    // handle groups
    if (elem.tagName === 'g') {
      // to front
      var info = this.infos[id];
      if (info && Object.keys(info).indexOf('toFront') >= 0) {
        elem = this._toFront(elem);
      }
      var children = elem.children;
      for (var i = 0; i < children.length; ++i) {
        this.setStyle2(children[i], id, key);
      }
    } else {
      // set style of item
      var info = this.infos[id];
      if (info) {
        Object.keys(info).forEach((name) =>  {
          if ("toFront" !== name) {
            elem.style[name] = info[name][key];
          } else if (elem.id === id) {
            this._toFront(elem);
          }
        });
      }

      // if not done with animation (handle: visibility)
      if (!this.animator || !this.animator.isActive()) {
        if (this.animation0 && this.animation0[id]
            && this.animation0[id]['visible-' + key] !== undefined) {
          elem.style.display = this.animation0[id]['visible-' + key] ? 'block' : 'none';
        }
      }
    }
  },

  '_toFront': function(elem) {
    if (elem) {
      // https://stackoverflow.com/questions/6566406/svg-re-ordering-z-index-raphael-optional
      // https://developer.mozilla.org/de/docs/Web/API/Node/insertBefore
      return elem.parentNode.appendChild(elem);
    }
    return elem;
  }
};

if (typeof animator !== 'undefined') {
  animator.effects = effects;
  effects.animator = animator;
}
if (typeof animation0 !== 'undefined') {
  effects.animation0 = animation0;
}

effects.init();
/* global option, animation0 */

if (typeof option !== 'undefined' && typeof animation0 !== 'undefined') {
  option.animation0 = animation0;
}

/**
 * Handles the context menu trigger to block it.
 * @param {Event} event The event data.
 * @returns {Boolean} true
 */
function onContextMenu(event) {
  event.preventDefault();
  return true;
}

// set a context menu handler
document.addEventListener('contextmenu', onContextMenu);

if (typeof animator !== 'undefined') {
  $event($('#tree-toggle'), 'change', (event) => {
    $$('g.actors').forEach((actors) => actors.className.baseVal = 'actors scratch');
    animator.stop();
    var menu = $('#ID_animation');
    if (menu) {
      menu.className.baseVal = 'ID_mi_stop';
    }
  });
}
}());
