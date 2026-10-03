/* global NL */
var mapLeague = {
  // LL
  //       bew_id
  //'res-ll': [37421, leagueResults, 'Landesliga', 46908],  // 25/26
  'res-ll': [39996, leagueResults, 'Landesliga', 50584],
  //'res-blcup': [34267, leagueResults, 'Bundesliga-Cup', 43518],
  // UL-2
  'res-ul2': [40004, leagueResults, 'Unterliga - 2', 50611],
  // UL-3
  'res-ul3': [40003, leagueResults, 'Unterliga - 3', 50649]
  // ?? scorer
  // http://www.volleynet.at/volleynet/service/xml2.php?action=scorer&bew_id=26179&tea_kurz=%27Br%C3%BCckl%27
};

var days = ['?0', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', '?8'];

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

  if (mapLeague && key && mapLeague[key]) {
    found = window.bhv.request.queryResults(
      mapLeague[key][IDX_BEW], mapLeague[key][IDX_TEA],
      mapLeague[key][IDX_CLUB] ? mapLeague[key][IDX_CLUB] : 21,
      mapLeague[key][IDX_ONSUCCESS], logResultsError
    );
  }

  if (!found) {
    window.bhv.request.utils.inject('Ungültige Ergebnisse!');
  }
}

/**
 * Creates the results of a league.
 * @param {string} response The response from the web service.
 * @returns {void}
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
          L45 = 30,
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

      // add created text to page
      window.bhv.request.utils.inject(window.bhv.request.utils.getTitle(mapLeague) + msg);
    }
  }
}

/**
 * Error logging.
 * @param {string} info The optional error info.
 * @returns {void}
 */
function logResultsError(info) {
  log('--------------------------------------------------------------');
  log('Cannot load results!');
  log('---------------------------------------------------------------------');
  if (info) {
    log(info);
    log('---------------------------------------------------------------------');
  }
}
