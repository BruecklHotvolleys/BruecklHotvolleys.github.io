var activeSeason = '21';
var mapLeague = {
  '21': {
    // liga 26179, team: 33165
    'br1g_21': [26179, leagueResults, 'Ergebnisse (Herbst)', 33165],
    'br1sp_21': [26760, leagueResults, 'Ergebnisse', 33165],
    'br1cup_21': [26176, leagueResults, 'Ergebnisse (Cup)', 33212],
    // LL 26515, 33597
    'br2g_21': [26515, leagueResults, 'Ergebnisse Landesliga', 33597, 1220],
    // UL 26519, 33611
    'br3g_21': [26519, leagueResults, 'Ergebnisse Unterliga', 33611]
    // scorer
    // http://www.volleynet.at/volleynet/service/xml2.php?action=scorer&bew_id=26179&tea_kurz=%27Br%C3%BCckl%27
  },


  '20': {
    // UL 24971 3: 31661, 4: 31662
    'br4g_20': [24971, leagueResults, 'Ergebnisse Unterliga', 31662],
    'br3g_20': [24971, leagueResults, 'Ergebnisse Unterliga', 31661],
    // LLD: Termine/24967, (+optional id(s) of club(s))
    'br2g_20': [24967, leagueResults, 'Ergebnisse Landesliga (GD)', 31654, 1220],
    'br2m_20': [25506, leagueResults, 'Ergebnisse Landesliga (MPO)', 31654, 1220],
    // BL 24649, 1: 30505
    'br1g_20': [24649, leagueResults, 'Ergebnisse Bundesliga', 30505],
  },
  '19': {
    'br4g_19': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 29075],
    'br4_19': [23784, leagueResults, 'Ergebnisse Unterliga (FD)', 29075],

    'br3g_19': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 28955],
    'br3_19': [23747, leagueResults, 'Ergebnisse Landesliga (AR)', 30420],

    'br2g_19': [22933, leagueResults, 'Ergebnisse Landesliga (GD)', 28951],
    'br2m_19': [23746, leagueResults, 'Ergebnisse Landesliga (MPO)', 28951],

    'br1g_19': [22691, leagueResults, 'Ergebnisse Bundesliga (GD)', 27423],
    'br1_19': [23666, leagueResults, 'Ergebnisse Bundesliga (MR)', 27423],

    'u10f_19': [[24376, 24377, 24435, 24436], leagueResults, 'Ergebnisse', [30816, 30817, 30812]],

    'u11f_19': [[24264, 24265, 24266, 24267], leagueResults, 'Ergebnisse', [30775, 30781, 30782, 30776]],
    'u11m_19': [[24270, 24271, 24272], leagueResults, 'Ergebnisse', 30789],

    'u12f_19': [[23917, 23919, 23974, 23975], leagueResults, 'Ergebnisse', [30529, 30534, 30535]],
    'u12m_19': [[23920, 23978], leagueResults, 'Ergebnisse', 30540],
    'u12x_19': [[24177, 24180], leagueResults, 'Ergebnisse', 30652],

    'u13f_19': [[24089, 24090, 24091], leagueResults, 'Ergebnisse', 30683],
    'u13x_19': [[24290, 24291, 24292, 24293, 24294, 24295], leagueResults, 'Ergebnisse', 30753],

    'u15f_19': [[24095, 24097, 24098], leagueResults, 'Ergebnisse', 30672],

    'u17_19': [[24168, 24169], leagueResults, 'Ergebnisse', 30417]
  }
};

var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];

// if to create the archive
if (window.bhv.archive) {
  window.bhv.archive.getResultsMap = function(key) {
    return mapLeague[key];
  }
}


/**
 * Starts the loading of the results.
 * @return {void}
 */
function getResults() {
  var IDX_BEW = 0,
      IDX_TEA = 3,
      IDX_CLUB = 4,
      IDX_ONSUCCESS = 1,
      found = false,
      key = window.bhv.request.utils.getKey();

  if (mapLeague) {
    var keys = Object.keys(mapLeague);
    for (var k = 0; k < keys.length; ++k) {
      var map = mapLeague[keys[k]];
      if (map && map[key]) {
        var idClub = map[key][IDX_CLUB] === undefined ? 21 : map[key][IDX_CLUB];

        if (keys[k] === activeSeason) {
          found = window.bhv.request.queryResults(
            map[key][IDX_BEW], map[key][IDX_TEA], idClub,
            map[key][IDX_ONSUCCESS], getResultsOffline
          );
        } else {
          found = window.bhv.request.queryResultsArchiveGz(
            keys[k], key,
            map[key][IDX_BEW], map[key][IDX_TEA], idClub,
            map[key][IDX_ONSUCCESS], getResultsOffline
          );
        }
      }
    }
  }

  if (!found) {
    window.bhv.request.utils.inject('Ungültige Ergebnisse!');
  }
}

/**
 * Injects the stored results if offline.
 * @return {void}
 */
function getResultsOffline() {
  window.bhv.request.utils.showOffline('results');
}

/**
 * Creates the results of a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueResults(response) {

  // create xml data
  var xml = window.bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of games
    var list = window.bhv.request.xml.getNodes(xml, 'ergebnis');
    if (list && list.length) {

      var L1 = 4,
          L2 = 12,
          L3 = 7,
          L45 = 28,
          fmt = window.bhv.request.utils.fillColumn;

      // create text
      var msg = NL + fmt('Tag', L1) + fmt('Datum', L2) + fmt('Zeit', L3)
          + fmt('Heim', L45 + 1) + fmt('Gast', L45 + 1) + 'Ergebnis&nbsp;' + NL;
      for (var i = 0; i < list.length; ++i) {
        var res = window.bhv.request.xml.createGameResult(list[i].childNodes);

        msg += window.bhv.request.utils.fillColumn(days[window.bhv.request.xml.findNode(list[i].childNodes, 'tag')], L1)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'datum'), L2)
            + window.bhv.request.utils.fillColumn(window.bhv.request.xml.findNode(list[i].childNodes, 'zeit'), L3)
            + window.bhv.request.utils.checkBold(window.bhv.request.utils.fillColumn(
              window.bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'), L45)) + ' '
            + window.bhv.request.utils.checkBold(window.bhv.request.utils.fillColumn(
              window.bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'), L45)) + ' '
            + res + NL;
      }

      // save data for offline mode
      _save(window.bhv.request.utils.getTitle('results', new Date(), mapLeague) + msg);
      // add created text to page
      window.bhv.request.utils.inject(window.bhv.request.utils.getTitle('results', null, mapLeague) + msg);
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
  window.bhv.db.write('results:' + window.bhv.request.utils.getKey(), txt);
}
