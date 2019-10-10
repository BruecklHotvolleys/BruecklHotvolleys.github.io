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

  init: function() {
    var key = bhv.request.utils.getKey(),
        query = '/data/training/' + key + '.json';

    this._getData(query, this.init2.bind(this), function(info) {
      // TODO error handler
    });
  },

  init2: function(rawdata) {
    var html, container,
        data = JSON.parse(rawdata);

    // if any data
    if (data) {

      // create view
      html = this.create(data);
      if (html == '') {
        html = '???';
      }

      // inject html
      container = document.getElementById('content_container');
      if (container) {
        container.innerHTML = html;
      }
    }
  },

  _getData: function(query, onSuccess, onError) {
    var request = new XMLHttpRequest();

    request.overrideMimeType('application/json');
    request.open('GET', query, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        onSuccess(request.responseText);
      }
    };
    request.send();
  },

  create: function(data) {
    return '<div class="training">'
      + this._createHeader(data)
      + this._createColumn(1, data)
      + this._createColumn(2, data)
      + this._createColumn(3, data)
      + this._createColumn(4, data)
      + this._createColumn(5, data)
      + '</div>';
  },

  _createHeader: function(data) {
    return "<div class=\"caption\">{{title}}</div>".replace('{{title}}', this._nbsp(data.name));
  },

  _createColumn: function(col, data) {
    var html,
        result,
        attribs = '',
        colStart = '<div class="column c{{index}}"{{attribs}}>',
        colEnd = '</div>';

    switch(col) {
      case 1:
      case 5:
        html = this._createCol15(data);
        break;
      case 2:
        html = this._createCol23(data, '&sum;', 0);
        break;
      case 3:
        html = this._createCol23(data, '%', 1);
        break;
      case 4:
        result = this._createColData(data);
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
  _createCol15: function(data) {
    var html = '<div class="x2">&nbsp;</div>',
        tpl = '<div class="x1">{{name}}</div>';

    for (var i = 0; i < data.lineheader.length; ++i) {
      html += tpl.replace('{{name}}', this._nbsp(data.lineheader[i]));
    }

    return html;
  },
  _createCol23: function(data, info, index) {
    var html = '<div class="x2">' + info + '</div>', // &sum; %
        tpl = '<div class="x1">{{value}}</div>';

    for (var i = 0; i < data.data.length; ++i) {
      html += tpl.replace('{{value}}', data.data[i][index]); // 0 1
    }

    return html;
  },

  _createColData: function(data) {
    var html = '',
      tplRow = '<div class="x1">{{content}}</div>',
      tplCol = '<div>{{content}}</div>',
      tplCol2 = '<div class="colspan2">{{content}}</div>';

    for (var row = -2, r2 = data.data.length; row < r2; ++row) {
      var htmlRow = '',
          src = row === -2 ? data.header1
            : (row === -1 ? data.header2 : data.data[row]);

      for (var c = row < 0 ? 0 : 2, c2 = src.length; c < c2; ++c) {
        var value;

        switch (row) {
          // header 1
          case -2:
            value = '' + src[c];
            break;
          // header 2
          case -1:
            value = src[c] === null ? '' : src[c];
            break;

          // data (0-n)
          default:
            value = src[c] === 1 ? '&#x2600;' : '';
            break;
        }

        if (row == -1 && value.length > 2 && c < c2 - 1) {
          htmlRow += tplCol2.replace('{{content}}', this._nbsp(value));
          ++c;
        } else {
          htmlRow += tplCol.replace('{{content}}', value === ''
            ? '&nbsp;' : this._nbsp(value));
        }
      }

      html += tplRow.replace('{{content}}', htmlRow);
    }

    return {
      "html": '<div class="data">' + html + '</div>',
      //                 padding + header + datarows
      "style": 'height: ' + (0.4 + 6 + 3 * data.data.length) + 'em;'
    };
  },

  _nbsp: function(txt) {
    if (!txt || !txt.replace) {
      txt = '???';
    }
    return txt.replace(/ /g, '&nbsp;');
  }
}
