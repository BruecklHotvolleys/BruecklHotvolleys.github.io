var mapLeague = {
  'br4g': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 29075],
  'br4': [23784, leagueResults, 'Ergebnisse Unterliga (FD)', 29075],

  'br3g': [22934, leagueResults, 'Ergebnisse Unterliga (GD)', 28955],
  'br3': [23747, leagueResults, 'Ergebnisse Landesliga (AR)', 30420],

  'br2g': [22933, leagueResults, 'Ergebnisse Landesliga (GD)', 28951],
  'br2m': [23746, leagueResults, 'Ergebnisse Landesliga (MPO)', 28951],

  'br1g': [22691, leagueResults, 'Ergebnisse Bundesliga (GD)', 27423],
  'br1': [23666, leagueResults, 'Ergebnisse Bundesliga (MR)', 27423],

  'u10f': [[24376, 24377, 24435, 24436], leagueResults, 'Ergebnisse', [30816, 30817, 30812]],

  'u11f': [[24264, 24265, 24266, 24267], leagueResults, 'Ergebnisse', [30775, 30781, 30782, 30776]],
  'u11m': [[24270, 24271, 24272], leagueResults, 'Ergebnisse', 30789],

  'u12f': [[23917, 23919, 23974, 23975], leagueResults, 'Ergebnisse', [30529, 30534, 30535]],
  'u12m': [[23920, 23978], leagueResults, 'Ergebnisse', 30540],
  'u12x': [[24177, 24180], leagueResults, 'Ergebnisse', 30652],

  'u13f': [[24089, 24090, 24091], leagueResults, 'Ergebnisse', 30683],
  'u13x': [[24290, 24291, 24292, 24293, 24294, 24295], leagueResults, 'Ergebnisse', 30753],

  'u15f': [[24095, 24097, 24098], leagueResults, 'Ergebnisse', 30672]
};

var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];


/**
 * Starts the loading of the results.
 * @return {void}
 */
function getResults() {
  var IDX_BEW = 0,
      IDX_TEA = 3,
      IDX_ONSUCCESS = 1,
      key = bhv.request.utils.getKey();

  if (mapLeague && mapLeague[key]) {
    bhv.request.queryResults(mapLeague[key][IDX_BEW], mapLeague[key][IDX_TEA],
      mapLeague[key][IDX_ONSUCCESS], getResultsOffline);

  } else {
    bhv.request.utils.inject('Ungültige Ergebnisse!');
  }
}

/**
 * Injects the stored results if offline.
 * @return {void}
 */
function getResultsOffline() {
  bhv.request.utils.showOffline('results');
}

/**
 * Creates the results of a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueResults(response) {

  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of games
    var list = bhv.request.xml.getNodes(xml, 'ergebnis');
    if (list && list.length) {

      var L1 = 4,
          L2 = 12,
          L3 = 7,
          L45 = 28,
          fmt = bhv.request.utils.fillColumn;

      // create text
      var msg = NL + fmt('Tag', L1) + fmt('Datum', L2) + fmt('Zeit', L3)
          + fmt('Heim', L45 + 1) + fmt('Gast', L45 + 1) + 'Ergebnis&nbsp;' + NL;
      for (var i = 0; i < list.length; ++i) {
        var res = bhv.request.xml.createGameResult(list[i].childNodes);

        msg += bhv.request.utils.fillColumn(days[bhv.request.xml.findNode(list[i].childNodes, 'tag')], L1)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'datum'), L2)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'zeit'), L3)
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'heimteamname'), L45)) + ' '
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'gastteamname'), L45)) + ' '
            + res + NL;
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
  bhv.db.write('results:' + bhv.request.utils.getKey(), txt);
}
