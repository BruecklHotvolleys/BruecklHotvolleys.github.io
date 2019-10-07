var activeSeason = '20';
var map = {
  '20': {
    'br4g_20': [24971, leagueStandings, 'Tabelle Unterliga'],
    'br3g_20': [24971, leagueStandings, 'Tabelle Unterliga'],
    'br2g_20': [24967, leagueStandings, 'Tabelle Landesliga'],
    'br1g_20': [24649, leagueStandings, 'Tabelle Bundesliga']
  },
  '19': {
    'br4g_19': [22934, leagueStandings, 'Tabelle Unterliga (GD)'],
    'br4_19': [23784, leagueStandings, 'Tabelle Unterliga (FD)'],

    'br3g_19': [22934, leagueStandings, 'Tabelle Unterliga (GD)'],
    'br3_19': [23747, leagueStandings, 'Tabelle Landesliga (AR)'],

    'br2g_19': [22933, leagueStandings, 'Tabelle Landesliga (GD)'],

    'br1g_19': [22691, leagueStandings, 'Tabelle Bundesliga (GD)'],
    'br1_19': [23666, leagueStandings, 'Tabelle Bundesliga (MR)'],


    'u10_19': [23058, kidsStandings, 'Tabelle U10 (Qualifikation)'],
    'u10f_19': [24437, kidsStandingsF, 'Endstand U10'],

    'u11_19': [23059, kidsStandings, 'Tabelle U11 (Qualifikation)'],
    'u11f_19': [24268, kidsStandingsF, 'Endstand U11 (weiblich)'],
    'u11m_19': [24273, kidsStandingsF, 'Endstand U11 (männlich)'],

    'u12x_19': [23283, kidsStandingsF, 'Endstand U12 (ÖMS)'],
    'u12f_19': [23976, kidsStandingsF, 'Endstand U12 (weiblich)'],
    'u12m_19': [23977, kidsStandingsF, 'Endstand U12 (männlich)'],
    'u12q_19': [23060, kidsStandings, 'Tabelle U12 (Qualifikation)'],

    'u13f_19': [24092, kidsStandingsF, 'Endstand U13'],
    'u13_19': [23061, kidsStandings, 'Tabelle U13 (Qualifikation)'],
    'u13x_19': [23281, kidsStandingsF, 'Endstand (ÖMS)'],

    'u15f_19': [24099, kidsStandingsF, 'Endstand U15'],
    'u15_19': [23063, kidsStandings, 'Tabelle U15 (Qualifikation)'],

    'u17_19': [23787, kidsStandingsF, 'Endstand U17']
  }
};

// if to create the archive
if (window.bhv.archive) {
  window.bhv.archive.getStandingsMap = function(key) {
    return map[key];
  }
}

/**
 * Creates the standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsStandings(response) {
  doKidsStandings(response, false);
}

/**
 * Creates the final standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @return {void}
 */
function kidsStandingsF(response) {
  doKidsStandings(response, true);
}

/**
 * Creates the standings for a junior chamionship.
 * @param {string} reponse The response from the web service.
 * @param {boolean} final True for the final standings, otherwise false.
 * @return {void}
 */
function doKidsStandings(response, final) {

  // create xml data
  var xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {

    // get list of standings
    var list = bhv.request.xml.getNodes(xml, 'tabelle');
    if (list && list.length) {

      var container
        = '<div class="container" title="{{text2}}" alt="{{text2}}">'
        + '<input id="info_{{idx}}" type="checkbox" class="info">'
        + '<label for="info_{{idx}}">{{text}}<span>{{text2}}</span></label>'
        + '</div>',
          points = container
            .replace(/\{\{idx\}\}/g, 'pt')
            .replace(/\{\{text\}\}/g, 'P')
            .replace(/\{\{text2\}\}/g, 'Punkte'),
          tournaments = container
            .replace(/\{\{idx\}\}/g, 'tour')
            .replace(/\{\{text\}\}/g, 'T')
            .replace(/\{\{text2\}\}/g, 'gespielte Turniere');

      // create text
      var msg = bhv.request.utils.fillColumn('', 47)
        .replace(/ /g, '&nbsp;');
      if (!final) {
        msg += points + '&nbsp;&nbsp;&nbsp;' + tournaments;
      }
      msg += NL;

      for (var i = 0; i < list.length; ++i) {
        msg += bhv.request.utils.fillColumn('' + (i + 1), -2) + '. ';
        if (final) {
          msg += bhv.request.utils.checkBold(bhv.request.xml.findNode(list[i].childNodes, 'tea_name'));
        } else {
          msg += bhv.request.utils.checkBold(bhv.request.utils.fillColumn(
              bhv.request.xml.findNode(list[i].childNodes, 'tea_name'), 40))
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'punkte'), -4)
            + bhv.request.utils.fillColumn(bhv.request.xml.findNode(list[i].childNodes, 'gespielt'), -3)
            + '&nbsp;';
        }
        msg += NL;
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle('standings', new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle('standings', null, map) + msg);
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
      _save(bhv.request.utils.getTitle('standings', new Date(), map) + msg);
      // add created text to page
      bhv.request.utils.inject(bhv.request.utils.getTitle('standings', null, map) + msg);
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
  var found = false,
      key = bhv.request.utils.getKey();

  if (map) {
    var keys = Object.keys(map);
    for (var k = 0; k < keys.length; ++k) {
      var mm = map[keys[k]];
      if (mm && mm[key]) {
        if (keys[k] === activeSeason) {
          found = bhv.request.queryStandings(
            mm[key][0], mm[key][1],
            getStandingsOffline
          );
        } else {
          found = bhv.request.queryStandingsArchiveGz(
            keys[k], key,
            mm[key][1], getStandingsOffline
          );
        }
      }
    }
  }

  if (!found) {
    bhv.request.utils.inject('Ungültige Tabelle!');
  }
}

/**
 * Injects the stored standings if offline.
 * @return {void}
 */
function getStandingsOffline(x1, x2, x3, x4) {
  // bhv.request.utils.showOffline('standings');
  bhv.request.utils.inject('Tabelle nicht gefunden!');
}
