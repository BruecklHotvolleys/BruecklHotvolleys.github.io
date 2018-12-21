var map = {
  'u10': [23058, kidsStandings, 'Tabelle U10'],
  'u11': [23059, kidsStandings, 'Tabelle U11'],
  'u12': [23060, kidsStandings, 'Tabelle U12'],
  'u13': [23061, kidsStandings, 'Tabelle U13'],
  'u15': [23063, kidsStandings, 'Tabelle U15'],

  'br4': [22934, leagueStandings, 'Tabelle Unterliga'],
  'br3': [22934, leagueStandings, 'Tabelle Unterliga'],
  'br2': [22933, leagueStandings, 'Tabelle Landesliga'],
  'br1': [22691, leagueStandings, 'Tabelle Bundesliga']
};

/**
 * Creates the standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsStandings(response) {


  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of standings
    var list = bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      // create text
      var msg = bhv.request.utils.fillColumn('', 47)
        + 'P  T '.replace(/ /g, '&nbsp;') + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn('' + (i + 1), -2) + '. '
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
                bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 40))
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3) + '&nbsp;' + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
    }
  }
}

/**
 * Creates the standings for a league.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function leagueStandings(response) {

  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of standings
    // var list = xml.getElementsByTagName('tabelle');
    var list = bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      // create text
      var msg = bhv.request.utils.fillColumn('', 56)
          + 'S/N  Sätze   Punkte'.replace(/ /g, '&nbsp;') + NL
          + bhv.request.utils.fillColumn('', 50)
          + 'Sp.  +  -   +  -    +   -  P '.replace(/ /g, '&nbsp;') + NL;
      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn('' + (i + 1), -2) + '. '
            + bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 45))
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gewonnen'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'verloren'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'satzgewonnen'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'satzverloren'), -3)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punktgewonnen'), -5)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punktverloren'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -3)
            + '&nbsp;' + NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle(new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle(null, map) + msg);
    }
  }
}

function _save(txt) {
  // store data for offline reading
  bhv.db.write('standings:' + bhv.request.utils.getKey(), txt);
}

/**
 * Starts the loading of the standings.
 * @return {void}
 */
function getStandings() {
  var key = bhv.request.utils.getKey();

  if (map && map[key]) {
    bhv.request.queryStandings(map[key][0], map[key][1], getStandingsOffline);
  } else {
    bhv.request.utils.inject('Ungültige Tabelle!');
  }
}

/**
 * Injects the stored standings if offline.
 * @return {void}
 */
function getStandingsOffline() {
  // bhv.request.utils.showOffline('standings');
  bhv.request.utils.inject('Tabelle nicht gefunden!');
}
