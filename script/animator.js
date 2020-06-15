"use strict";

/**
 * Creates the animator.
 * @return {Animator} An animator.
 */
window.Animator = function () {
  var EMPTY = 0,
      MILLIS = 1000,
      SEC_1 = 1000,
      // START_ANIM = -0.0001,
      STATE_INIT = 1,
      STATE_NONE = 0,
      STATE_PAUSED = 2,
      STATE_RUN = 3,
      WAIT = 10;
  this.states = {
    /* eslint-disable sort-keys */
    'NONE': STATE_NONE,
    'INIT': STATE_INIT,
    'RUN': STATE_RUN,
    'PAUSED': STATE_PAUSED
    /* eslint-enable sort-keys */
  };
  this.restart = EMPTY;
  this.duration = EMPTY;
  this.handler = undefined;
  this.handlerThis = undefined;
  this.state = STATE_NONE;
  this.last = EMPTY;
  this.current = EMPTY;
  this.fps = EMPTY;
  this.idFps = EMPTY;

  /**
   * Initializies the animator.
   * @param {numeric} restart When to restart on looping.
   * @param {numeric} duration The duration of one animation loop.
   * @param {Funtion} handler The callback in animation.
   * @param {Animation} handlerThis The this for the callback.
   * @return {void}
   */
  this.init = function (restart, duration, handler, handlerThis) {
    this.restart = restart;
    this.duration = duration;
    this.handler = handler;
    this.handlerThis = handlerThis;

    // initialize the state only once, not on update
    if (this.state === this.states.NONE) {
      this.state = this.states.INIT;
    }
  };

  /**
   * Contains this document any animation?
   * @return {Boolean} True if animation has been initialized, otherwise false.
   */
  this._hasAnimation = function () {
    return this.state !== this.states.NONE;
  };

  /**
   * Is the animation currently running (it might be paused)?
   * @returns {Boolean} true if the animation is running, otherwise false.
   */
  this.isAnimation = function () {
    return this.state > this.states.INIT;
  };

  /**
   * Is the animation currently running and not paused?
   * @returns {Boolean} true if the animation is running and not paused,
   * otherwise false.
   */
  this.isAnimationRunning = function () {
    return this.state > this.states.PAUSED;
  };

  /**
   * Starts the animation.
   * @return {void}
   */
  this.start = function () {
    var self = this;

    if (this._hasAnimation()) {
      if (this.isAnimation()) {
        // resume from paused (if paused)
        this.state = this.states.RUN;
      } else {
        this.state = this.states.RUN;
        this.last = new Date().getTime() / MILLIS;

        if (this.handler) {
          this.handler.call(this.handlerThis, 'A', EMPTY);
        }

        this.fps = EMPTY;
        setTimeout(this._handle.bind(this), WAIT);

        if (!this.idFps) {
          this.idFps = setInterval(function () {
            self._fps();
          }, SEC_1);
        }
      }
    }
  };

  /**
   * Pauses the animation.
   * @return {void}
   */
  this.pause = function () {
    if (this._hasAnimation() && this.isAnimationRunning()) {
      this.state = this.states.PAUSED;
    }
  };

  /**
   * Stops the animation.
   * @return {void}
   */
  this.stop = function () {
    if (this._hasAnimation() && this.isAnimation()) {
      this.state = this.states.INIT;
      this.current = EMPTY;

      if (this.handler) {
        this.handler.call(this.handlerThis, 'S', EMPTY);
      }
    }
  };

  /**
   * Handles one step of the animation.
   * @return {void}
   */
  this._handle = function () {
    var cur,
        self = this;

    // to block the current step after stopping or pausinfg the animation
    if (this.isAnimation()) {
      cur = new Date().getTime() / MILLIS;

      if (this.isAnimationRunning()) {
        // debug frames per second
        ++this.fps;
        this.current += cur - this.last;

        if (this.current > this.duration) {
          while (this.current > this.duration) {
            this.current -= this.duration;
          }

          this.current += this.restart;
        }

        if (this.handler) {
          this.handler.call(this.handlerThis, 'U', this.current);
        }
      }

      this.last = cur;
      setTimeout(function () {
        self._handle();
      }, WAIT);
    }
  };

  /**
   * Debug logging of frames per second.
   * @return {void}
   */
  this._fps = function () {
    if (this._hasAnimation() && this.isAnimationRunning()) {
      // log(`fps: ${this.fps}`);
      this.fps = EMPTY;
    }
  };
};
