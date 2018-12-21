if (window.bhv === undefined) {
  window.bhv = {};
}

if (window.bhv.elements === undefined) {
  window.bhv.elements = {}
}

if (window.bhv.elements.expander === undefined) {
  window.bhv.elements.expander = {

    init: function(idsExpander) {
      var i;
      var clazz = 'expander';
      // if (mode != '') {
      //   clazz += ' ' + mode;
      // }
      var handler = function(event) {
        var header = event.target;
        if (header) {
          var id = header.id,
              id2 = id + '_2',
              div = document.getElementById(id2);
          if (div) {
            var show = div.style.display == 'none';
            header.className = show ? 'expandable up' : 'expandable'
            div.style.display = show ? 'block' : 'none';
          }
        }

        return false;
      }

      for (i = 0; i < idsExpander.length; ++i) {

        // header
        var id = idsExpander[i],
            id2 = id + '_2';
        var header = document.getElementById(id);
        var div = document.getElementById(id2);
        if (div && header && header.className.indexOf('expandable') > -1) {
          header.insertAdjacentHTML('beforeend', '<div class="' + clazz + '">&nbsp;</div>');
          this._addEvent(header, 'click', handler);

          // container to hide and show
          div.style.display = 'none';
        }
      }
    },

    _addEvent: function(elem, event, handler) {
      if (elem.addEventListener) {
        elem.addEventListener(event, handler); //, false);
      } else if (elem.attachEvent)  {
        elem.attachEvent('on' + event, function(ev) {
          if (!ev) ev = window.event;
          if (ev.target == undefined) {
            ev.target = ev.srcElement;
          }
          handler(ev);
        });
      }
    }
  }
}
