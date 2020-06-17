"use strict";

/* eslint-disable object-shorthand, func-names, prefer-template,
                  prefer-destructuring, prefer-arrow-callback,
                  no-underscore-dangle,
                  no-var, one-var, sort-vars, sort-keys */

/* global log:false */
var START = 0,
    STATE_NONE = 0;
// block error because of undefined log in exported graphics
if (!window.log) {
  /* eslint-disable no-empty-function */
  window.log = function () {};
  /* eslint-enable no-empty-function */
}

/**
 * The controller of the svg view.
 */
window.svgviewer = {

  // #region -- The fields. ---------------------------------------------------
  // The animations.
  'animation': {},
  // To reset all animation and return to static image.
  'animation0': {},
  // The id of the svg view (set with init)
  'id': '??',
  // the animation state
  'state': STATE_NONE,
  // the animation controller
  'animator': new window.Animator(),
  // the menu handler
  'menuHandler': null,
  // #endregion -- The fields. ------------------------------------------------

  // #region -- Initialize the svg viewer. ------------------------------------
  /**
   * Initializes the svg viewer.
   * @param {string} id The id of the svg container.
   * @return {void}
   */
  'init': function init(id) {
    var NOT_FOUND = -1,
        btnPause,
        btnPlay,
        btnStop,
        control,
        headerRight,
        no_anim, no_menu, btnMenu,
        i,
        self = this;
    this.id = id;

    // ie8 - add indexOf to array
    if (!Array.prototype.indexOf) {
      /* eslint-disable no-extend-native */
      // $FlowFixMe  force setting of indexOf
      Array.prototype.indexOf = function (elem) {
        /* eslint-enable no-extend-native */
        for (i = START; i < this.length; ++i) {
          if (this[i] === elem) {
            return i;
          }
        }

        return NOT_FOUND;
      };
    }

    // the control, the container
    // control = document.querySelector('#' + id);
    control = document.querySelector('#' + id + ' div.animation_cmds');
    headerRight = document.querySelector('#header > div.right');
    if (control && headerRight) {
      btnMenu = control.querySelector('div.menu');
      no_anim = this._hasClass(control, 'no_anim');
      no_menu = this._hasClass(control, 'no_menu');
      if (!no_anim || !no_menu) {
        // clean header region
        while (headerRight.firstChild) {
          headerRight.removeChild(headerRight.firstChild);
        }
        control.parentNode.removeChild(control);
        headerRight.appendChild(control);
        // change id of container
        this.id = 'header';

        // update size if one is missing
        if (no_anim) {
          control.style.width = '0.91em';
          if (btnMenu != null) {
            btnMenu.style.left = 0;
          }
        } else if (no_menu) {
          control.style.width = '2.05em';
        }
      }
    }

    if (control) {
      // look for the buttons
      btnPlay = control.querySelector('div.animation_cmds > div.play');
      btnPause = control.querySelector('div.animation_cmds > div.pause');
      btnStop = control.querySelector('div.animation_cmds > div.stop');

      if (btnPlay && btnPause && btnStop) {
        btnPlay.addEventListener('click', function () {
          self.start();
        });
        btnPause.addEventListener('click', function () {
          self.pause();
        });
        btnStop.addEventListener('click', function () {
          self.stop();
        });
      }
    }
  },
  // #endregion -- Initialize the svg viewer. ---------------------------------

  // #region -- Sets the svg viewer. ------------------------------------------
  /**
   * Tries to set the title for exported viewers.
   * @param {string} title The title to set.
   * @return {void}
   */
  'setTitle': function setTitle(title) {
    var elemTitle = document.querySelector('div#header > div.left > div');

    if (elemTitle) {
      elemTitle.innerHTML = title;
    }
  },

  /**
   * Sets the initial type of a player.
   * @param {string} id The id of the player.
   * @param {string} type The type to set.
   * @return {void}
   */
  'setPlayerType': function setPlayerType(id, type) {
    var i, idType, player, playerType, typ, types;
    player = document.getElementById(id);

    if (player) {
      // the possible types and their names
      types = ['prepareblock', 'block', 'preparereception', 'reception', 'attack', 'attackleft', 'set'];
      // handle each type and show one or none
      for (i = START; i < types.length; ++i) {
        typ = types[i];
        idType = id + '-' + typ;
        playerType = document.getElementById(idType);

        if (playerType) {
          playerType.style.display = typ === type ? 'block' : 'none';
        }
      }
    }
  },

  /**
   * Sets the initial value of an option.
   * @param {string} key The name of the option.
   * @param {mixed} value The initial value.
   * @return {void}
   */
  'setOption': function setOption(key, value) {
    var elems, i, key2;
    key2 = key.replace(/:/g, '_');

    if (value === true || value === false) {
      elems = document.querySelectorAll("[data-xid=\"".concat(key2, "\"]"));
      if (elems) {
        for (i = START; i < elems.length; ++i) {
          elems[i].style.display = value ? 'block' : 'none';
        }
      }

      // handle toggle option
      elems = document.querySelectorAll("[data-xid=\"".concat(key2, "-x\"]"));
      if (elems) {
        for (i = START; i < elems.length; ++i) {
          elems[i].style.display = value ? 'none' : 'block';
        }
      }
    }
  },

  /**
   * Adds an animation info for an actor.
   * @param {string} id The id of the actor.
   * @param {AnimInfoType} anim A description of on step of the animation.
   * @return {void}
   */
  'addAnimation': function addAnimation(id, anim) {
    var INIT = 1;

    if (anim && anim.length) {
      this.animation[id] = anim;
      this.state = INIT;
    }
  },

  /**
   * Adds the initial animation info to reset the animation and return to the
   * values set by the static image.
   * @param {string} id The id of the actor.
   * @param {AnimInfoType} anim The description of the reset step of the
   * animation.
   * @return {void}
   */
  'addAnimation0': function addAnimation0(id, anim) {
    var k, keys; // if already set - add/overwrite keys

    if (this.animation0[id]) {
      keys = Object.keys(anim);

      for (k = START; k < keys.length; ++k) {
        this.animation0[id][keys[k]] = anim[keys[k]];
      }
    } else {
      // add reset info for this actor
      this.animation0[id] = anim;
    }
  },
  // #endregion -- Sets the svg viewer. ---------------------------------------

  // #region -- The animation - controller. -----------------------------------
  /**
   * Initializes the animation.
   * @param {number} restart The timestamp(seconds) when to restart looping.
   * @param {number} duration The duration of the initial loop.
   * @return {void}
   */
  'initAnimation': function initAnimation(restart, duration) {
    var elemAnim, elemPlay, elemStop;

    if (this.animator) {
      this.animator.init(restart, duration, this.handler, this);
    }
    // show controls on exported viewer
    elemAnim = document.querySelector('div#svgcanvas > div.animation_cmds');
    if (elemAnim) {
      elemAnim.style.display = 'block';
      this._removeClass(elemAnim, 'no_anim');
    }
  },

  /**
   * Resets the animation.
   * @return {void}
   */
  'resetAnimation': function resetAnimation() {
    this.stop();
  },

  /**
   * Starts the animation.
   * @return {void}
   */
  'start': function start() {
    var actions, btnContainer;
    // update commands
    btnContainer = document.querySelector('#' + this.id + ' div.animation_cmds');
    if (btnContainer) {
      this._addClass(btnContainer, 'canpause');
    }

    // hide actions (arrows of static image)
    actions = document.querySelector('svg g.actions');

    if (actions) {
      actions.style.display = 'none';
    }

    // start the animation
    this.animator.start();
    // log('start svg anim');
  },

  /**
   * Pauses the animation - only possible if the animation is running.
   * @return {void}
   */
  'pause': function pause() {
    // update commands
    var btnContainer = document.querySelector('#' + this.id + ' div.animation_cmds');

    if (btnContainer) {
      this._removeClass(btnContainer, 'canpause');
    }

    // pause the animation
    this.animator.pause();
    // log('pause svg anim');
  },

  /**
   * Stops the animation - possible if the animation is running or paused.
   * @return {void}
   */
  'stop': function stop() {
    var actions, btnContainer;
    // update commands
    btnContainer = document.querySelector('#' + this.id + ' div.animation_cmds');
    if (btnContainer) {
      this._removeClass(btnContainer, 'canpause');
    }

    // show actions (arrows of static image)
    actions = document.querySelector('svg g.actions');
    if (actions) {
      actions.style.display = 'inline-block';
    }

    // stop the animation
    this.animator.stop();
    // log('stop svg anim');
  },
  // #endregion -- The animation - controller. --------------------------------

  // #region -- The animation - handler(callback from animator). --------------
  /**
   * The handler of the animation callbacks.
   * @param {string} mode The mode - start Animation, Stop animation, Update.
   * @param {number} current The current timestamp.
   * @return {void}
   */
  'handler': function handler(mode, current) {
    // the timestamp to init the actors
    var START_ANIM = -0.0001;

    switch (mode) {
      // start animation
      case 'A':
        // initialize the actor for animation
        this._setActors(START_ANIM);
        break;

      // update animation
      case 'U':
        // set next pos
        this._setActors(current);
        break;

      case 'S':
        // reset the initial position of all actors
        this._setActors();
        break;

      default:
        throw new Error('Unsupported animation mode: ' + mode + '!');
    }
  },

  /* eslint-disable max-lines-per-function, max-statements, max-depth,
                    complexity */
  /**
   * Updates an actor during its animation.
   * @param {number} current The current timestamp.
   * @return {void}
   */
  '_setActors': function _setActors(current) {
    var LEN_ID_PLAYER = 7,
        i,
        i2,
        j,
        j2,
        ids,
        id,
        elem,
        actor,
        actions,
        action,
        reset,
        trans,
        angle,
        text,
        type,
        visible,
        x,
        y;

    if (current === undefined) {
      // reset initial position, rotation, type, ...
      ids = Object.keys(this.animation);

      if (ids) {
        for (i = START, i2 = ids.length; i < i2; ++i) {
          id = ids[i];
          actor = document.querySelector('svg #' + id);

          if (actor) {
            reset = this.animation0[id];

            if (reset) {
              trans = 'translate(' + reset.x + ', ' + reset.y + ') rotate(' + reset.angle + ')';
              actor.setAttribute('transform', trans);
              actor.style.display = reset.visible ? 'inline-block' : 'none';
              // special handling for players
              if (id.substr(START, LEN_ID_PLAYER) === 'player_') {
                // player - type
                window.svgviewer.setPlayerType(id, this._playerTypes[reset.type]);
                // player - text
                elem = actor.querySelector('text');
                if (elem) {
                  elem.textContent = reset.text;
                }
              }
            }
          }
        }
      }
    } else {
      // set current animation state
      ids = Object.keys(this.animation);

      if (ids) {  // NOSONAR
        for (i = START, i2 = ids.length; i < i2; ++i) {
          id = ids[i];
          actor = document.querySelector('svg #' + id);
          reset = this.animation0[id];

          if (actor && reset) {
            actions = this.animation[id];
            // init values
            angle = reset.angle;
            text = reset.text;
            type = reset.type;
            visible = reset.visible;
            x = reset.x;
            y = reset.y;

            // handle each action
            for (j = START, j2 = actions.length; j < j2; ++j) {
              action = actions[j];

              switch (action.type) {

                // move
                case 'M':
                  if (current > action.end) {
                    x += action.val1;
                    y += action.val2;
                  } else if (current > action.start) {
                    x += action.val1 / action.duration * (current - action.start);
                    y += action.val2 / action.duration * (current - action.start);
                  }
                  break;

                // rotation
                case 'R':
                  if (current > action.end) {
                    angle += action.val1;
                  } else if (current > action.start) {
                    angle += action.val1 / action.duration * (current - action.start);
                  }
                  break;

                // in-/visible
                case 'V':
                  if (current >= action.start) {
                    var VISIBLE = 'true';
                    visible = action.val1 === VISIBLE;
                  }
                  break;

                // type (player)
                case 'T':
                  if (current >= action.start) {
                    type = action.val1;
                  }
                  break;

                // text (player)
                case 't':
                  if (current >= action.start) {
                    text = action.val1;
                  }
                  break;

                // no default
              }
            }

            // position and rotation
            trans = 'translate(' + x + ', ' + y + ') rotate(' + angle + ')';
            actor.setAttribute('transform', trans);
            // visibility
            actor.style.display = visible ? 'inline-block' : 'none';

            // special handling for players
            if (id.substr(START, LEN_ID_PLAYER) === 'player_') {
              // player - type
              window.svgviewer.setPlayerType(id, this._playerTypes[type]);
              // player - text
              elem = actor.querySelector('text');
              if (elem && elem.textContent !== text) {
                elem.textContent = text;
              }
            }
          }
        }
      }
    }
  },
  /* eslint-enable max-statements */

  // The map of the types of the players.
  '_playerTypes': {
    'b': 'prepareblock',
    'B': 'block',
    'r': 'preparereception',
    'R': 'reception',
    'S': 'set',
    'A': 'attack',
    'a': 'attackleft'
  },
  // #endregion -- The animation - handler(callback from animator). -----------

  // #region -- The menu. -----------------------------------------------------
  /* eslint-disable max-statements */
  /**
   * Prepares the context menu.
   * @param {HtmlElement} canvas The svg canvas (usually its a div).
   * @param {HtmlElement} elemTrigger An additional trigger element (usually
   * its a div).
   * @return {void}
   */
  'initContextMenu': function initContextMenu(canvas, elemTrigger) {
    var menuVisible = false,
        self = this,
        bg = null,
        menu = null,

        // the handler to open the context menu
        handlerShow = function(mode, posX, posY) {
          var child1;

          // get menu container and its background
          bg = document.getElementById('svgmenu_bg');
          menu = document.querySelector('svg#svgmenu');

          if (bg && menu) {
            // check for rearranging the dom - necessary on first call only
            if (bg.parentNode !== document.body) {
              // get first child of 'body'
              child1 = document.body.firstChild;
              // remove bg and context menu
              if (bg.parentNode && menu.parentNode) {
                bg.parentNode.removeChild(bg);
                menu.parentNode.removeChild(menu);
              }

              // insert them into body
              if (document.body.insertBefore) {
                document.body.insertBefore(bg, child1);
                document.body.insertBefore(menu, child1);
              } else if (document.body.insertAdjacentElement) {
                document.body.insertAdjacentElement('afterbegin', menu);
                document.body.insertAdjacentElement('afterbegin', bg);
              } else {
                document.body.innerHTML = bg.outerHTML + menu.outerHTML
                  + document.body.innerHTML;
              }

              // // add handler to close the context menu
              // handlerClose = function handlerClose() {
              //   // if menu is visible: hide it
              //   if (menuVisible && bg && menu) {
              //     bg.style.display = 'none';
              //     menu.style.display = 'none';
              //     menuVisible = false;
              //   }
              // };

              bg.addEventListener('click', handlerClose);
              menu.addEventListener('click', handlerClose);
            }

            // show background of menu
            bg.style.display = 'block';
            // set pos of menu
            // menu.style.left = "".concat(event.clientX, "px");
            // menu.style.top = "".concat(event.clientY, "px");
            if (mode == 'R') {
              menu.style.left = '';
              menu.style.right = posX;
              menu.style.top = posY;
            } else {
              menu.style.right = '';
              menu.style.left = ''.concat(posX, 'px');
              menu.style.top = ''.concat(posY, 'px');
            }
            // show it
            menu.style.display = 'block';
            // init context menu
            self._initMenu();
            // store state
            menuVisible = true;
          }
        },

        // the handler to close the context menu
        handlerClose = function() {
          // if menu is visible: hide it
          if (menuVisible && bg && menu) {
            bg.style.display = 'none';
            menu.style.display = 'none';
            menuVisible = false;
          }
        };


    // show the context menu
    canvas.addEventListener('contextmenu', function (event) {
      if (!menuVisible) {
        handlerShow('L', event.clientX, event.clientY);
      }
    });

    if (elemTrigger != null) {
      // show/hide the context menu
      elemTrigger.addEventListener('click', function (event) {
        if (!menuVisible) {
          handlerShow('R', '1.3em', '8.9em');
        }
      });
    }
  },
  /* eslint-enable max-statements */

  /* eslint-disable max-statements */
  /**
   * Initializes the context menu on first call, ignores following calls.
   * @return {void}
   */
  '_initMenu': function _initMenu() {
    var i,
        lines,
        text,
        txt,
        box,
        rectBG,
        handler,
        len,
        path,
        fullKey,
        cur,
        FIRST = 0,
        INIT_LEN = 10,
        OFFSET_CB = 50,
        OFFSET_SEP_LINE = 5,
        grps = [],
        menu = document.querySelector('svg#svgmenu'),
        grpsCb = document.querySelectorAll('svg#svgmenu g.cb'),
        grpsMi = document.querySelectorAll('svg#svgmenu g.mi'),
        rect = document.querySelector('svg#svgmenu > g > rect.menu');

    if (grpsCb) {
      for (i = FIRST; i < grpsCb.length; ++i) {
        grps.push(grpsCb[i]);
      }
    }

    if (grpsMi) {
      for (i = FIRST; i < grpsMi.length; ++i) {
        grps.push(grpsMi[i]);
      }
    }

    // init only on first call (width's default value is 1)
    if (rect && rect.getAttribute('width') === '1') {
      text = document.querySelectorAll('svg#svgmenu g > text');
      rectBG = document.querySelectorAll('svg#svgmenu g > rect.bg');
      len = INIT_LEN;

      for (i = FIRST; i < text.length; ++i) {
        txt = text[i];
        box = txt.getBBox();
        len = Math.max(len, box.width);
      }

      len += OFFSET_CB;
      // main rectangle, menu
      rect.setAttribute('width', "".concat(len));
      menu.setAttribute('width', "".concat(len));

      // bg of each mi
      for (i = FIRST; i < rectBG.length; ++i) {
        rectBG[i].setAttribute('width', "".concat(len));
      }
      // (optional) lines of separators
      lines = document.querySelectorAll('g.sep > line.sep');

      if (lines) {
        for (i = FIRST; i < lines.length; ++i) {
          lines[i].setAttribute('x2', "".concat(len - OFFSET_SEP_LINE));
        }
      }

      // handle each group
      handler = function handler() {
        var newValue = undefined,
            group = null,
            rbs = null, rb,
            pathRb;

        // check for radiobutton
        if (this.hasAttribute('data-group')) {
          group = this.getAttribute('data-group');
          rbs = this.parentNode.querySelectorAll('[data-group="'.concat(group, '"]'));
          path = this.querySelector('path');

          if (rbs && path) {
            newValue = path.style.display === 'none';

            // nothing to do if selected rb clicked
            if (!newValue) {
              return;
            }

            // deselect previously selected ones
            for (i = 0; i < rbs.length; ++i) {
              rb = rbs[i];
              pathRb = rb.querySelector('path');
              if (pathRb.style.display !== 'none') {
                pathRb.style.display = 'none';
                fullKey = rb.getAttribute('data-key');
                // switch off option
                if (fullKey && window.svgviewer.menuHandler) {
                  window.svgviewer.menuHandler(fullKey, false);
                }
              }
            }

            // set option
            path.style.display = 'block';
            fullKey = this.getAttribute('data-key');
            if (fullKey && window.svgviewer.menuHandler) {
              window.svgviewer.menuHandler(fullKey, newValue);
            }
          }

          // radiobuttons handled
          return;
        }

        // handle checkboxes (toggle state)
        /* eslint-disable no-invalid-this */
        // this is set to clicked element
        path = this.querySelector('path');
        /* eslint-enable no-invalid-this */
        if (path) {
          newValue = path.style.display === 'none';
          path.style.display = newValue ? 'block' : 'none';
        }

        /* eslint-disable no-invalid-this */
        // this is set to clicked element
        fullKey = this.getAttribute('data-key');
        /* eslint-enable no-invalid-this */
        if (fullKey) {
          // // trigger app event only if in app
          // if (window.app && window.app.eventbus) {
          //   window.app.eventbus.trigger('svgmenu', fullKey);
          // }
          // call menu handler (e.g. exported infos)
          if (window.svgviewer.menuHandler) {
            window.svgviewer.menuHandler(fullKey, newValue);
          }
        }
      };

      for (i = FIRST; i < grps.length; ++i) {
        grps[i].addEventListener('click', handler);
      }
    }
    // if in app, cb only: try to read the current values from settings
    if (window.app && window.app.eventbus) {
      // handle each checkbox
      for (i = FIRST; i < grpsCb.length; ++i) {
        fullKey = grpsCb[i].getAttribute('data-key');

        if (fullKey !== undefined && fullKey !== null && fullKey !== '') {
          // read current value and update menu item
          cur = window.app.readSetting(fullKey, false);
          path = grpsCb[i].querySelector('path');

          if (path) {
            path.style.display = cur === true ? 'block' : 'none';
          }
        }
      }
    }
  },
  /* eslint-enable max-statements */
  // #endregion -- The menu. --------------------------------------------------

  // #region -- Utilities. ----------------------------------------------------
  /**
   * Adds a style class for an element.
   * @param {Element} elem The element to handle.
   * @param {string} clazz The name of the style class to add.
   * @return {void}
   */
  '_addClass': function _addClass(elem, clazz) {
    var NOT_FOUND = -1,
        classes,
        cn = elem.className;

    // if any class found on element
    if (cn) {
      // add name of additional class
      classes = cn.split(' ');
      if (classes.indexOf(clazz) === NOT_FOUND) {
        elem.className += ' ' + clazz;
      }

    } else {
      // else: set name of class to add as first one
      elem.className = clazz;
    }
  },

  /**
   * Removes a style class from an element.
   * @param {Element} elem The element to handle.
   * @param {string} clazz The name of the style class to remove.
   * @return {void}
   */
  '_removeClass': function _removeClass(elem, clazz) {
    var NOT_FOUND = -1,
        REMOVE_1 = 1,
        classes,
        cn = elem.className,
        pos;

    // if any class found
    if (cn) {
      // get all existing class names
      classes = cn.split(' ');
      // check if class to remove exists - if found: remove it
      pos = classes.indexOf(clazz);
      if (pos > NOT_FOUND) {
        classes.splice(pos, REMOVE_1);
        elem.className = classes.join(' ');
      }
    }
  },

  /**
   * Checks if a style class from an element exists.
   * @param {Element} elem The element to handle.
   * @param {string} clazz The name of the style class to remove.
   * @return {bool} True if given class exists on the given element, otherwise
   * false.
   */
  '_hasClass': function(elem, clazz) {
    var NOT_FOUND = -1,
        classes,
        cn = elem.className,
        pos;

    // if any class found
    if (cn) {
      // get all existing class names
      classes = cn.split(' ');
      // check if class exists
      pos = classes.indexOf(clazz);
      return pos > NOT_FOUND;
    }
  }
  // #endregion -- Utilities. -------------------------------------------------
};
