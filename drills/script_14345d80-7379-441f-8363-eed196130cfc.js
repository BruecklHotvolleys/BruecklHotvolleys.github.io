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
  "player_1": {
    "x": 1200.0,
    "y": 175.0,
    "angle": -90.0,
    "scale": 1.0,
    "visible-common": true
  },
  "player_2": {
    "x": 1000.0,
    "y": 175.0,
    "angle": 225.0,
    "scale": 1.0,
    "playertype": "player attack"
  },
  "player_3": {
    "x": 350.0,
    "y": 800.0,
    "angle": 45.0,
    "scale": 1.0,
    "playertype": "player defense"
  },
  "player_4": {
    "x": 650.0,
    "y": 350.0,
    "angle": 75.0,
    "scale": 1.0,
    "visible-common": false,
    "visible-active": false,
    "visible-hover": false,
    "visible-activehover": false
  },
  "player_5": {
    "x": 950.0,
    "y": 800.0,
    "angle": -10.0,
    "scale": 1.0,
    "playertype": "player"
  },
  "player_6": {
    "x": 300.0,
    "y": 175.0,
    "angle": 135.0,
    "scale": 1.0,
    "playertype": "player attack"
  },
  "ball_7": {
    "x": 925.0,
    "y": 200.0,
    "angle": 0.0,
    "scale": 1.0
  }
};
var animation = {
  "player_1": [
    {
      "type": "mov",
      "x": -200.0,
      "y": 0.0,
      "mode": "linear",
      "start": 0.5,
      "end": 1.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 0.0
    }
  ],
  "player_2": [
    {
      "type": "mov",
      "x": -50.0,
      "y": 625.0,
      "mode": "linear",
      "start": 0.3,
      "end": 1.8
    },
    {
      "type": "rot",
      "angle": -40.0,
      "start": 0.2,
      "end": 0.4
    },
    {
      "type": "rot",
      "angle": 130.0,
      "start": 1.7,
      "end": 2.0
    },
    {
      "type": "rot",
      "angle": 35.0,
      "start": 4.1,
      "end": 4.3
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "0.2"
    },
    {
      "type": "pla-typ",
      "playertype": "player prepare-defense",
      "at": "2.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player defense",
      "at": "2.5"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "3.5"
    },
    {
      "type": "pla-typ",
      "playertype": "player prepare-defense",
      "at": "4.5"
    }
  ],
  "player_3": [
    {
      "type": "mov",
      "x": 300.0,
      "y": -500.0,
      "mode": "linear",
      "start": 2.8,
      "end": 3.8
    },
    {
      "type": "mov",
      "x": 450.0,
      "y": -50.0,
      "mode": "linear",
      "start": 4.3,
      "end": 5.3
    },
    {
      "type": "rot",
      "angle": -35.0,
      "start": 1.5,
      "end": 1.7
    },
    {
      "type": "rot",
      "angle": 20.0,
      "start": 2.8,
      "end": 3.0
    },
    {
      "type": "rot",
      "angle": 60.0,
      "start": 3.7,
      "end": 3.9000000000000004
    },
    {
      "type": "rot",
      "angle": -15.0,
      "start": 4.3,
      "end": 4.5
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "1.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player prepare-defense",
      "at": "2.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "2.8"
    },
    {
      "type": "pla-typ",
      "playertype": "player set",
      "at": "3.7"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "4.3"
    }
  ],
  "player_4": [
    {
      "type": "mov",
      "x": 450.0,
      "y": -100.0,
      "mode": "linear",
      "start": -0.7,
      "end": 0.30000000000000004
    },
    {
      "type": "mov",
      "x": 0.0,
      "y": -75.0,
      "mode": "linear",
      "start": 0.3,
      "end": 0.8
    },
    {
      "type": "mov",
      "x": -100.0,
      "y": 0.0,
      "mode": "linear",
      "start": 0.8,
      "end": 1.3
    },
    {
      "type": "rot",
      "angle": -75.0,
      "start": 0.2,
      "end": 0.4
    },
    {
      "type": "rot",
      "angle": -90.0,
      "start": 0.7,
      "end": 0.8999999999999999
    },
    {
      "type": "rot",
      "angle": -45.0,
      "start": 1.2,
      "end": 1.4
    },
    {
      "type": "vis",
      "visible": true,
      "at": 0.0
    }
  ],
  "player_5": [
    {
      "type": "mov",
      "x": -300.0,
      "y": -500.0,
      "mode": "linear",
      "start": 0.3,
      "end": 1.3
    },
    {
      "type": "mov",
      "x": -450.0,
      "y": -50.0,
      "mode": "linear",
      "start": 2.3,
      "end": 3.3
    },
    {
      "type": "mov",
      "x": 0.0,
      "y": -75.0,
      "mode": "linear",
      "start": 3.3,
      "end": 3.8
    },
    {
      "type": "mov",
      "x": 100.0,
      "y": 0.0,
      "mode": "linear",
      "start": 3.8,
      "end": 4.3
    },
    {
      "type": "rot",
      "angle": -20.0,
      "start": 0.3,
      "end": 0.5
    },
    {
      "type": "rot",
      "angle": -60.0,
      "start": 1.2,
      "end": 1.4
    },
    {
      "type": "rot",
      "angle": 15.0,
      "start": 2.2,
      "end": 2.4000000000000004
    },
    {
      "type": "rot",
      "angle": 75.0,
      "start": 3.2,
      "end": 3.4000000000000004
    },
    {
      "type": "rot",
      "angle": 90.0,
      "start": 3.7,
      "end": 3.9000000000000004
    },
    {
      "type": "rot",
      "angle": 45.0,
      "start": 4.2,
      "end": 4.4
    },
    {
      "type": "pla-typ",
      "playertype": "player prepare-defense",
      "at": "0.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "0.3"
    },
    {
      "type": "pla-typ",
      "playertype": "player set",
      "at": "1.2"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "2.0"
    }
  ],
  "player_6": [
    {
      "type": "mov",
      "x": 50.0,
      "y": 625.0,
      "mode": "linear",
      "start": 2.8,
      "end": 4.3
    },
    {
      "type": "rot",
      "angle": 40.0,
      "start": 2.7,
      "end": 2.9000000000000004
    },
    {
      "type": "rot",
      "angle": -130.0,
      "start": 4.2,
      "end": 4.5
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "0.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player attack",
      "at": "2.4"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "2.7"
    },
    {
      "type": "pla-typ",
      "playertype": "player prepare-defense",
      "at": "4.5"
    }
  ],
  "ball_7": [
    {
      "type": "mov",
      "x": -525.0,
      "y": 550.0,
      "mode": "linear",
      "start": 0.0,
      "end": 0.5
    },
    {
      "type": "mov",
      "x": 225.0,
      "y": -450.0,
      "mode": "linear",
      "start": 0.5,
      "end": 1.5
    },
    {
      "type": "mov",
      "x": -300.0,
      "y": -50.0,
      "mode": "linear",
      "start": 1.5,
      "end": 2.5
    },
    {
      "type": "mov",
      "x": 575.0,
      "y": 500.0,
      "mode": "linear",
      "start": 2.5,
      "end": 3.0
    },
    {
      "type": "mov",
      "x": -225.0,
      "y": -450.0,
      "mode": "linear",
      "start": 3.0,
      "end": 4.0
    },
    {
      "type": "mov",
      "x": 250.0,
      "y": -100.0,
      "mode": "linear",
      "start": 4.0,
      "end": 5.0
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
animator.initAnimation(5.0, 0.0);
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
