// #region -- Calendar. -------------------------------------------------------

var calendar = {

  // #region -- The fields. ---------------------------------------------------

  '_document': null,
  '_tplHeader': '',
  '_tplContent': '',
  '_tplWeek': '',
  '_tplDay': '',
  '_tplEntry': '',
  '_tplEntryInfo': '',
  '_nextId': -99,
  '_year': 0,
  '_month': 0,
  '_today': -999,

  // #endregion -- The fields. ------------------------------------------------

  // #region -- Init and create calendar. -------------------------------------

  'init': function(document) {
    var dat = new Date();

    this._document = document;
    this._loadTemplates();

    this.show(DateUtil.datToYM(dat));
  },

  'show': function(key) {
    this._nextId = 0;
    this._initDate(key);
    XDays.init(this._year);

    this._injectHtml('header', this._createHeader());
    this._inject('footer', 'tplFooter');
    this._injectHtml('content_container', this._createContent());
    // load games and tournaments asynchronously
    this._loadDates();

    // initialize event handling
    setTimeout(this._initEvents.bind(this), 100);
  },
  '_initDate': function(key) {
    var dat;

    this._year = parseInt(key.substr(0, 4));
    this._month = parseInt(key.substr(4, 2)) - 1;

    if (isNaN(this._year) || isNaN(this._month)
      || this._year <= 0 || this._year > 9999
      || this._month < 0 || this._month > 11) {

      dat = new Date();
      this._year = dat.getFullYear();
      this._month = dat.getMonth();
    }
  },
  '_initEvents': function() {
    var i,
        elemsNav = this._document.querySelectorAll('#header .nav'),

        handlerNav = function(ev) {
          var key = ev.currentTarget.getAttribute('data-dir');
          this.show(key);
        };

    if (elemsNav) {
      handlerNav = handlerNav.bind(this);
      for (i = 0; i < elemsNav.length; ++i) {
        elemsNav[i].addEventListener('click', handlerNav);
      }
    }

    this._initDatesInfo();
  },
  '_initDatesInfo': function() {
    var i,
        elemMain = this._document.querySelector('#content_container > .main'),
        elems = this._document.querySelectorAll('#content_container > .main > .week > .day.enabled > div > .entry.enabled'),
        elemsInfo = this._document.querySelectorAll('#content_container > .entryInfo'),
        handler = function(ev) {
          var elem = ev.currentTarget,
              id = elem.getAttribute('data-xid'),
              info = this._document.getElementById(id);

          elemMain.style.display = 'none';
          info.style.display = 'block';
        },
        handlerHide = function(ev) {
          var elem = ev.currentTarget,
              id = elem.id,
              elemDayEntry = elemMain.querySelector(`.week > .day > .entry[data-xid=${id}]`);

          elem.style.display = 'none';
          elemMain.style.display = 'block';
          if (elemDayEntry !== null) {
            var elemDay = elemDayEntry.parentNode;
            if (elemDay !== null) {
              elemDay.scrollIntoView();
            }
          }
        };

    if (elems && elemsInfo) {
      handler = handler.bind(this);
      for (i = 0; i < elems.length; ++i) {
        elems[i].addEventListener('click', handler);
      }
      for (i = 0; i < elemsInfo.length; ++i) {
        elemsInfo[i].addEventListener('click', handlerHide);
      }
    }
  },


  '_loadTemplates': function() {
    this._tplHeader = this._loadTemplate('tplHeader');
    this._tplContent = this._loadTemplate('tplContent');
    this._tplWeek = this._loadTemplate('tplWeek');
    this._tplDay = this._loadTemplate('tplDay');
    this._tplEntry = this._loadTemplate('tplEntry');
    this._tplEntryInfo = this._loadTemplate('tplEntryInfo');
  },

  // #endregion -- Init and create calendar. ----------------------------------

  // #region -- Create the header. --------------------------------------------

  '_createHeader': function() {
    var dat2,
        k1, k2, k3, k4;

    dat2 = new Date(this._year - 1, this._month, 1);
    k1 = DateUtil.datToYM(dat2);
    dat2 = new Date(this._year, this._month - 1, 1);
    k2 = DateUtil.datToYM(dat2);
    dat2 = new Date(this._year, this._month + 1, 1);
    k3 = DateUtil.datToYM(dat2);
    dat2 = new Date(this._year + 1, this._month, 1);
    k4 = DateUtil.datToYM(dat2);

    return this._tplHeader.trim()
      .replace('{{month}}', XDays.monthNames[this._month])
      .replace('{{year}}', this._year)
      .replace('{{dir-12}}', k1)
      .replace('{{dir-1}}', k2)
      .replace('{{dir+1}}', k3)
      .replace('{{dir+12}}', k4);
  },

  // #endregion -- Create the header. -----------------------------------------

  // #region -- Create the content. -------------------------------------------

  '_createContent': function() {
    var d, weekRes,
        content = '',
        infos = '',
        days = this._loadData(),
        today0 = new Date(),
        today = DateUtil.toYMD(today0.getFullYear(), today0.getMonth() + 1, today0.getDate());

    // create the days
    for (d = 0; d < days.length; d += 7) {
      weekRes = this._createWeek(d, days, today);
      content += weekRes.content;
      infos  += weekRes.infos;
    }

    // return result
    return this._tplContent.trim()
      .replace('{{weeks}}', content)
      .replace('{{infos}}', infos);
  },

  '_createWeek': function(day, days, today) {
    var d, dayRes,
        content = '',
        infos = '';

    for (d = day; d < day + 7; ++d) {
      dayRes = this._createDay(d, days, today);
      content += dayRes.content;
      infos += dayRes.infos;
    }

    // inject days into week and return result
    return {
      'content': this._tplWeek.trim().replace('{{days}}', content),
      'infos': infos
    };
  },

  '_createDay': function(day, days, today) {

    var entries = this._createEntries(days[day]);

    // inject data into template and return result
    return {
      'content': this._tplDay.trim()
        .replace('{{key}}', days[day].key)
        .replace('{{enabled}}', days[day].enabled ? ' enabled' : '')
        .replace('{{today}}', days[day].key === today ? ' today' : '')
        .replace('{{date}}', days[day].date)
        .replace('{{entries}}', entries.content),
      'infos': entries.infos
    };
  },

  '_createEntries': function(day) {
    var e, id, enabled,
        content = '',
        infos = '';

    for (e = 0; e < day.entries.length; ++e) {
      enabled = day.enabled && day.entries[e].enabled;
      id = enabled ? this._createId('info') : '';

      content += this._tplEntry.trim()
        .replace('{{enabled}}', enabled ? ' enabled' : '')
        .replace('{{xid}}', enabled ? ' data-xid="' + id + '"' : '')
        .replace('{{text}}', day.entries[e].text);
      if (enabled) {
        infos += this._tplEntryInfo.trim()
          .replace('{{id}}', id)
          .replace('{{info}}', day.entries[e].info);
      }
    }

    return {
      'content': content,
      'infos': infos
    };
  },

  // #endregion -- Create the content. ----------------------------------------

  // #region -- Load the data. ------------------------------------------------

  /**
   * Loads the dates asynchronously from xml service (kvv2).
   * @return {void}
   */
  '_loadDates': function() {

    // check for dates of games
    var dat1 = new Date(this._year, this._month, -7),
        dat2 = new Date(this._year, this._month + 1, 7),
        keyEnabled = DateUtil.toYM(this._year, this._month),

        handlerL = function(data) {
          var i, j, item, found, keys,
              id, elemDay, elemContent, items, tpl, tpl2, enabled,
              buf = {};

          if (data && data.length) {

            // consolidate data - prepare for printing
            for (i = 0; i < data.length; ++i) {
              item = data[i];
              if (!buf[item.date]) {
                buf[item.date] = [];
              }

              found = false;
              for (j = 0; j < buf[item.date].length; ++j) {
                if (buf[item.date][j].text == item.text) {
                  buf[item.date][j].info += '\n\n' + item.info;
                  found = true;
                }
              }
              if (!found) {
                buf[item.date].push({
                  'text': item.text,
                  'enabled': true,
                  'info': item.info
                });
              }
            }

            keys = Object.keys(buf);
            for (i = 0; i < keys.length; ++i) {
              elemDay = this._document
                .querySelector('div.day[data-key="' + keys[i] + '"] > div');
              elemContent = this._document.querySelector('#content_container');
              if (elemDay && elemContent) {
                tpl = '';
                tpl2 = '';
                items = buf[keys[i]];
                for (j = 0; j < items.length; ++j) {
                  enabled = items[j].enabled;
                  id = enabled ? this._createId() : '';

                  tpl += this._tplEntry.trim()
                    .replace('{{enabled}}', enabled ? ' enabled' : '')
                    .replace('{{xid}}', enabled ? ' data-xid="' + id + '"' : '')
                    .replace('{{text}}', items[j].text);

                  if (enabled) {
                    tpl2 += this._tplEntryInfo.trim()
                      .replace('{{id}}', id)
                      .replace('{{info}}', items[j].info);
                  }
                }
                if (tpl) {
                  elemDay.innerHTML += tpl;
                }
                if (tpl2) {
                  elemContent.innerHTML += tpl2;
                }
              }
            }

            // initialize
            setTimeout(this._initDatesInfo.bind(this), 100);
          }
        };

    bhv.schedule.getAllSchedules(
      keyEnabled,
      DateUtil.datToY_M_D(dat1), DateUtil.datToY_M_D(dat2),
      handlerL.bind(this)
    );
  },

  /**
   * Loads the xdays.
   * @TODO rename to _loadXDays
   * @return {void}
   */
  '_loadData': function() {
    var i, lastFill,
        dat = new Date(this._year, this._month, 1),
        dat2 = new Date(this._year, this._month + 1, 0),
        wd = dat.getDay(),
        wdL = dat2.getDay(),
        last = dat2.getDate(),
        res = [],
        y, m;

    wd = (wd === 0 ? 7 : wd) - 1;
    // fill first week
    if (wd !== 0) {
      dat2 = new Date(this._year, this._month, 0);
      y = dat2.getFullYear();
      m = dat2.getMonth();
      lastFill = dat2.getDate();
      for (i = lastFill - wd + 1; i <= lastFill; ++i) {
        res.push({
          'date': i,
          'enabled': false,
          'entries': this._loadEntries(y, m, i),
          'key': DateUtil.toYMD(y, m + 1, i)
        });
      }
    }

    // month
    for (i = 1; i <= last; ++i) {
      res.push({
        'date': i,
        'enabled': true,
        'entries': this._loadEntries(this._year, this._month, i),
        'key': DateUtil.toYMD(this._year, this._month + 1, i)
      });
    }

    // fill last week
    wdL = wdL === 0 ? 7 : wdL;
    for (i = 1; i <= 7 - wdL; ++i) {
      y = this._year;
      m = this._month + 1;
      if (m > 11) {
        m = 0;
        ++y;
      }
      res.push({
        'date': i,
        'enabled': false,
        'entries': this._loadEntries(y, m, i),
        'key': DateUtil.toYMD(y, m + 1, i)
      });
    }

    return res;
  },

  '_loadEntries': function(year, month, date) {
    var i, key, xdays,
        res = [];

    // check for raw data entry
    key = DateUtil.toYMD(year, month + 1, date);
    xdays = XDays.get(key);
    if (xdays && xdays.length) {
      for (i = 0; i < xdays.length; ++i) {
        res.push({
          'enabled': false,
          'info': '',
          'text': xdays[i]
        });
      }
    }

    // dummy debug entries
    // for (i = 0; i < date % 6; ++i) {
    //   res.push({
    //     'enabled': (i % 2) === 0 ? true : false,
    //     'text': 'Termin ' + (i + 1),
    //     'info': 'Termin ' + (i + 1) + '\n\n ba ble <b>bli</b> blo blub\n\nLetzte Zeile...'
    //   });
    // }

    return res;
  },

  // #endregion -- Load the data. ---------------------------------------------

  // #region -- Template handling. --------------------------------------------

  '_loadTemplate': function(idTpl) {

    var tpl = '',
        // get template
        elemTpl = this._document.getElementById(idTpl);

    if (elemTpl) {
      tpl = elemTpl.innerHTML;
    }

    return tpl ? tpl : '&nbsp;';
  },

  '_inject': function(idTarget, idTpl) {
    this._injectHtml(idTarget, this._loadTemplate(idTpl));
  },

  '_injectHtml': function(idTarget, tpl) {

    // set target
    var elemTarget = this._document.getElementById(idTarget);
    if (tpl && elemTarget) {
      elemTarget.innerHTML = tpl;
    }
  },

  // #endregion -- Template handling. -----------------------------------------

  // #region -- Utilities. ----------------------------------------------------

  '_createId': function(prefix) {
    return (prefix ? prefix : 'id') + '_' + ++this._nextId;
  }

  // #endregion -- Utilities. -------------------------------------------------
};

// #endregion -- Calendar. ----------------------------------------------------

// #region -- X-Days. ---------------------------------------------------------

var XDays = {
  'year': 0,
  'fixed': {
    '0101': 'Neujahr',
    '0106': 'Heilige Drei Könige',
    '0501': 'Staatsfeiertag',
    '0815': 'Mariä Himmelfahrt',
    '1026': 'Nationalfeiertag',
    '1101': 'Allerheiligen',
    '1208': 'Mariä unbefleckte Empfängnis',
    '1225': 'Christtag',
    '1226': 'Stefanitag'
  },
  'easter': {},
  'monthNames': ['Jänner', 'Feber', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

  'init': function(year) {

    if (this.year === year) {
      return;
    }

    this.easter = {};

    /** calculate easter: https://secure.wikimedia.org/wikipedia/de/wiki/Gaußsche_Osterformel */
    var k, m, s, a, d, r, og, sz, oe, month, day, dat;

    // Säkularzahl: K(X) = X div 100
    k = this._div(year, 100);
    // säkulare Mondschaltung: M(K) = 15 + (3K + 3) div 4 - (8K + 13) div 25
    m = 15 + this._div(3 * k + 3, 4) - this._div(8 * k + 13, 25);
    // säkulare Sonnenschaltung: S(K) = 2 - (3K + 3) div 4
    s = 2 - this._div(3 * k + 3, 4);
    // Mondparameter: A(X) = X mod 19
    a = year % 19;
    // Keim für 1. Vollmond im Frühjahr: D(A, M) = (19A + M) mod 30
    d = (19 * a + m) % 30;
    // kalendarische Korrekturgröße: R(D,A) = D div 29 + (D div 28 - D div 29) (A div 11)
    r = this._div(d, 29) + (this._div(d, 28) - this._div(d, 29)) * this._div(a, 11);
    // Ostergrenze: OG(D,R) = 21 + D - R
    og = 21 + d - r;
    // 1. Sonntag im März: SZ(X,S) = 7 - (X + X div 4 + S) mod 7
    sz = 7 - (year + this._div(year, 4) + s) % 7;
    // Entfernung Ostersonntag bis Ostergrenze in Tagen: OE(OG,SZ) = 7 - (OG - SZ) mod 7
    oe = 7 - (og - sz) % 7;
    // Ostersonntag als Märzdatum (32. M -1. April) OS = OG + OE
    month = 2;
    day = og + oe;
    // set april if necessary
    if (day >= 32) {
      day -= 31;
      ++month;
    }

    // set easter and depending xdays
    dat = new Date(year, month, day);
    this._setXDayEaster(dat, 0, 'Ostersonntag');
    this._setXDayEaster(dat, 1, 'Ostermontag');
    this._setXDayEaster(dat, 39, 'Christi Himmelfahrt');
    this._setXDayEaster(dat, 49, 'Pfingsten');
    this._setXDayEaster(dat, 50, 'Pfingstmontag');
    this._setXDayEaster(dat, 56, 'Dreifaltigkeitssonntag');
    this._setXDayEaster(dat, 60, 'Fronleichnam');

    this.year = year;
  },

  'get': function(key) {
    var i,
        keyX = key.substr(4),
        keysFix = Object.keys(this.fixed),
        keysEas = Object.keys(this.easter),
        res = [];

    // fixed holidays
    for (i = 0; i < keysFix.length; ++i) {
      if (keysFix[i] === keyX) {
        res.push(this.fixed[keyX]);
      }
    }

    // easter depending holidays
    for (i = 0; i < keysEas.length; ++i) {
      if (keysEas[i] === key) {
        res.push(this.easter[key]);
      }
    }

    return res;
  },

  /**
   * Integer division.
   *
   * @param {integer} a The dividend.
   * @param {integer} b The divisor.
   * @return {integer} The result.
   */
  '_div': function(a, b) {
    return parseInt((a / b) + 0.000001);
  },

  '_setXDayEaster': function(dat, offset, name) {
    // create date info
    var xday = new Date(dat.getTime()),
        d, m, key;
    // add offset
    if (offset > 0) {
      xday.setDate(xday.getDate() + offset);
    }

    // this.easter[xday.toISO String().substr(0, 10).replace(/-/g, '')] = name;
    d = xday.getDate();
    m = xday.getMonth() + 1;
    key = xday.getFullYear() + '' + (m < 10 ? '0' : '') + m
      + (d < 10 ? '0' : '') + d;
    this.easter[key] = name;
  }
};

// #endregion -- X-Days. ------------------------------------------------------

// #region -- Date utilities. -------------------------------------------------

/**
 * Date utilities.
 */
var DateUtil = {

  /**
   * To yyyy-mm-dd.
   * @param {Date} dat The date.
   * @return {string} The formatted date.
   */
  'datToY_M_D': function(dat) {
    var d = dat.getDate(),
        m = dat.getMonth() + 1;

    return dat.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-'
      + (d < 10 ? '0' : '') + d;
  },

  /**
   * To yyyymm.
   * @param {Date} dat The date.
   * @return {string} The formatted date used as key.
   */
  'datToYM': function(dat) {
    return this.toYM(dat.getFullYear(), dat.getMonth() + 1);
  },


  /**
   * To yyyymmdd.
   * @param {number} year The year.
   * @param {number} month The month.
   * @param {number} day The day.
   * @return {string} The formatted date used as key.
   */
  'toYMD': function(year, month, day) {
    return this._pad(year, 4) + this._pad(month) + this._pad(day);
  },

  /**
   * To yyyymm.
   * @param {number} year The year.
   * @param {number} month The month.
   * @return {string} The formatted date used as key.
   */
  'toYM': function(year, month) {
    return this._pad(year, 4) + this._pad(month);
  },

  /**
   * Fills a number with leading zeros.
   * @param {mixed} nr The number to fill with leading zeros.
   * @param {number} len The optional length of the resulting string
   * (default 2).
   * @return {string} The padded number.
   */
  '_pad': function(nr, len) {
    var res = '' + nr;

    // default: 2 digits
    if (!len) {
      len = 2;
    }

    while (res.length < len) {
      res = '0' + res;
    }

    return res;
  }
}

// #endregion -- Date utilities. ----------------------------------------------
