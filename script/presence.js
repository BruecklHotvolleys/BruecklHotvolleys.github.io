// main namespace
if (window.bhv === undefined) {
  window.bhv = {};
}

// training namespace
if (window.bhv.training === undefined) {
  window.bhv.training = {};
}

/**
 * Create the presence info.
 */
window.bhv.training.presence = {

  checks: {
    'a': 1,
    'b': 3,
    'jungs': 3
  },

  /**
   * The diary data.
   */
  diary: null,
  /**
   * The targets.
   */
  targets: null,

  /**
   * Starts the creation of the presence view.
   * @return {bool} True if password is ok, otherwise false.
   */
  init: function() {
    var key = window.bhv.request.utils.getKey(), query, check;

    if (!this.checks[key]) {
      return false;
    }
    check = window.bhv.code.check();
    if (check !== this.checks[key] && check !== 0) {
      return false;
    }

    query = '/data/training/' + key + '.json';
    // load data and continue with init2
    this._getData(query, this.init2.bind(this), function(info) {
      // TODO error handler
    });
    return true;
  },

  /**
   * Try to load diary, too.
   * @param {string} rawdata The loaded data(JSON).
   * @return {void}
   */
  init2: function(rawdata) {
    var key = window.bhv.request.utils.getKey(),
        query = '/data/training/diary_' + key + '.json',

        continueOk = function(rawdiary) {
          this.init3(rawdata, rawdiary);
        },
        continueNok = function(info) {
          // TODO error handler if any real problem
          this.init3(rawdata, null);
        };

    // try to load diary
    this._getData(query, continueOk.bind(this), continueNok.bind(this));
  },

  /**
   * Try to load targets, too.
   * @param {string} rawdata The loaded data(JSON).
   * @param {string} rawdiary The loaded data of the diary(JSON).
   * @return {void}
   */
  init3: function(rawdata, rawdiary) {
    var key = window.bhv.request.utils.getKey(),
        query = '/data/training/targets_' + key + '.json',

        continueOk = function(rawtargets) {
          this.initCreate(rawdata, rawdiary, rawtargets);
        },
        continueNok = function(info) {
          // TODO error handler if any real problem
          this.initCreate(rawdata, rawdiary, null);
        };

    // try to load targets
    this._getData(query, continueOk.bind(this), continueNok.bind(this));
  },

  /**
   * Creates the presence view from the loaded data.
   * @param {string} rawdata The loaded data(JSON).
   * @param {string} rawdiary The loaded data of the diary(JSON).
   * @param {string} rawtargets The loaded data of the targets(JSON).
   * @return {void}
   */
  initCreate: function(rawdata, rawdiary, rawtargets) {
    var html, container,
        data = JSON.parse(rawdata),
        diary = rawdiary != null ? JSON.parse(rawdiary) : null,
        targets = rawtargets != null ? JSON.parse(rawtargets) : null;

    // if any data
    if (data) {

      // create view
      html = this.create(data, diary, targets);
      if (html == '') {
        html = '???';
      }

      // inject html
      container = document.getElementById('content_container');
      if (container) {
        container.innerHTML = html;
      }

      // store the diary and the targets to display it
      window.bhv.training.presence.diary = diary;
      window.bhv.training.presence.targets = targets;
    }

    this._showCol5();
  },

  _showCol5: function() {
    // show most right column
    var scroll = document.querySelector(
      'div#content_container > div#training > div.column.c4 > div.data > div.x1 > div:last-child'
    );
    if (scroll) {
      scroll.scrollIntoView(true);

      var info = null, main = null;
      // connect diary
      if (window.bhv.training.presence.diary != null) {
        var lnks = document.querySelectorAll(
            "div#content_container > div#training div.link_diary");

        main = document.querySelector('div#training');
        info = document.querySelector('div#training_info');
        if (main && info && lnks) {

          // show info
          var handler = function(event) {
            var elem = event.target;
            if (elem && elem.hasAttribute('data-diary')) {
              var key = elem.getAttribute('data-diary'),
                  infoTit = document.querySelector('div#training_info > div.title'),
                  infoInf = document.querySelector('div#training_info > div.info');
              if (infoTit && infoInf
                  && window.bhv.training.presence.diary[key]) {
                infoTit.innerHTML = window.bhv.training.presence.diary[key].title;
                infoInf.innerHTML = window.bhv.training.presence.diary[key].info;
                info.style.display = 'block';
                main.style.display = 'none';
              }
            }
          };
          for (var i = 0; i < lnks.length; ++i) {
            lnks[i].addEventListener('click', handler);
          }
        }
      }

      // connect targets
      if (window.bhv.training.presence.targets != null) {
        var lnksT = document.querySelectorAll(
            "div#content_container > div#training div.link_target");

        main = document.querySelector('div#training');
        info = document.querySelector('div#training_info');
        if (main && info && lnksT) {
          // show info
          var handlerT = function(event) {
            var elem = event.target;
            if (elem && elem.hasAttribute('data-target')) {
              var key = elem.getAttribute('data-target'),
                  infoTit = document.querySelector('div#training_info > div.title'),
                  infoInf = document.querySelector('div#training_info > div.info');
              if (infoTit && infoInf
                  && window.bhv.training.presence.targets[key]) {
                infoTit.innerHTML = key;
                infoInf.innerHTML = window.bhv.training.presence.targets[key];
                info.style.display = 'block';
                main.style.display = 'none';
              }
            }
          };
          for (var j = 0; j < lnksT.length; ++j) {
            lnksT[j].addEventListener('click', handlerT);
          }
        }
      }

      // hide info
      if (info != null && main != null) {
        var handlerInfo = function(event) {
          main.style.display = 'block';
          info.style.display = 'none';
        };
        info.addEventListener('click', handlerInfo);
      }

    } else {
      setTimeout(this._showCol5, 100);
    }
  },

  /**
   * Starts the loading of the data.
   * @param {string} query The html query.
   * @param {Function} The handler of the laoded data.
   * @param {Function} The error handler.
   * @return {void}
   */
  _getData: function(query, onSuccess, onError) {
    var request = new XMLHttpRequest();

    request.overrideMimeType('application/json');
    request.open('GET', query, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          onSuccess(request.responseText);
        } else {
          onError('' + request.status);
        }
      }
    };
    request.send();
  },

  /**
   * Creates the view.
   * @param {JSON} data The loaded data.
   * @param {JSON} diary The loaded diary or null.
   * @param {string} targets The loaded targets or null.
   * @return {string} The html view.
   */
  create: function(data, diary, targets) {
    return '<div id="training">'
      + this._createHeader(data)
      + this._createColumn(1, data, diary, targets)
      + this._createColumn(2, data, diary, targets)
      + this._createColumn(3, data, diary, targets)
      + this._createColumn(4, data, diary, targets)
      + this._createColumn(5, data, diary, targets)
      + '</div>'
      + '<div id="training_info">'
      + '<div class="title">&nbsp;</div>'
      + '<div class="info">&nbsp;</div>'
      + '</div>';
  },

  _createHeader: function(data) {
    return "<div class=\"caption\">{{title}}</div>".replace('{{title}}', this._nbsp(data.name));
  },

  /**
   * Creates the view of a column.
   * @param {integer} col The index of the column.
   * @param {JSON} data The loaded data.
   * @param {JSON} diary The loaded diary or null.
   * @param {string} targets The loaded targets or null.
   * @return {string} The html view.
   */
  _createColumn: function(col, data, diary, targets) {
    var html,
        result,
        attribs = '',
        colStart = '<div class="column c{{index}}"{{attribs}}>',
        colEnd = '</div>';

    switch(col) {
      case 1:
      case 5:
        html = this._createCol15(data, targets);
        break;
      case 2:
        html = this._createCol2(data, '&sum;', 0);
        break;
      case 3:
        html = this._createCol3(data, '%', 1);
        break;
      case 4:
        result = this._createColData(data, diary);
        html = result.html;
        attribs = ' style="' + result.style + '"';
        break;

      default:
        throw new Error('Invalid column to create: ' + col + '!');
    }
    return colStart
      .replace('{{index}}', col)
      .replace('{{attribs}}', attribs)
      + html + colEnd;
  },
  _createCol15: function(data, targets) {
    var html = '<div class="x2">&nbsp;</div>',
        tpl = '<div class="x1">{{name}}</div>',
        tplTargets = '<div class="x1 link_target" data-target="{{data}}">{{name}}</div>',
        name;

    for (var i = 0; i < data.lineheader.length; ++i) {
      name = data.lineheader[i];
      if (targets && targets[name]) {
        html += tplTargets
          .replace('{{data}}', name)
          .replace('{{name}}', this._nbsp(name));
      } else {
        html += tpl.replace('{{name}}', this._nbsp(name));
      }
    }

    return html;
  },
  _createCol2: function(data, info, index) {
    var html = '<div class="x2">' + info + '</div>', // &sum; %
        tpl = '<div class="x1">{{value}}</div>';

    for (var i = 0; i < data.data.length; ++i) {
      html += tpl.replace('{{value}}', data.data[i][index]); // 0 1
    }

    return html;
  },
  _createCol3: function(data, info, index) {
    var html = '<div class="x2">' + info + '&nbsp;</div>', // &sum; %
        tpl = '<div class="x1">&nbsp;{{value}}&nbsp;</div>';

    for (var i = 0; i < data.data.length; ++i) {
      html += tpl.replace('{{value}}', data.data[i][index]); // 0 1
    }

    return html;
  },

  /**
   * Creates the view of a data column.
   * @param {JSON} data The loaded data.
   * @param {JSON} diary The loaded diary or null.
   * @return {string} The html view.
   */
  _createColData: function(data, diary) {
    var html = '',
      tplRow = '<div class="x1">{{content}}</div>',
      tplCol = '<div>{{content}}</div>',
      tplColDiary = '<div class="link_diary" data-diary="{{data}}">{{content}}</div>',
      tplCol2 = '<div class="colspan2">{{content}}</div>';

    for (var row = -2, r2 = data.data.length; row < r2; ++row) {
      var htmlRow = '',
          src = row === -2 ? data.header1
            : (row === -1 ? data.header2 : data.data[row]),
          lastRow = row == r2 - 1,
          keyDay = '';

      // create a row of the data column
      for (var c = row < 0 ? 0 : 2, c2 = src.length; c < c2; ++c) {
        var value;

        switch (row) {
          // header 1
          case -2:
            value = '' + src[c];
            break;

          // header 2
          case -1:
            // value = src[c] === null ? '' : '' + src[c];
            keyDay = '';
            if (src[c] === null) {
              value = '';
            } else {
              value = '' + src[c];
              // get key of day
              keyDay = data.headerinfo[c];
            }
            break;

          // data (0-n)
          default:
            if (lastRow) {
              value = src[c] ? ('' + src[c]) : '';
            } else {
              value = src[c] === 1 ? '&#x2600;' : '';
            }
            break;
        }

        if (row == -1 && value.length > 2 && c < c2 - 1) {
          htmlRow += tplCol2.replace('{{content}}', this._nbsp(value));
          ++c;
        } else if (row == -1 && diary && diary[keyDay]) {
          htmlRow += tplColDiary
            .replace('{{data}}', keyDay)
            .replace('{{content}}', this._nbsp(value));
        } else {
          htmlRow += tplCol.replace('{{content}}', value === ''
            ? '&nbsp;' : this._nbsp(value));
        }
      }

      html += tplRow.replace('{{content}}', htmlRow);
    }

    return {
      "html": '<div class="data">' + html + '</div>',
      //                header + datarows
      "style": 'height: ' + (6 + 3 * data.data.length) + 'em;'
    };
  },

  _nbsp: function(txt) {
    if (!txt || !txt.replace) {
      txt = '???';
    }
    return txt.replace(/ /g, '&nbsp;');
  }
}
