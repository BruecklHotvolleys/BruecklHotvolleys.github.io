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
//-- create menu script -------------------------------------- (vvv) --
// --- ios helper --------------------------------- vv ---
var timer = null,
    cmPosX = -1000,
    cmPosY = -1000;

function touchstart(e) {
  cmPosX = e.touches[0].clientX;
  cmPosY = e.touches[0].clientY;
  touchend();
  if (e.touches.length === 1) {
    timer = setTimeout(function() { onlongtouch(cmPosX, cmPosY); }, 800);
  }
}

function touchmove(e) {
  if (timer) {
    if (Math.abs(cmPosX - e.touches[0].clientX) > 5 ||
        Math.abs(cmPosY - e.touches[0].clientY) > 5) {
      touchend();
    }
  }
}

function touchend() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function onlongtouch(x,y){
  timer = null;
  showContextMenu(x, y);
}

$event(document, 'touchstart', touchstart);
$event(document, 'touchend', touchend);
$event(document, 'touchmove', touchmove);
// --- ios helper --------------------------------- ^^ ---/* global $$ */
var cm, bg,
    cmInitialized = false,
    contextmenu = false;

function onContextMenu(event) {
  event.preventDefault();

  // ignore clicks outside of svg area
  var svg = _getSvgImg();
  if (!svg || !svg.contains(event.target)) {
    return;
  }

  // InternalError is unique for firefox - old firefox needs different handling of position when scrolled
  var isFirefox = !!window.InternalError,
      x = isFirefox ? event.pageX : event.clientX,
      y = isFirefox ? event.pageY : event.clientY;
  showContextMenu(x, y);
}

function showContextMenu(x, y) {
  // show context menu if not visible
  if (!contextmenu) {
    contextmenu = true;

    ContextMenuUpdater.updateOptions();

    // show background + context menu
    cm.style.display = 'block';
    bg.style.display = 'block';

    if (!cmInitialized) {
      cmInitialized = true;
      var box = cm.getBBox(),
          w = Math.floor(box.width) + 10;
      if (w > 200) {
        var rcMenuBg = cm.querySelector(':scope > rect'),
            rcsMi = cm.querySelectorAll(':scope > g.menuitem > rect.bg, :scope > g > g.menuitem > rect.bg'),
            smis = cm.querySelectorAll(':scope > g.submenuitem'),
            seps = cm.querySelectorAll(':scope > rect.separator');
        if (rcMenuBg) {
          rcMenuBg.style.width = (w + 4) + 'px';
        }
        if (rcsMi) {
          rcsMi.forEach((rcMi) => rcMi.style.width = w + 'px');
        }
        if (seps) {
          seps.forEach((sep) => sep.style.width = (w - 4) + 'px');
        }
        if (smis) {
          smis.forEach((smi) => {
            smi.querySelector(':scope > rect.bg').style.width = w + 'px';
            smi.querySelector(':scope > g.submenu').setAttribute('transform', 'translate(' + (w + 4) + ' 0)');
            smi.querySelector(':scope > path.marker_submenu').setAttribute('transform', 'translate(' + (w - 204) + ' 0)');

            // TODO repeat this handling for submenus
          });
        }
      }
    }

    var svg = _getSvgImg(), pt, svgP;
    try {
      // transform point to SVG coordinates
      pt = new DOMPoint(x,y);
      svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    } catch {
      // old browsers: create SVG point, set pos, transform to SVG coordinates
      pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    cm.setAttribute('transform', 'translate(' + svgP.x + ' ' + svgP.y + ') scale(1.95)');
  }
}
var ContextMenuUpdater = {
  updateOptions: function() {
    /**
     * Switch an option state.
     * @param {NodeList} elems A list of html elements.
     * @returns {void}
     */
    var setOpts = function(elems) {
      if (elems) {
        for (var i = 0, i2 = elems.length; i < i2; ++i) {
          var elem = elems[i],
              elemP = elem.parentNode;

          if (elemP.dataset && elemP.dataset.item) {
            var key = elemP.dataset.item;
            if (option.data[key] === true || option.data[key] === false) {
              elem.style.display = option.data[key] ? 'block' : 'none';
            }
          }
        }
      }
    };

    // handle all options: radios and checkboxes
    var rbs = document.getElementsByClassName('rb2'),
        cbs = document.getElementsByClassName('cb2');
    setOpts(rbs);
    setOpts(cbs);
  }
};

function onClick(event) {
  if (contextmenu) {
    contextmenu = false;
    cm.style.display = 'none';
    bg.style.display = 'none';

    var node = event.target;
    while (node) {
      if (node.dataset && node.dataset.item) {
        if (node.parentNode
            && node.parentNode.parentNode
            && node.parentNode.parentNode.dataset
            && node.parentNode.parentNode.dataset.group) {
          option.reset(node.parentNode.parentNode.dataset.group);
        }

        option.set(node.dataset.item);
        node = null;
      } else {
        node = node.parentNode;
      }
    }
  }
}

var option = {
  data: {

  },

  // the current state info
  _current: {
  },

  // TODO animation, effects
  // the connected animation info
  'animator': undefined,
  'animation0': undefined,
  // the connected effects handler
  effects: null,

  reset: function(keys) {
    if (typeof keys === 'string') {
      var keys2 = keys.split(',');
      if (Array.isArray(keys2)) {
        for (var i = 0, i2 = keys2.length; i < i2; ++i) {
          this.data[keys2[i]] = false;
          this._updateElems(keys2[i], false);
        }
      }
    }
  },

  set: function(key) {
    this.data[key] = !this.data[key];
    this._updateElems(key);
  },

  init: function() {
    for (var key in this.data) {
      
      this._updateElems(key);
    }
  },

  getCurrent: function(id) {
    if (this._current[id] !== undefined) {
      return this._current[id];
    }
    return true;
  },

  _updateElems: function(key, state) {
    var state0 = state === undefined ? this.data[key] : state;

    // items that reflect the state
    var elems = $$('[data-option="' + key + '"]');
    if (elems) {
      for (var i = 0, i2 = elems.length; i < i2; ++i) {
        var elem = elems[i],
            st = state0;
        if (elem.id && this.animation0 && this.animation0[elem.id]
            && this.animation0[elem.id]['visible-common'] !== undefined) {
          st = !!this.animation0[elem.id]['visible-common'];
        }
        elem.style.display = st ? "block" : "none";
        if (elem.id) {
          this._current[elem.id] = st;
        }
      }
    }

    // items that reflect the inverted state
    elems = $$('[data-option="' + key + '_not"]');
    if (elems) {
      for (var i = 0, i2 = elems.length; i < i2; ++i) {
        var elem = elems[i],
            st = state0;
        if (elem.id && this.animation0 && this.animation0[elem.id]
            && this.animation0[elem.id]['visible-common'] !== undefined) {
          st = !!this.animation0[elem.id]['visible-common'];
        }
        elem.style.display = st ? "none" : "block";
        if (elem.id) {
          this._current[elem.id] = !st;
        }
      }
    }
  }
};

option.init();

cm = $('#contextmenu');
bg = $('#contextmenu_bg');
$event(document, 'contextmenu', onContextMenu);
$event(bg, 'click', onClick);
$event(cm, 'click', onClick);

// init size of context submenu items (because of text size)
$$('g.submenuitem').forEach((sub) => {
  $event(sub, 'mouseenter', () => {
    var txts = $$('g.submenu > g.menuitem > text');
    // 200 size of menu item + 2px width border, 30 is left of text field
    var len = 170;
    txts.forEach((txt) => len = Math.max(len, Math.ceil(txt.getBBox().width + 5)));
    if (len > 170) {
      var first = true;
      txts.forEach((txt) => {
        if (first) {
          var rc = $('rect', txt.parentNode.parentNode);
          rc.style.width = (len + 34) + 'px';
          first = false;
        }
        var rc = $('rect', txt.parentNode);
        rc.style.width = (len + 30) + 'px';
      });
    }
  });
});

//-- create menu script -------------------------------------- (^^^) --
var animation0 = {
  "path_17": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "ellipse_18": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "line_19": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "line_20": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "ellipse_21": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "line_22": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "line_23": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "line_24": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "ellipse_25": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_26": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_27": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_28": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_29": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_30": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_31": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_32": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_33": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_34": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "text_35": {
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "player_37": {
    "x": 350.0,
    "y": 500.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_38": {
    "x": 25.0,
    "y": 450.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "player_41": {
    "x": 650.0,
    "y": 500.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_42": {
    "x": 100.0,
    "y": 100.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "player_45": {
    "x": 950.0,
    "y": 500.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_46": {
    "x": 1230.0,
    "y": 50.0,
    "angle": 0.0,
    "scale": 1.0,
    "visible-common": true
  },
  "ball_49": {
    "x": 1200.0,
    "y": 100.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "ball_52": {
    "x": 1250.0,
    "y": 150.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "player_55": {
    "x": 350.0,
    "y": 1000.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_56": {
    "x": 50.0,
    "y": 1550.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "ball_59": {
    "x": 30.0,
    "y": 1610.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "player_62": {
    "x": 650.0,
    "y": 1000.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_63": {
    "x": 100.0,
    "y": 2150.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "ball_66": {
    "x": 50.0,
    "y": 2170.0,
    "angle": 0.0,
    "scale": 1.0,
    "visible-common": true
  },
  "ball_69": {
    "x": 25.0,
    "y": 2110.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "player_72": {
    "x": 950.0,
    "y": 1000.0,
    "angle": 180.0,
    "scale": 1.0
  },
  "ball_73": {
    "x": 500.0,
    "y": 2150.0,
    "angle": 0.0,
    "scale": 1.0
  },
  "ball_76": {
    "x": 550.0,
    "y": 2170.0,
    "angle": 0.0,
    "scale": 1.0
  }
};
var animation = {
  "path_17": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 11.0
    }
  ],
  "ellipse_18": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 11.0
    }
  ],
  "line_19": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "line_20": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "ellipse_21": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "line_22": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "line_23": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "line_24": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "ellipse_25": [
    {
      "type": "vis",
      "visible": true,
      "at": 0.25
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.0
    }
  ],
  "text_26": [
    {
      "type": "vis",
      "visible": true,
      "at": 1.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 2.0
    }
  ],
  "text_27": [
    {
      "type": "vis",
      "visible": true,
      "at": 2.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 3.0
    }
  ],
  "text_28": [
    {
      "type": "vis",
      "visible": true,
      "at": 3.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 4.0
    }
  ],
  "text_29": [
    {
      "type": "vis",
      "visible": true,
      "at": 4.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 5.0
    }
  ],
  "text_30": [
    {
      "type": "vis",
      "visible": true,
      "at": 5.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 6.0
    }
  ],
  "text_31": [
    {
      "type": "vis",
      "visible": true,
      "at": 6.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 7.0
    }
  ],
  "text_32": [
    {
      "type": "vis",
      "visible": true,
      "at": 7.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 8.0
    }
  ],
  "text_33": [
    {
      "type": "vis",
      "visible": true,
      "at": 8.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 9.0
    }
  ],
  "text_34": [
    {
      "type": "vis",
      "visible": true,
      "at": 9.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 10.0
    }
  ],
  "text_35": [
    {
      "type": "vis",
      "visible": true,
      "at": 10.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 11.0
    }
  ],
  "player_37": [
    {
      "type": "mov",
      "x": -300.0,
      "y": -47.0,
      "mode": "linear",
      "start": 1.8,
      "end": 3.3
    },
    {
      "type": "mov",
      "x": 50.0,
      "y": 547.0,
      "mode": "linear",
      "start": 4.4,
      "end": 7.4
    },
    {
      "type": "mov",
      "x": 250.0,
      "y": -500.0,
      "mode": "linear",
      "start": 7.6,
      "end": 10.6
    },
    {
      "type": "rot",
      "angle": -85.0,
      "start": 1.6,
      "end": 1.9000000000000001
    },
    {
      "type": "rot",
      "angle": -100.0,
      "start": 4.0,
      "end": 4.3
    },
    {
      "type": "rot",
      "angle": -140.0,
      "start": 7.5,
      "end": 7.8
    },
    {
      "type": "rot",
      "angle": 145.0,
      "start": 10.4,
      "end": 10.8
    }
  ],
  "ball_38": [
    {
      "type": "mov",
      "x": 25.0,
      "y": 25.0,
      "mode": "linear",
      "start": 4.0,
      "end": 4.3
    },
    {
      "type": "mov",
      "x": 50.0,
      "y": 547.0,
      "mode": "linear",
      "start": 4.4,
      "end": 7.4
    },
    {
      "type": "mov",
      "x": -40.0,
      "y": 70.0,
      "mode": "linear",
      "start": 7.4,
      "end": 7.6000000000000005
    }
  ],
  "player_41": [
    {
      "type": "mov",
      "x": 0.0,
      "y": -200.0,
      "mode": "linear",
      "start": 1.7,
      "end": 2.7
    },
    {
      "type": "mov",
      "x": -525.0,
      "y": -190.0,
      "mode": "linear",
      "start": 2.7,
      "end": 5.2
    },
    {
      "type": "mov",
      "x": -25.0,
      "y": 890.0,
      "mode": "linear",
      "start": 5.6,
      "end": 8.6
    },
    {
      "type": "mov",
      "x": 550.0,
      "y": -500.0,
      "mode": "linear",
      "start": 8.9,
      "end": 11.9
    },
    {
      "type": "rot",
      "angle": -180.0,
      "start": 1.5,
      "end": 1.8
    },
    {
      "type": "rot",
      "angle": -70.0,
      "start": 2.6,
      "end": 2.8000000000000003
    },
    {
      "type": "rot",
      "angle": -110.0,
      "start": 5.4,
      "end": 5.6000000000000005
    },
    {
      "type": "rot",
      "angle": -135.0,
      "start": 8.8,
      "end": 9.100000000000001
    },
    {
      "type": "rot",
      "angle": 135.0,
      "start": 11.7,
      "end": 12.0
    }
  ],
  "ball_42": [
    {
      "type": "mov",
      "x": 25.0,
      "y": 35.0,
      "mode": "linear",
      "start": 5.4,
      "end": 5.6000000000000005
    },
    {
      "type": "mov",
      "x": -25.0,
      "y": 890.0,
      "mode": "linear",
      "start": 5.6,
      "end": 8.6
    },
    {
      "type": "mov",
      "x": 40.0,
      "y": 80.0,
      "mode": "linear",
      "start": 8.6,
      "end": 8.799999999999999
    }
  ],
  "player_45": [
    {
      "type": "mov",
      "x": 230.0,
      "y": -380.0,
      "mode": "linear",
      "start": 1.6,
      "end": 2.6
    },
    {
      "type": "mov",
      "x": -1010.0,
      "y": 910.0,
      "mode": "linear",
      "start": 3.6,
      "end": 6.6
    },
    {
      "type": "mov",
      "x": 780.0,
      "y": -530.0,
      "mode": "linear",
      "start": 7.1,
      "end": 11.1
    },
    {
      "type": "rot",
      "angle": -145.0,
      "start": 1.5,
      "end": 1.7
    },
    {
      "type": "rot",
      "angle": -170.0,
      "start": 3.3,
      "end": 3.5999999999999996
    },
    {
      "type": "rot",
      "angle": -170.0,
      "start": 7.0,
      "end": 7.2
    },
    {
      "type": "rot",
      "angle": 125.0,
      "start": 11.0,
      "end": 11.3
    }
  ],
  "ball_46": [
    {
      "type": "mov",
      "x": -1130.0,
      "y": 1050.0,
      "mode": "linear",
      "start": 4.0,
      "end": 4.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 3.0
    },
    {
      "type": "vis",
      "visible": true,
      "at": 6.7
    }
  ],
  "ball_49": [
    {
      "type": "mov",
      "x": -25.0,
      "y": -15.0,
      "mode": "linear",
      "start": 2.8,
      "end": 2.9
    },
    {
      "type": "mov",
      "x": 2.0,
      "y": 72.0,
      "mode": "linear",
      "start": 3.3,
      "end": 3.5999999999999996
    },
    {
      "type": "mov",
      "x": -1010.0,
      "y": 910.0,
      "mode": "linear",
      "start": 3.6,
      "end": 6.6
    },
    {
      "type": "mov",
      "x": -50.0,
      "y": 60.0,
      "mode": "linear",
      "start": 6.6,
      "end": 6.8
    }
  ],
  "ball_52": [
    {
      "type": "mov",
      "x": -35.0,
      "y": -35.0,
      "mode": "linear",
      "start": 3.1,
      "end": 3.2
    },
    {
      "type": "mov",
      "x": -72.0,
      "y": 8.0,
      "mode": "linear",
      "start": 3.3,
      "end": 3.5999999999999996
    },
    {
      "type": "mov",
      "x": -1010.0,
      "y": 910.0,
      "mode": "linear",
      "start": 3.6,
      "end": 6.6
    },
    {
      "type": "mov",
      "x": -50.0,
      "y": 35.0,
      "mode": "linear",
      "start": 6.6,
      "end": 6.8
    }
  ],
  "player_55": [
    {
      "type": "mov",
      "x": 0.0,
      "y": 320.0,
      "mode": "linear",
      "start": 2.0,
      "end": 4.0
    },
    {
      "type": "mov",
      "x": -280.0,
      "y": 280.0,
      "mode": "linear",
      "start": 4.0,
      "end": 6.0
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -400.0,
      "mode": "linear",
      "start": 6.6,
      "end": 8.6
    },
    {
      "type": "mov",
      "x": 100.0,
      "y": 0.0,
      "mode": "linear",
      "start": 8.8,
      "end": 9.200000000000001
    },
    {
      "type": "mov",
      "x": 160.0,
      "y": -200.0,
      "mode": "linear",
      "start": 9.2,
      "end": 10.7
    },
    {
      "type": "rot",
      "angle": 45.0,
      "start": 3.9,
      "end": 4.1
    },
    {
      "type": "rot",
      "angle": 65.0,
      "start": 5.9,
      "end": 6.1000000000000005
    },
    {
      "type": "rot",
      "angle": 75.0,
      "start": 6.3,
      "end": 6.6
    },
    {
      "type": "rot",
      "angle": 35.0,
      "start": 8.9,
      "end": 9.1
    },
    {
      "type": "rot",
      "angle": 140.0,
      "start": 10.5,
      "end": 10.8
    }
  ],
  "ball_56": [
    {
      "type": "mov",
      "x": 48.0,
      "y": 17.0,
      "mode": "linear",
      "start": 6.3,
      "end": 6.6
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -400.0,
      "mode": "linear",
      "start": 6.6,
      "end": 8.6
    },
    {
      "type": "mov",
      "x": 10.0,
      "y": -40.0,
      "mode": "linear",
      "start": 8.6,
      "end": 8.799999999999999
    }
  ],
  "ball_59": [
    {
      "type": "mov",
      "x": 16.0,
      "y": -48.0,
      "mode": "linear",
      "start": 6.3,
      "end": 6.6
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -400.0,
      "mode": "linear",
      "start": 6.6,
      "end": 8.6
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -60.0,
      "mode": "linear",
      "start": 8.6,
      "end": 8.799999999999999
    }
  ],
  "player_62": [
    {
      "type": "mov",
      "x": 150.0,
      "y": 150.0,
      "mode": "linear",
      "start": 1.9,
      "end": 2.9
    },
    {
      "type": "mov",
      "x": -525.0,
      "y": 550.0,
      "mode": "linear",
      "start": 2.9,
      "end": 5.4
    },
    {
      "type": "mov",
      "x": -200.0,
      "y": 400.0,
      "mode": "linear",
      "start": 5.4,
      "end": 7.4
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -900.0,
      "mode": "linear",
      "start": 7.9,
      "end": 10.4
    },
    {
      "type": "mov",
      "x": 100.0,
      "y": 0.0,
      "mode": "linear",
      "start": 10.5,
      "end": 10.9
    },
    {
      "type": "mov",
      "x": 455.0,
      "y": -200.0,
      "mode": "linear",
      "start": 10.9,
      "end": 13.4
    },
    {
      "type": "rot",
      "angle": -45.0,
      "start": 1.8,
      "end": 2.0
    },
    {
      "type": "rot",
      "angle": 90.0,
      "start": 2.8,
      "end": 3.0
    },
    {
      "type": "rot",
      "angle": -15.0,
      "start": 5.3,
      "end": 5.5
    },
    {
      "type": "rot",
      "angle": 155.0,
      "start": 7.6,
      "end": 7.8999999999999995
    },
    {
      "type": "rot",
      "angle": 55.0,
      "start": 10.8,
      "end": 11.0
    },
    {
      "type": "rot",
      "angle": 120.0,
      "start": 13.3,
      "end": 13.600000000000001
    }
  ],
  "ball_63": [
    {
      "type": "mov",
      "x": -48.0,
      "y": -73.0,
      "mode": "linear",
      "start": 7.6,
      "end": 7.8999999999999995
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -900.0,
      "mode": "linear",
      "start": 7.9,
      "end": 10.4
    },
    {
      "type": "mov",
      "x": 0.0,
      "y": -60.0,
      "mode": "linear",
      "start": 10.4,
      "end": 10.6
    }
  ],
  "ball_66": [
    {
      "type": "mov",
      "x": 40.0,
      "y": -1100.0,
      "mode": "linear",
      "start": 10.4,
      "end": 10.4
    },
    {
      "type": "vis",
      "visible": false,
      "at": 7.6
    },
    {
      "type": "vis",
      "visible": true,
      "at": 10.6
    }
  ],
  "ball_69": [
    {
      "type": "mov",
      "x": 75.0,
      "y": -30.0,
      "mode": "linear",
      "start": 7.6,
      "end": 7.8999999999999995
    },
    {
      "type": "mov",
      "x": 20.0,
      "y": -900.0,
      "mode": "linear",
      "start": 7.9,
      "end": 10.4
    },
    {
      "type": "mov",
      "x": 0.0,
      "y": -80.0,
      "mode": "linear",
      "start": 10.4,
      "end": 10.6
    }
  ],
  "player_72": [
    {
      "type": "mov",
      "x": -410.0,
      "y": 1130.0,
      "mode": "linear",
      "start": 1.7,
      "end": 5.7
    },
    {
      "type": "mov",
      "x": -390.0,
      "y": -945.0,
      "mode": "linear",
      "start": 6.3,
      "end": 9.8
    },
    {
      "type": "mov",
      "x": 800.0,
      "y": -185.0,
      "mode": "linear",
      "start": 10.1,
      "end": 13.1
    },
    {
      "type": "rot",
      "angle": 25.0,
      "start": 1.6,
      "end": 1.8
    },
    {
      "type": "rot",
      "angle": 130.0,
      "start": 6.0,
      "end": 6.3
    },
    {
      "type": "rot",
      "angle": 105.0,
      "start": 10.0,
      "end": 10.3
    },
    {
      "type": "rot",
      "angle": 100.0,
      "start": 12.9,
      "end": 13.200000000000001
    }
  ],
  "ball_73": [
    {
      "type": "mov",
      "x": 50.0,
      "y": -60.0,
      "mode": "linear",
      "start": 6.0,
      "end": 6.3
    },
    {
      "type": "mov",
      "x": -390.0,
      "y": -945.0,
      "mode": "linear",
      "start": 6.3,
      "end": 9.8
    },
    {
      "type": "mov",
      "x": -25.0,
      "y": -65.0,
      "mode": "linear",
      "start": 9.8,
      "end": 10.0
    }
  ],
  "ball_76": [
    {
      "type": "mov",
      "x": -45.0,
      "y": -60.0,
      "mode": "linear",
      "start": 6.0,
      "end": 6.3
    },
    {
      "type": "mov",
      "x": -390.0,
      "y": -945.0,
      "mode": "linear",
      "start": 6.3,
      "end": 9.8
    },
    {
      "type": "mov",
      "x": -20.0,
      "y": -25.0,
      "mode": "linear",
      "start": 9.8,
      "end": 10.0
    }
  ]
};
/* global $$, animation, animation0 */

var animator = {
  // to reset all animations
  animation0: null,
  // the steps of the animations
  animation: null,

  // the duration of the animation
  duration: 0,
  // when to restart looping
  restart: 0,

  // the animation timer id
  ID: undefined,
  // the current timestamp of the animation
  ts: 0,
  // the last system timestamp to calculate the next step
  lastTs: 0,

  // the connected effects handler
  effects: null,
  // the connected options handler
  option: null,

  /**
   * Initializes the animations - sets the data.
   * @param {array} animation0 How to reset all animations to restart.
   * @param {array} animation The animations steps.
   * @returns {void}
   */
  init: function(animation0, animation) {
    this.animation0 = animation0;
    this.animation = animation;
  },

  /**
   * Initializes the animations - sets the times.
   * @param {number} duration The duration of the animation.
   * @param {number} restart When to restart looping.
   * @returns {void}
   */
  initAnimation: function(duration, restart) {
    this.duration = duration;
    this.restart = restart;
  },

  isActive: function() {
    return !!this.ID;
  },

  start: function() {
    if (!this.ID) {
      this.ID = setInterval(this.handler.bind(this), 33);
    }
    this.lastTs = Date.now();
  },
  pause: function() {
    if (this.ID) {
      clearInterval(this.ID);
      this.ID = undefined;
    }
  },
  stop: function() {
    if (this.ID) {
      clearInterval(this.ID);
      this.ID = undefined;
    }
    this.ts = 0;
    this._reset(true);
  },

  handler: function() {
    // calculate next step
    var cur = Date.now();
    this.ts += (cur - this.lastTs) / 1000;
    this.lastTs = cur;

    // handle looping
    while (this.ts > this.duration) {
      this.ts -= this.duration - this.restart;
    }

    // calculate animation and update
    this._reset(false);
    this._update(this.ts);
  },

  _reset: function(full) {
    var keys = Object.keys(this.animation0);
    for (var i = 0; i < keys.length; ++i) {
      var id = keys[i],
          anim0 = this.animation0[id];

      this._setActor(id, anim0);
      if (full && anim0.draw !== undefined) {
        // console.log("reset draw " + keys[i]);
        this._setDraw(keys[i], anim0.draw);
      }
    }
  },

  _update: function(time) {
    // handle each actor
    var keys = Object.keys(this.animation0);
    for (var i = 0; i < keys.length; ++i) {
      var id = keys[i],
          anim0 = this.animation0[id],
          anims = this.animation[id];
      // ignore anim0 without animations (e.g. visibility without any animation)
      if (!anims) {
        continue;
      }
      var cur = {},
          keys2 = Object.keys(anim0);

      // clone anim0 (=initial pos/angle/...)
      for (var j = 0; j < keys2.length; ++j) {
        cur[keys2[j]] = anim0[keys2[j]];
      }

      // handle each animation of this actor
      for (var a = 0; a < anims.length; ++a) {
        var anim = anims[a];

        switch (anim.type) {
          case 'mov':
            if (time >= anim.end) {
              cur.x += anim.x;
              cur.y += anim.y;

            } else if (time > anim.start) {
              var dur = anim.end - anim.start,
                  t = time - anim.start;

              switch (anim.mode) {
                case "linear":
                  cur.x += anim.x / dur * t;
                  cur.y += anim.y / dur * t;
                  break;

                case "parable":
                  cur.x += this._getX(anim.angle, anim.speed, t / anim.slowmo);
                  cur.y += this._getY(anim.angle, anim.speed, t / anim.slowmo);
                  break;

                default:
                  log('Invalid move mode: ' + anim.mode + '!');
              }
            }
            break;

          case 'rot':
            if (time >= anim.end) {
              cur.angle += anim.angle;

            } else if (time > anim.start) {
              var dur = anim.end - anim.start,
                  t = time - anim.start;
              cur.angle += anim.angle / dur * t;
            }
            break;

          case 'scale':
            if (time >= anim.end) {
              cur.scale += anim.scale;
            } else if (time > anim.start) {
              var dur = anim.end - anim.start,
                  t = time - anim.start;
              cur.scale += anim.scale / dur * t;
            }
            break;

          case 'vis':
            if (time >= anim.at) {
              // udate right styling variant
              var postfix = !!this.effects && this.effects.current[id] ? this.effects.current[id] : 'common';
              cur['visible-' + postfix] = anim.visible;
            }
            break;

          case 'pla-typ':
            if (time >= anim.at) {
              cur.playertype = anim.playertype;
            }
            break;

          case 'pla-txt':
            if (time >= anim.at) {
              cur.playertext = anim.playertext;
            }
            break;

          case 'draw':
            // nothing to change for main item -> cur
            // subitems are updated in setDraw(...)
            // console.log("update draw");
            this._setDraw(id, anim0.draw, anim.items, time);
            break;

          default:
            console.log('Unsupported animation type: ' + anim.type + '!');
            break;
        }
      }

      this._setActor(id, cur);
    }
  },

  _setActor: function(id, anim) {
    const actor = $('#' + id);
    if (!actor) return;

    var keys = Object.keys(anim),
        trans = '';
    for (var i = 0; i < keys.length; ++i) {
      switch (keys[i]) {
        case 'x':
          trans += this._setPos(anim.x, anim.y);
          break;
        case 'y':
          // nothing to do
          break;

        case 'angle':
          trans += this._setRot(anim.angle, anim.rotx, anim.roty);
          break;
        case 'rotx':
        case 'roty':
          // nothing to do
          break;

        case 'scale':
          trans += this._setScale(anim.scale, anim.rotx, anim.roty);
          break;

        case 'playertype':
          this._setPlayerType(actor, anim.playertype);
          break;

        case 'playertext':
          this._setPlayerText(actor, anim.playertext);
          break;

        case 'draw':
          // nothing to do
          break;

        // nur animation
        // case 'visible':
        //  this._setVisibility(actor, anim.visible);
        //  break;
        // option handling ?!
        // effects handling


        default:
          var found = false;
          var parts = keys[i].split('-');
          if (parts.length === 2) {
            switch (parts[0]) {
              case 'visible':
                found = true;
                var cur = !!this.effects && this.effects.current[id] ? this.effects.current[id] : 'common';
                if (cur === parts[1]) {
                  this._setVisibility(actor, anim['visible-' + cur]);
                }
                break;
            }
          }
          if (!found) {
            console.log('Unsupported animation property: ' + keys[i] + '-' + anim[keys[i]] + '!');
          }
      }
    }
    if (trans !== '') {
      actor.setAttribute('transform', trans.trim());
    }
  },

  _setPos: function(x, y) {
    return ' translate(' + x + ', ' + y + ')';
  },

  _setRot: function(angle, rotx, roty) {
    return (rotx !== undefined && roty !== undefined)
        ? (' rotate(' + angle + ', ' + rotx + ', ' + roty + ')')
        : (' rotate(' + angle + ')');
  },

  _setScale: function(scale, cx, cy) {
    return (cx !== undefined && cy !== undefined)
        ? ' translate(' + cx + ', ' + cy + ') scale(' + scale + ') translate(' + -cx + ', ' + -cy + ')'
        : ' scale(' + scale + ')';
  },

  _setVisibility: function(actor, visible) {
    actor.style.display = visible ? 'block' : 'none';
  },

  _setPlayerType: function(actor, playertype) {
    actor.setAttribute('class', playertype);
  },

  _setPlayerText: function(actor, text) {
    var texts = actor.getElementsByTagName('text');
    if (texts !== null && texts.length > 0) {
      texts[0].innerHTML = text;
    }
  },

  _getX: function(angle, speed, time) {
    return speed * Math.cos(angle) * time * 1000;
  },

  _getY: function(angle, speed, time) {
    var G2 = 9.81 / 2.0;
    return -(speed * Math.sin(angle) * time - G2 * time * time) * 1000;
  },

  _setDraw: function(id, pos0, anims, time) {
    // initialize positions and check
    var pos1 = JSON.parse(JSON.stringify(pos0));
    if (!Array.isArray(pos1)) {
      log("Invalid animation data for " + id + "!");
      return;
    }

    // handle each position (if in animation)
    if (anims && time) {
      // check
      if (!Array.isArray(anims) || pos1.length !== anims.length) {
        log("Invalid animation data for " + id + "!");
        return;
      }

      // handle each position
      for (var p = 0, p2 = pos1.length; p < p2; ++p) {
        var pos = pos1[p],
            angle = pos1[p].angle,
            length = pos1[p].length;

        // handle each animation of position
        for (var a = 0, a2 = anims[p].length; a < a2; ++a) {
          var ai = anims[p][a];

          if (ai.end <= time) {
            switch (ai.type) {
              case 'show':
                pos.visible = ai.visible;
                break;

              case 'xy':
                pos.dx += ai.dx;
                pos.dy += ai.dy;
                break;

              case 'rel':
                angle += ai.angle;
                length += ai.length;
                var aa = angle * Math.PI / 180;
                pos.dx = Math.cos(aa) * length;
                pos.dy = Math.sin(aa) * length;
                break;
            }
          } else if (ai.start < time) {
            var dur = time - ai.start,
                duration = ai.end - ai.start;
            switch (ai.type) {
              case 'xy':
                pos.dx += ai.dx / duration * dur;
                pos.dy += ai.dy / duration * dur;
                break;

              case 'rel':
                angle += ai.angle / duration * dur;
                length += ai.length / duration * dur;
                var aa = angle * Math.PI / 180;
                pos.dx = Math.cos(aa) * length;
                pos.dy = Math.sin(aa) * length;
                break;
            }
          }
        }
      }
    }

    // connect positions (0 cannot have any predecessor)
    for (var p = 1, p2 = pos1.length; p < p2; ++p) {
      var pos = pos1[p];
      if (pos.predecessor >= 0) {
        var posP = pos1[pos.predecessor];
        pos.dx += posP.dx;
        pos.dy += posP.dy;
      }
    }

    // set items depending on the positions
    $$('g#' + id + ' > [data-anim-index]').forEach((item) => {
      var idx = parseInt(item.dataset.animIndex);
      if (isFinite(idx)) {
        var pos = pos1[idx],
            posP = pos.predecessor >= 0 ? pos1[pos.predecessor] : null;

        // set visibility
        this._setVisibility(item, pos.visible);

        // set position
        switch (item.tagName.toLowerCase()) {
          //<line x1="107" y1="115" x2="159" y2="115" id="draw_1_20" data-anim-index="9" style="fill: none; stroke: #111111; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;"/>
          case 'line':
            if (posP !== null) {
              item.setAttribute('x1', posP.dx);
              item.setAttribute('y1', posP.dy);
              item.setAttribute('x2', pos.dx);
              item.setAttribute('y2', pos.dy);
            } else {
              log("Cannot set line info for " + idx + "!");
            }
            break;

          //<ellipse cx="154" cy="107" rx="8" ry="8" id="draw_1_22" data-anim-index="10" style="stroke: none; fill: #eeeeee;"/>
          case 'ellipse':
            item.setAttribute('cx', pos.dx);
            item.setAttribute('cy', pos.dy);
            break;

          default:
            console.error('Cannot set position for svg-draw-item ' + item.tagname + '!');
        }
      }
    });
  }
};
animator.init(animation0, animation);

function onAnimClick(event) {
  var elem = event.target;
  while (elem) {
    if (elem.dataset && elem.dataset.item) {
      switch (elem.dataset.item) {
        case 'ID_mi_play':
          $$('g.actors').forEach((actors) => actors.className.baseVal = 'actors animation');
          animator.start();
          $('#ID_animation').className.baseVal = elem.dataset.item;
          break;
        case 'ID_mi_pause':
          // 'pause' is not allowed if state is 'stopped'
          if ($('#ID_animation').className.baseVal !== "ID_mi_stop") {
            animator.pause();
            $('#ID_animation').className.baseVal = elem.dataset.item;
          }
          break;
        case 'ID_mi_stop':
          $$('g.actors').forEach((actors) => actors.className.baseVal = 'actors scratch');
          animator.stop();
          $('#ID_animation').className.baseVal = elem.dataset.item;
          break;
      }
      elem = null;
    } else {
      elem = elem.parentNode;
    }
  }
}

$event($('#ID_animation'), 'click', onAnimClick);
animator.initAnimation(16.0, 0.0);
/* global option, animation0 */

if (typeof option !== 'undefined' && typeof animation0 !== 'undefined') {
  option.animation0 = animation0;
}

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
