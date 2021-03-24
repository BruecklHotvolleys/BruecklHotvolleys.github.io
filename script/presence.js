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
    'a20': 1,
    'a': 1,
    'b': 3,
    'jungs': 3,
    // admin
    'a1': 0,
    'a2': 0,
    'a3': 0,
    'a4': 0,
    'a5': 0,
    'a6': 0,
    'a7': 0,
    'b2': 0,
    'b3': 0,
    'b4': 0,
    'b5': 0,
    'b6': 0,
    'b7': 0
  },
  old_create: ['a20', 'b20', 'jungs'],

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

    if (!this.checks[key] && this.checks[key] !== 0) {
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
          this.initCreate(key, rawdata, rawdiary, rawtargets);
        },
        continueNok = function(info) {
          // TODO error handler if any real problem
          this.initCreate(key, rawdata, rawdiary, null);
        };

    // try to load targets
    this._getData(query, continueOk.bind(this), continueNok.bind(this));
  },

  /**
   * Creates the presence view from the loaded data.
   * @param {string} key The key of the data to display.
   * @param {string} rawdata The loaded data(JSON).
   * @param {string} rawdiary The loaded data of the diary(JSON).
   * @param {string} rawtargets The loaded data of the targets(JSON).
   * @return {void}
   */
  initCreate: function(key, rawdata, rawdiary, rawtargets) {
    var html, container,
        data = JSON.parse(rawdata),
        diary = rawdiary != null ? JSON.parse(rawdiary) : null,
        targets = rawtargets != null ? JSON.parse(rawtargets) : null;

    // if any data
    if (data) {

      // create view
      if (this.old_create.indexOf(key) > -1) {
        html = this.create(data, diary, targets);
      } else {
        // special handling for xinfos
        if (!diary && data.xinfo) {
          diary = data.xinfo;
        }

        // new create
        html = this.create2(data.config, data, diary, targets);
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

    this._showView();
  },

  /**
   * Shows the view, init click handlers, scroll to last data column.
   * @return {void}
   */
  _showView: function() {
    // show most right column
    var targetColumn = document.querySelector(
      'div#content_container > div#training > div.column.xdata > div.data > div.x1 > div:last-child'
    );
    if (targetColumn) {
      targetColumn.scrollIntoView(true);

      var info = null, main = null;
      // connect diary
      if (window.bhv.training.presence.diary != null) {
        var lnks = document.querySelectorAll(
            "div#content_container > div#training div.link_diary"),
            lnks2 = document.querySelectorAll(
            "div#content_container > div#training div.link_diary > span");

        main = document.querySelector('div#training');
        info = document.querySelector('div#training_info');
        if (main && info && lnks) {

          // show info
          var showInfo = function(elem) {
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
          }, handler = function(event) {
            showInfo(event.target);
          }, handler2 = function(event) {
            var elem = event.target;
            if (elem) {
              showInfo(elem.parentNode);
            }
          }, i;

          for (i = 0; i < lnks.length; ++i) {
            lnks[i].addEventListener('click', handler);
          }

          if (lnks2) {
            for (i = 0; i < lnks2.length; ++i) {
              lnks2[i].addEventListener('click', handler2);
            }
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
      setTimeout(this._showView, 100);
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

    // container + main header
    var i, colData1 = -1,
        html = this._createHeader(data.name)
            + '<div id="training">';

    for (i = 0; i < data.headerinfo.length; ++i) {
      if (data.headerinfo && data.headerinfo[i] ) {

        // xtra column
        if (data.headerinfo[i] === ':XCol') {

          // handle collected data columns (if any)
          if (colData1 != -1) {
            html += this._addDataCol(data, diary, colData1, i - 1);
            colData1 = -1;
          }

          // create xtra column
          html += this._addXCol(data, targets, i);

        // start collectiong the data columns
        } else if (colData1 == -1) {
          colData1 = i;
        }
      }
    }
    // if table ends with data column
    if (colData1 != -1) {
      html += this._addDataCol(data, diary, targets, colData1, i - 1);
      // colData1 = -1;
    }

    // terminate container, add info view, return result
    return html + '</div>'
      + '<div id="training_info">'
      + '<div class="title">&nbsp;</div>'
      + '<div class="info">&nbsp;</div>'
      + '</div>';
  },

  /**
   * Creates the view - v2.
   * @param {JSON} config The configuration.
   * @param {JSON} data The loaded data.
   * @param {JSON} diary The loaded diary or null.
   * @param {string} targets The loaded targets or null.
   * @return {string} The html view.
   */
  create2: function(config, data, diary, targets) {

    // container + main header
    var col, cols, //, i, colData1 = -1,
        html = this._createHeader(config.caption)
            + '<div id="training" class="' + config.stylekey + '">',
        htmlData = '';

    if (data && Array.isArray(data.data) && Array.isArray(data.data[0])) {
      cols = data.data[0].length;

      for (col = 0; col < cols; ++col) {
        if (col < config.left) {
          html += this._createLeftColumn(config, col, data, diary, targets);
        } else if (col >= cols - config.right - 1) {
          if (htmlData != '') {
            html += htmlData;
            htmlData = '';
          }
          html += this._createRightColumn(config, col, data, diary, targets);
        } else {
          htmlData += this._createDataColumn(config, col, cols - config.right - 1, data, diary, targets);
          col = cols - config.right - 1;
        }
      }
    }

    if (htmlData != '') {
      html += htmlData;
      // htmlData = '';
    }

    // terminate container, add info view, return result
    return html + '</div>'
      + '<div id="training_info">'
      + '<div class="title">&nbsp;</div>'
      + '<div class="info">&nbsp;</div>'
      + '</div>';
  },

  _createLeftColumn: function(config, col, data, diary, targets) {
    var src, html = '', isHeader,
        tplXCol = '<div class="x2">{{content}}</div>',
        tplXCol2 = '<div class="x2 x2b">{{content1}}<div>{{content2}}</div></div>',
        tpl = '<div class="x1{{xclass}}">{{value}}</div>',
        tplTargets = '<div class="x1 link_target{{xclass}}" data-target="{{data}}">{{value}}</div>',
        tplColStart = '<div class="column xcolumn">',
        tplColEnd = '</div>',
        row, rows = config.header
          + (data && Array.isArray(data.data) ? data.data.length : 0),
        value, vals, lenOfValue, xclass;

    for (row = 0; row < rows; ++row) {
      isHeader = row < config.header;
      src = isHeader ? data['header' + (row + 1)]
          : data.data[row - config.header];
      if (src) {
        value = src[col];
        if (value === undefined || value === "") {
          value = ' ';
        }
        lenOfValue = value.length;
        value = this._nbsp(value);
        xclass = '';
        if (col < config.left && lenOfValue > config.left_max_length[col]) {
          xclass = ' smaller';
        }

        vals = value.split('|', 2);
        if (row == 0 && isHeader) {
          html += vals.length == 2
            ? tplXCol2
                .replace('{{content1}}', vals[0])
                .replace('{{content2}}', vals[1])
            : tplXCol.replace('{{content}}', vals[0]);
          ++row;
        } else {
          // html += tpl
          //   .replace('{{value}}', vals[0])
          //   .replace('{{xclass}}', xclass);
          // try to link to targets
          if (targets && targets[value]) {
            html += tplTargets
              .replace('{{data}}', vals[0])
              .replace('{{value}}', vals[0])
              .replace('{{xclass}}', xclass);

          // usual cell
          } else {
            html += tpl
              .replace('{{value}}', vals[0])
              .replace('{{xclass}}', xclass);
          }
        }
      }
    }

    return tplColStart + html + tplColEnd;
  },

  _createRightColumn: function(config, col, data, diary, targets) {
    return this._createLeftColumn(config, col, data, diary, targets);
  },

  _createHeader: function(caption) {
    return "<div class=\"caption\">{{title}}</div>"
      .replace('{{title}}', this._nbsp(caption));
  },

  // #region old
  // /**
  //  * Creates the view of a column.
  //  * @param {integer} col The index of the column.
  //  * @param {JSON} data The loaded data.
  //  * @param {JSON} diary The loaded diary or null.
  //  * @param {string} targets The loaded targets or null.
  //  * @return {string} The html view.
  //  */
  // _createColumn: function(col, data, diary, targets) {
  //   var html,
  //       result,
  //       attribs = '',
  //       colStart = '<div class="column c{{index}}"{{attribs}}>',
  //       colEnd = '</div>';
  //
  //   switch(col) {
  //     case 1:
  //     case 5:
  //       html = this._createCol15(data, targets);
  //       break;
  //     case 2:
  //       html = this._createCol2(data, '&sum;', 0);
  //       break;
  //     case 3:
  //       html = this._createCol3(data, '%', 1);
  //       break;
  //     case 4:
  //       result = this._createColData(data, diary);
  //       html = result.html;
  //       attribs = ' style="' + result.style + '"';
  //       break;
  //
  //     default:
  //       throw new Error('Invalid column to create: ' + col + '!');
  //   }
  //   return colStart
  //     .replace('{{index}}', col)
  //     .replace('{{attribs}}', attribs)
  //     + html + colEnd;
  // },
  // _createCol15: function(data, targets) {
  //   var html = '<div class="x2">&nbsp;</div>',
  //       tpl = '<div class="x1{{xclass}}">{{name}}</div>',
  //       tplTargets = '<div class="x1 link_target{{xclass}}" data-target="{{data}}">{{name}}</div>',
  //       name, xclass;
  //
  //   for (var i = 0; i < data.lineheader.length; ++i) {
  //     name = data.lineheader[i];
  //     xclass = i == data.lineheader.length - 2 ? ' ul' : '';
  //     if (targets && targets[name]) {
  //       html += tplTargets
  //         .replace('{{data}}', name)
  //         .replace('{{name}}', this._nbsp(name))
  //         .replace('{{xclass}}', xclass);
  //     } else {
  //       html += tpl
  //         .replace('{{name}}', this._nbsp(name))
  //         .replace('{{xclass}}', xclass);
  //     }
  //   }
  //
  //   return html;
  // },
  // _createCol2: function(data, info, index) {
  //   var html = '<div class="x2">' + info + '</div>', // &sum; %
  //       tpl = '<div class="x1{{xclass}}">{{value}}</div>',
  //       xclass;
  //
  //   for (var i = 0; i < data.data.length; ++i) {
  //     xclass = i == data.data.length - 2 ? ' ul' : '';
  //     html += tpl
  //       .replace('{{value}}', data.data[i][index])
  //       .replace('{{xclass}}', xclass);
  //   }
  //
  //   return html;
  // },
  // _createCol3: function(data, info, index) {
  //   var html = '<div class="x2">' + info + '&nbsp;</div>', // &sum; %
  //       tpl = '<div class="x1{{xclass}}">&nbsp;{{value}}&nbsp;</div>',
  //       xclass;
  //
  //   for (var i = 0; i < data.data.length; ++i) {
  //     xclass = i == data.data.length - 2 ? ' ul' : '';
  //     html += tpl
  //       .replace('{{value}}', data.data[i][index])
  //       .replace('{{xclass}}', xclass);
  //   }
  //
  //   return html;
  // },
  // #endregion

  _addXCol: function(data, targets, index) {
    // var html = '<div class="x2">' + data.header1[index] + '</div>',
    var html = '',
        tplXCol = '<div class="x2">{{content}}</div>',
        tplXCol2 = '<div class="x2 x2b">{{content1}}<div>{{content2}}</div></div>',
        tpl = '<div class="x1{{xclass}}">{{value}}</div>',
        tplTargets = '<div class="x1 link_target{{xclass}}" data-target="{{data}}">{{value}}</div>',
        // tplColStart = '<div class="column c{{index}}"{{attribs}}>',
        tplColStart = '<div class="column xcolumn">',
        tplColEnd = '</div>',
        value, xclass, parts;

    // header 1 - special handling for pipe
    if (data.header1[index].indexOf('|') > -1) {
      parts = data.header1[index].split('|', 2);
      html = tplXCol2
          .replace('{{content1}}', parts[0])
          .replace('{{content2}}', parts[1]);
    } else {
      html = tplXCol.replace('{{content}}', data.header1[index]);
    }

    // handle each row
    for (var row = 0; row < data.data.length; ++row) {
      value = data.data[row][index];
      // ul before and in sum line
      xclass = row >= data.data.length - 2 ? ' ul' : '';

      // try to link to targets
      if (targets && targets[value]) {
        html += tplTargets
          .replace('{{data}}', value)
          .replace('{{value}}', value)
          .replace('{{xclass}}', xclass);

      // usual cell
      } else {
        html += tpl
          .replace('{{value}}', value)
          .replace('{{xclass}}', xclass);
      }
    }

    return tplColStart + html + tplColEnd;
  },

  /**
   * Creates the view of a data column.
   * @param {JSON} data The loaded data.
   * @param {JSON} diary The loaded diary or null.
   * @return {string} The html view.
   */
  _addDataCol: function(data, diary, start, end) {
    var html = '',
      tplRow = '<div class="x1">{{content}}</div>',
      tplCol = '<div{{xclass2}}>{{content}}</div>',
      tplColDiary = '<div class="link_diary{{xclass1}}" data-diary="{{data}}">{{content}}</div>',
      tplCol2 = '<div class="colspan2{{xclass1}}">{{content}}</div>',
      attribs = '',
      tplColStart = '<div class="column xdata xdata{{index}}"{{attribs}}>'
          .replace('{{index}}', start),
      tplColEnd = '</div>';

    for (var row = -2, r2 = data.data.length; row < r2; ++row) {
      var htmlRow = '',
          src = row === -2 ? data.header1
              : (row === -1 ? data.header2 : data.data[row]),
          lastRow = row == r2 - 1,
          keyDay = '';

      // create a row of the data column
      for (var col = start; col <= end; ++col) {
        var value, xclass1 = '', xclass2 = '', dat, day, isDate, isLongHeader;

        // #region detect weekend, sunday
        dat = new Date(data.headerinfo[col]);
        isDate = isFinite(dat);
        if (isDate) {
          day = dat.getDay();
          // sunday
          if (day == 0) {
            xclass1 = ' we sunday';
          // saturday
          } else if (day == 6) {
            xclass1 = ' we';
          }
        } else {
          // block always are on sunday
          xclass1 = ' we sunday';
          xclass2 = ' class="we sunday"';
        }
        // detect end of header, end of data(last row are sums)
        if (row == -1 || row == r2 - 2) {
          xclass1 += ' ul';
        }
        // create xclass2 from xclass1
        if (xclass1 != '') {
          xclass2 = ' class="' + xclass1 + '"';
        }
        // #endregion

        switch (row) {
          // header 1
          case -2:
            value = src[col] === '' ? '' : this._nbsp(src[col]);
            break;

          // header 2
          case -1:
            keyDay = '';
            if (src[col] === null) {
              value = '';
            } else {
              value = src[col] === '' ? '' : this._nbsp(src[col]);
              // get key of day
              keyDay = data.headerinfo[col];
            }
            break;

          // data (0-n)
          default:
            if (lastRow) {
              value = typeof(src[col]) === 'string' ? src[col] : '';
            } else {
              value = src[col] === '1' && isDate ? '&#x2600;'
                  : (typeof(src[col]) === 'string' ? src[col] : '');
            }
            break;
        }

        // check for double col header
        isLongHeader = false;
        if (row == -1 && col < end) {
          if (value.length > 3) {
            isLongHeader = true;
          } else if (value.length === 3) {
            if (isFinite(value[1]) && isFinite(value[2])) {
              value = value[0]
                  + '<span class="smaller">' + value[1] + value[2] + '</span>';
            } else {
              value = '<span class="smallerblock">' + value + '</span>';
            }
          }
        }

        if (isLongHeader) {
          htmlRow += tplCol2
            .replace('{{content}}', value)
            .replace('{{xclass1}}', xclass1)
            .replace('{{xclass2}}', xclass2);
          ++col;

        // try to connect header with diary
        } else if (row == -1 && diary && diary[keyDay]) {
          htmlRow += tplColDiary
            .replace('{{data}}', keyDay)
            .replace('{{content}}', value)
            .replace('{{xclass1}}', xclass1)
            .replace('{{xclass2}}', xclass2);

        // simple header
        } else {
          htmlRow += tplCol
            .replace('{{content}}', value === '' ? '&nbsp;' : value)
            .replace('{{xclass1}}', xclass1)
            .replace('{{xclass2}}', xclass2);
        }
      }

      html += tplRow.replace('{{content}}', htmlRow);
    }

    //                          header + datarows
    attribs = ' style="height: ' + (6 + 3 * data.data.length) + 'em;"';
    return tplColStart.replace('{{attribs}}', attribs)
        + '<div class="data">' + html + '</div>'
        + tplColEnd;
  },

  _createDataColumn: function(config, start, end, data, diary, targets) {
    var src, html = '', htmlRow, isHeader,
      tplRow = '<div class="x1">{{content}}</div>',
      tplCol = '<div{{xclass2}}>{{content}}</div>',
      tplColDiary = '<div class="link_diary{{xclass1}}" data-diary="{{data}}">{{content}}</div>',
      // tplCol2 = '<div class="colspan2{{xclass1}}">{{content}}</div>',
      attribs = '',
      tplColStart = '<div class="column xdata xdata{{index}}"{{attribs}}>'
          .replace('{{index}}', start),
      tplColEnd = '</div>',
      col,
      row, rows = config.header
        + (data && Array.isArray(data.data) ? data.data.length : 0),
      value, vals, xclasses, keysDays = [];

    for (row = 0; row < rows; ++row) {
      htmlRow = '';
      isHeader = row < config.header;
      src = isHeader ? data['header' + (row + 1)]
          : data.data[row - config.header];

      if (src) {
        // create a row of the data column
        for (col = start; col <= end; ++col) {
          value = src[col];
          if (value === undefined || value === '') {
            value = ' ';
          }
          value = this._nbsp(value);
          vals = value.split('|', 2);

          if (row == 0) {
            keysDays.push(vals.length == 2 ? vals[1] : '')
          }
          xclasses = this._we(keysDays[col - start]);

          // if (row == 0 && isHeader && vals.length == 2 && diary && diary[vals[1]]) {
          if (isHeader && diary && diary[keysDays[col - start]]) {
            htmlRow += tplColDiary
              .replace('{{data}}', keysDays[col - start])
              .replace('{{content}}', vals[0])
              .replace('{{xclass1}}', xclasses[0])
              .replace('{{xclass2}}', xclasses[1]);

          } else {
            htmlRow += tplCol
              .replace('{{content}}', vals[0])
              .replace('{{xclass1}}', xclasses[0])
              .replace('{{xclass2}}', xclasses[1]);
          }
        }
      }

      html += tplRow.replace('{{content}}', htmlRow);
    }


    //                          header + datarows
    // attribs = ' style="height: ' + (6 + 3 * data.data.length) + 'em;"';
    attribs = ' style="height: ' + (3 * rows) + 'em;"';
    return tplColStart.replace('{{attribs}}', attribs)
        + '<div class="data">' + html + '</div>'
        + tplColEnd;
  },

  _we: function(dt) {
    var dat = new Date(dt),
        isDate = isFinite(dat),
        day,
        result = ['', ''];

    if (isDate) {
      day = dat.getDay();
      // sunday
      if (day == 0) {
        result[0] = ' we sunday';
        result[1] = ' class="we sunday"';
      // saturday
      } else if (day == 6) {
        result[0] = ' we';
        result[1] = ' class="we"';
      }
    }

    return result;
  },

  _nbsp: function(txt) {
    if (!txt || !txt.replace) {
      txt = '???';
    }
    return txt.replace(/ /g, '&nbsp;');
  }
}
