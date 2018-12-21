var mapLeague = {
  'br4': [22934, leagueResults, 'Ergebnisse Unterliga', 29075],
  'br3': [22934, leagueResults, 'Ergebnisse Unterliga', 28955],
  'br2': [22933, leagueResults, 'Ergebnisse Landesliga', 28951],
  'br1': [22691, leagueResults, 'Ergebnisse Bundesliga', 27423]
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
        var res = '',
            setA = bhv.request.xml.findNode(list[i].childNodes, 'spi_saetze_a'),
            setB = bhv.request.xml.findNode(list[i].childNodes, 'spi_saetze_b'),
            ptA = [
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz1_a'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz2_a'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz3_a'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz4_a'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz5_a')
            ],
            ptB = [
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz1_b'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz2_b'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz3_b'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz4_b'),
              bhv.request.xml.findNode(list[i].childNodes, 'spi_punkte_satz5_b')
            ];
        if (!isNaN(setA) && !isNaN(setB)) {
          var setAa = parseInt(setA),
              setBb = parseInt(setB),
              sets = setAa + setBb;
          if (sets > 0) {
            res = setA + ':' + setB + '&nbsp;(';
            for (var s = 0; s < sets; ++s) {
              if (s > 0) {
                res += ',&nbsp;';
              }
              res += ptA[s] + ':' + ptB[s];
            }
            res += ')&nbsp;';
          }
        }

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
