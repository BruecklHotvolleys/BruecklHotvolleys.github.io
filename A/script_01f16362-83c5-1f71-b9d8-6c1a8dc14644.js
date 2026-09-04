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
    'ID_window_editor_control_graphics_actor_actor_Actor_option_approach_info': true,
    'ID_window_editor_control_graphics_actor_actor_Actor_option_set_info': true
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
  "ball_157": {
    "x": 650.0,
    "y": 1650.0,
    "angle": 0.0,
    "scale": 1.0,
    "visible-common": true
  },
  "ball_160": {
    "x": 650.0,
    "y": 1650.0,
    "angle": 0.0,
    "scale": 1.0,
    "visible-common": true
  },
  "player_163": {
    "x": 412.0,
    "y": 1450.0,
    "angle": 7.8,
    "scale": 1.0,
    "playertype": "player"
  },
  "player_164": {
    "x": 612.0,
    "y": 1450.0,
    "angle": 7.8,
    "scale": 1.0,
    "playertype": "player"
  },
  "ball_165": {
    "x": 650.0,
    "y": 1650.0,
    "angle": 0.0,
    "scale": 1.0,
    "visible-common": true
  },
  "player_168": {
    "x": 779.0,
    "y": 1450.0,
    "angle": 0.0,
    "scale": 1.0,
    "playertype": "player"
  }
};
var animation = {
  "ball_157": [
    {
      "type": "mov",
      "x": 75.0,
      "y": -475.0,
      "mode": "linear",
      "start": 0.0,
      "end": 1.0
    },
    {
      "type": "mov",
      "x": -240.0,
      "y": 25.0,
      "mode": "linear",
      "start": 1.0,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": 150.0,
      "y": -600.0,
      "mode": "linear",
      "start": 1.1,
      "end": 1.6
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.7
    }
  ],
  "ball_160": [
    {
      "type": "mov",
      "x": 75.0,
      "y": -475.0,
      "mode": "linear",
      "start": 0.0,
      "end": 1.0
    },
    {
      "type": "mov",
      "x": -40.0,
      "y": 25.0,
      "mode": "linear",
      "start": 1.0,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": 150.0,
      "y": -600.0,
      "mode": "linear",
      "start": 1.1,
      "end": 1.6
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.7
    }
  ],
  "player_163": [
    {
      "type": "mov",
      "x": 23.0,
      "y": -180.0,
      "mode": "linear",
      "start": 0.6,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": -23.0,
      "y": 180.0,
      "mode": "linear",
      "start": 2.5,
      "end": 4.0
    },
    {
      "type": "pla-typ",
      "playertype": "player attack",
      "at": "1.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "1.4"
    }
  ],
  "player_164": [
    {
      "type": "mov",
      "x": 23.0,
      "y": -180.0,
      "mode": "linear",
      "start": 0.6,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": -23.0,
      "y": 180.0,
      "mode": "linear",
      "start": 2.5,
      "end": 4.0
    },
    {
      "type": "pla-typ",
      "playertype": "player attack",
      "at": "1.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "1.4"
    }
  ],
  "ball_165": [
    {
      "type": "mov",
      "x": 75.0,
      "y": -475.0,
      "mode": "linear",
      "start": 0.0,
      "end": 1.0
    },
    {
      "type": "mov",
      "x": 90.0,
      "y": 25.0,
      "mode": "linear",
      "start": 1.0,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": 50.0,
      "y": -600.0,
      "mode": "linear",
      "start": 1.1,
      "end": 1.6
    },
    {
      "type": "scale",
      "scale": 0.6,
      "start": 0.0,
      "end": 0.55
    },
    {
      "type": "scale",
      "scale": -0.6,
      "start": 0.55,
      "end": 1.0
    },
    {
      "type": "vis",
      "visible": false,
      "at": 1.7
    }
  ],
  "player_168": [
    {
      "type": "mov",
      "x": 0.0,
      "y": -180.0,
      "mode": "linear",
      "start": 0.6,
      "end": 1.1
    },
    {
      "type": "mov",
      "x": 0.0,
      "y": 180.0,
      "mode": "linear",
      "start": 2.5,
      "end": 4.0
    },
    {
      "type": "pla-typ",
      "playertype": "player attack",
      "at": "1.0"
    },
    {
      "type": "pla-typ",
      "playertype": "player",
      "at": "1.4"
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
animator.initAnimation(4.0, 0.0);
/* global animator, animation0 */

/**
 * The effects data and handler.
 */
var effects = {
  /**
   * The effect infos.
   */
  'infos': {
  "arrow_128": {
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
  "arrow_129": {
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
  "rectangle_130": {
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
  "text_131": {
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
  "rectangle_132": {
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
  "path_133": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_134": {
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
  "text_135": {
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
  "arrow_136": {
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
  "arrow_137": {
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
  "rectangle_138": {
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
  "text_139": {
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
  "rectangle_140": {
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
  "path_141": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_142": {
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
  "text_143": {
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
  "arrow_144": {
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
  "arrow_145": {
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
  "rectangle_146": {
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
  "text_147": {
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
  "rectangle_148": {
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
  "path_149": {
    "fill": {
      "common": "#d3d3d3",
      "hover": "#b22222"
    },
    "fill-opacity": {
      "common": "1",
      "hover": "1"
    }
  },
  "rectangle_150": {
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
  "text_151": {
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
  "ball_152": {
    "topMost": {
      "common": true,
      "hover": true,
      "active": true,
      "activehover": true
    }
  }
},
  /**
   * The grouping infos.
   */
  'groups': {
  "byId": {
    "arrow_144": "grp_3",
    "arrow_145": "grp_3",
    "rectangle_146": "grp_3",
    "text_147": "grp_3",
    "rectangle_148": "grp_3",
    "path_149": "grp_3",
    "rectangle_150": "grp_3",
    "text_151": "grp_3",
    "arrow_128": "grp_4",
    "arrow_129": "grp_4",
    "rectangle_130": "grp_4",
    "text_131": "grp_4",
    "rectangle_132": "grp_4",
    "path_133": "grp_4",
    "rectangle_134": "grp_4",
    "text_135": "grp_4",
    "arrow_136": "grp_1",
    "arrow_137": "grp_1",
    "rectangle_138": "grp_1",
    "text_139": "grp_1",
    "rectangle_140": "grp_1",
    "path_141": "grp_1",
    "rectangle_142": "grp_1",
    "text_143": "grp_1"
  },
  "byName": {
    "grp_3": [
      "arrow_144",
      "arrow_145",
      "rectangle_146",
      "text_147",
      "rectangle_148",
      "path_149",
      "rectangle_150",
      "text_151"
    ],
    "grp_4": [
      "arrow_128",
      "arrow_129",
      "rectangle_130",
      "text_131",
      "rectangle_132",
      "path_133",
      "rectangle_134",
      "text_135"
    ],
    "grp_1": [
      "arrow_136",
      "arrow_137",
      "rectangle_138",
      "text_139",
      "rectangle_140",
      "path_141",
      "rectangle_142",
      "text_143"
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
