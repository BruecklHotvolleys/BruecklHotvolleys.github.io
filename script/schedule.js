var mapLeague = {
  'br4g': [22934, leagueSchedule, 'Termine Unterliga (GD)', 29075],
  'br4': [22934, leagueSchedule, 'Termine Unterliga (FD)', 29075],

  // 'br3g': [22934, leagueSchedule, 'Termine Unterliga (GD)', 28955],
  'br3': [23747, leagueSchedule, 'Termine Landesliga (AR)', 30420],

  'br2': [22933, leagueSchedule, 'Termine Landesliga (GD)', 28951],

  'br1g': [22691, leagueSchedule, 'Termine Bundesliga (GD)', 27423],
  'br1': [23666, leagueSchedule, 'Termine Bundesliga (MR)', 27423]
};

var mapKids = {
  'u10': [23058, kidsSchedule, 'Termine U10', 'brückl'],
  'u11': [23059, kidsSchedule, 'Termine U11', 'brückl'],
  'u12': [23060, kidsSchedule, 'Termine U12', 'brückl'],
  'u13': [23061, kidsSchedule, 'Termine U13', 'brückl'],
  'u15': [23063, kidsSchedule, 'Termine U15', 'brückl']
};

var finals = {
  'u10': "Finale (Do 30.05.2019  Brückl)",
  'u11': "Finale (So 19.05.2019  Brückl)",
  'u12': "Finale (So 07.04.2019  Klagenfurt)",
  'u13': "Finale (Sa 27.04.2019  Wolfsberg)",
  'u15': "Finale (So 05.05.2019  Klagenfurt)",
  'u17': "Finale (So 03.03.2019  Villach)",
  'u19': "Finale (So 27.01.2019  Klagenfurt)"
};
var finals2 = {
  '2019-05-30': {
    'text': 'u10',
    'info': 'u10 Finale: Do 30.05.2019  Brückl'
  },
  '2019-05-19': {
    'text': 'u11',
    'info': 'u11 Finale: So 19.05.2019  Brückl'
  },
  '2019-04-07': {
    'text': 'u12',
    'info': 'u12 Finale: So 07.04.2019  Klagenfurt'
  },
  '2019-04-27': {
    'text': 'u13',
    'info': 'u13 Finale: Sa 27.04.2019  Wolfsberg'
  },
  '2019-05-05': {
    'text': 'u15',
    'info': 'u15 Finale: So 05.05.2019  Klagenfurt'
  },
  '2019-03-03': {
    'text': 'u17',
    'info': 'u17 Finale: So 03.03.2019  Villach'
  },
  '2019-01-27': {
    'text': 'u19',
    'info': 'u19 Finale: So 27.01.2019  Klagenfurt'
  }
};
var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];


/**
 * Starts the loading of the schedule.
 * @return {void}
 */
function getSchedule() {
  var IDX_BEW = 0,
      IDX_TEA = 3,
      IDX_ONSUCCESS = 1,
      key = bhv.request.utils.getKey();

  if (mapLeague && mapLeague[key]) {
    bhv.request.querySchedule(mapLeague[key][IDX_BEW], mapLeague[key][IDX_TEA],
      mapLeague[key][IDX_ONSUCCESS], getScheduleOffline);

  } else if (mapKids && mapKids[key]) {
    bhv.request.queryKidsSchedule(mapKids[key][IDX_BEW],
      mapKids[key][IDX_ONSUCCESS], getScheduleOffline);

  } else {
    bhv.request.utils.inject('Ungültige Termine!');
  }
}

function getAllSchedules(keyEnabled, from, till, callbackLeague) {
  var handlerXDates;

  // query games
  bhv.request.queryMultiSchedules(
    from, till,
    function(response) {

      var i, list, bew, id, work, datKey, day, date, time, spNr, teams, gymn,
          gameRes,
          res = [],
          loaded = [],
          // create xml data
          xml = bhv.request.xml.fromText(response, 'xml');
      if (xml) {

        // get list of dates
        list = bhv.request.xml.getNodes(xml, 'termin');
        if (list && list.length) {

          for (i = 0; i < list.length; ++i) {

            // get id of next game to block if loaded twice
            // (some games might belong to two leagues - mevza some years ago)
            id = bhv.request.xml.findNode(list[i].childNodes, 'spi_id');
            if (loaded.indexOf(id) === -1) {
              loaded.push(id);

              datKey = bhv.request.xml.findNode(list[i].childNodes, 'spi_datum');
              if (datKey && datKey.length >= 10) {
                work = datKey.substr(0, 10)
                  // .replace('2015', '2019')
                  .split('.');
                datKey = '' + work[2] + work[1] + work[0];

                bew = bhv.request.xml.findNode(list[i].childNodes, 'bew_kurz');

                spNr = bhv.request.xml.findNode(list[i].childNodes, 'spi_nummer');
                day = days[bhv.request.xml.findNode(list[i].childNodes, 'tag')];
                date = bhv.request.xml.findNode(list[i].childNodes, 'datum');
                time = bhv.request.xml.findNode(list[i].childNodes, 'zeit');

                teams = bhv.request.utils.checkBold(
                  bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'))
                  + ' : '
                  + bhv.request.utils.checkBold(
                    bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'));
                gymn = bhv.request.xml.findNode(list[i].childNodes, 'spo_name');

                gameRes = bhv.request.xml.createGameResult(list[i].childNodes);

                res.push({
                  'date': datKey,
                  'enabled': datKey.substr(0, keyEnabled.length) === keyEnabled,
                  'text': bew,
                  'info': spNr + ' ' + day + ' ' + date + ' ' + time + ' '
                    + teams + '  ' + (gameRes ? gameRes : gymn)
                });
              }
            }
          }
        }
      }

      callbackLeague(res);

    }, function(err) {
      console.log('Cannot load data!');
      console.log(err);
    });

  // query kids tournaments
  bhv.request.queryMultiKidsSchedules(
    from, till, 'brückl',
    function(response) {

      // create xml data
      var tournament, tournaments, t, id, work, key, text, info,
          teams0, teams, noTab,
          res = [],
          loaded = [],
          xml = bhv.request.xml.fromText(response, 'xml');
      if (xml) {

        // get list of tournaments
        tournaments = bhv.request.xml.getNodes(xml, 'turniere');
        if (tournaments && tournaments.length) {
          for (t = 0; t < tournaments.length; ++t) {
            tournament = tournaments[t];

            // get id of next tournament to block if loaded twice
            // (some tournaments belong to two leagues - m + f)
            id = bhv.request.xml.findNode(tournament.childNodes, 'id');
            if (loaded.indexOf(id) === -1) {
              loaded.push(id);

              work = bhv.request.xml.findNode(tournament.childNodes, 'von')
                .split('.');
              key = '' + work[2] + work[1] + work[0];

              text = bhv.request.xml.findNode(tournament.childNodes, 'turnier_kurz');
              info = _tournamentInfo(tournament) + NL + NL;

              teams0 = bhv.request.xml.findNode(tournament.childNodes, 'anmerkung');
              if (teams0) {
                noTab = teams0.substr(0, 2) === '0:';
                teams = teams0.split('|');

                for (var tea = 0; tea < teams.length; ++tea) {
                  info += _teamInfo(teams, tea, noTab, 'brückl');
                }
              }

              res.push({
                'date': key,
                'enabled': key.substr(0, keyEnabled.length) === keyEnabled,
                'text': text,
                'info': info
              });
            }
          }
        }

        callbackLeague(res);
      }
    }, function(err) {
      console.log('Cannot load data!');
      console.log(err);
    });

  // query extra dates from github
  handlerXDates = function(data) {
    var dates0, dates, key, keys, i, item,
        res = [];

    if (data) {
      try {
        dates0 = JSON.parse(data);
        if (dates0 && dates0.content) {
          dates = JSON.parse(base64.decode(dates0.content));
          keys = Object.keys(dates);
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key >= from && key <= till) {
              item = dates[key];
              key = key.replace(/-/g, '');
              res.push({
                'date': key,
                'enabled': key.substr(0, keyEnabled.length) === keyEnabled && item.info,
                'text': item.text,
                'info': item.info ? item.info : ''
              });
            }
          }
        }
      } catch (err) {
        log('--------------------------------------------------------------');
        log('Cannot parse x-dates!');
        log(err);
        log('--------------------------------------------------------------');
      }
    }

    callbackLeague(res);
  };

  bhv.request.queryXtraDates(from, till, handlerXDates, function(err) {
    console.log('Cannot load x-dates!');
    console.log(err);
  });
}

/**
 * Injects the stored schedule if offline.
 * @return {void}
 */
function getScheduleOffline() {
  bhv.request.utils.showOffline('schedule');
}

/**
 * Creates the schedule for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsSchedule(response) {
  // create xml data
  var msg = '',
      xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of tournaments
    var tournaments = bhv.request.xml.getNodes(xml, 'turniere');
    if (tournaments && tournaments.length) {
      var key = bhv.request.utils.getKey(),
          pattern = mapKids[key] && mapKids[key][3] ? mapKids[key][3] : '';
      for (var t = 0; t < tournaments.length; ++t) {
        var tournament = tournaments[t],
            teams0 = bhv.request.xml.findNode(tournament.childNodes, 'anmerkung');
        if (teams0
          && (!pattern || teams0.toLowerCase().indexOf(pattern) > -1)) {

          var noTab = teams0.substr(0, 2) === '0:',
              teams = teams0.split('|');

          msg += NL + _tournamentInfo(tournament) + NL;
          for (var tea = 0; tea < teams.length; ++tea) {
            msg += _teamInfo(teams, tea, noTab, pattern);
          }
        }
      }

      // add entry for finals
      if (finals && finals[key]) {
        msg += NL + NL + '<b class="team">' + finals[key] + '</b>' + NL;
      }
    }
  }

  // msg += '<hr>' + JSON.stringify(tournaments, null, 2);
  bhv.request.utils.inject(bhv.request.utils.getTitle(null, mapKids) + msg);
}

function _tournamentInfo(tournament) {
  return '<b class="team">'
    + bhv.request.xml.findNode(tournament.childNodes, 'turnier_kurz')
    + ' ('
    + bhv.request.xml.findNode(tournament.childNodes, 'von')
    + ' '
    + bhv.request.xml.findNode(tournament.childNodes, 'bewerb_kurz')
    + '  '
    + bhv.request.xml.findNode(tournament.childNodes, 'bewerb_name')
    + ')</b>';
}

function _teamInfo(teams, tea, noTab, pattern) {
  var parts = teams[tea].split(':'),
      pts = parts.shift(),
      nam = parts.join(':'),
      own = pattern && nam.toLowerCase().indexOf(pattern) > -1;

  if (noTab) {
    // entry list
    return '- '
      + (own ? '<b class="team">' : '')
      + nam
      + (own ? '</b>' : '')
      + NL;
  }

  // standings of tournament
  return (teams.length > 9 && tea < 9 ? '  ' : ' ')
    + (own ? '<b class="team">' : '')
    + (tea + 1) + '. ' + bhv.request.utils.fillColumn(nam, 40)
    + bhv.request.utils.fillColumn(pts, -4)
    + (own ? '</b>' : '')
    + NL;
}

/**
 * Creates the schedule of a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueSchedule(response) {

  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of dates
    var list = bhv.request.xml.getNodes(xml, 'termin');
    if (list && list.length) {

      var L1 = 4,
          L2 = 12,
          L3 = 7,
          LNR = 4,
          L45 = 28,
          fmt = bhv.request.utils.fillColumn;

      // create text
      var msg = NL + fmt('Tag', L1) + fmt('Datum', L2) + fmt('Zeit', L3)
          + fmt('Nr', LNR)
          + fmt('Heim', L45 + 1) + fmt('Gast', L45 + 1) + 'Halle&nbsp;' + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn(days[bhv.request.xml.findNode(list[i].childNodes, 'tag')], L1)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'datum'), L2)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'zeit'), L3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'spi_nummer'), LNR)
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'), L45)) + '&nbsp;'
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'), L45)) + '&nbsp;'
            + bhv.request.xml.findNode(list[i].childNodes, 'spo_name') + '&nbsp;' + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), mapLeague) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, mapLeague) + msg);
    }
  }
}

/**
 * Stores the data for offline access.
 * @param {string} txt The data to display.
 * @return {void}
 */
function _save(txt) {
  // store data for offline reading
  bhv.db.write('schedule:' + bhv.request.utils.getKey(), txt);
}
