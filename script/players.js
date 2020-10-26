var activeSeason = '21';

var map = {
  '21': {
    // BL
    'br1g_21': [33165, null, 'Bundesliga'],
    // LL 26515, 33597
    'br2g_21': [33597, null, 'Landesliga'],
    // UL 26519, 33611
    'br3g_21': [33611, null, 'Unterliga']
  },
  '20': {
    // UL      tea_id, -,    title
    'br4g_20': [31662, null, 'Unterliga 4'],
    'br3g_20': [31661, null, 'Unterliga 3'],
    // LLD
    'br2g_20': [31654, null, 'Landesliga'],
    // BL
    'br1g_20': [30505, null, 'Bundesliga'],

    'u12_20': [32221, null, 'Supermini II'],
    'u13_20': [32189, null, 'Supermini'],
    'u13m_20': [32215, null, 'Supermini Burschen'],
    'u14_20': [32168, null, 'Mini'],
    'u14m_20': [32186, null, 'Mini Burschen'],
    'u15_20': [32158, null, 'Midi'],
    'u16_20': [32141, null, 'Schülerinnen'],
    'u20_20': [32117, null, 'Juniorinnen']
  }
}

function getPlayers() {
  var key = window.bhv.request.utils.getKey();

  var keys = Object.keys(map);
  for (var k1 = 0; k1 < keys.length; ++k1) {
    var mm = map[keys[k1]];
    if (mm && mm[key]) {
      if (keys[k1] === activeSeason) {
        window.bhv.request.queryPlayers(
          mm[key][0],
          handlePlayersCur, getPlayersOffline
        );
      } else {
        // TODO
        window.bhv.request.queryPlayersArchiveGz(
          keys[k1], key,
          handlePlayersArchive, onErrorArchive
        );
      }
    }
  }
}

/**
 * Create the html view of the players and inject it into page for current
 * season.
 * @param {string} response The response from volleynet server.
 * @return {void}
 */
function handlePlayersCur(response) {
  _handlePlayers(response, true);
}

/**
 * Create the html view of the players and inject it into page for previous
 * seasons.
 * @param {string} response The response read from archive.
 * @return {void}
 */
function handlePlayersArchive(response) {
  _handlePlayers(response, false);
}

/**
 * Create the html view of the players and inject it into page.
 * @param {string} response The response from volleynet server (or from
 * archive).
 * @param {bool} curSeason True for current season, false for archive mode.
 * @return {void}
 */
function _handlePlayers(response, curSeason) {

  // create xml data
  var msg = '',
      xml = window.bhv.request.xml.fromText(response, 'xml');

  if (xml) {
    // get list of players and staff
    var players = window.bhv.request.xml.getNodes(xml, 'kader');

    if (players && players.length) {
      var xplayer = false, funktion;

      for (var i = 0; i < players.length; ++i) {
        msg += NL;

        funktion = window.bhv.request.xml.findNode(players[i].childNodes,
          'funktion');
        if (funktion !== 'Spieler' && !xplayer) {
          xplayer = true;
          msg += NL;
        }

        msg += window.bhv.request.xml.findNode(players[i].childNodes, 'vorname')
          + ' '
          + window.bhv.request.xml.findNode(players[i].childNodes, 'name');

        // if not player: add info
        if (xplayer) {
          msg += ' (' + funktion + ')';
        }
      }

      // save data for offline mode (only in current season)
      if (curSeason) {
        _save(window.bhv.request.utils.getTitle(
          'players', new Date(), map) + msg);
      }
    }
  }

  // add created text to page
  window.bhv.request.utils.inject(
    window.bhv.request.utils.getTitle('players', null, map) + msg);
}

/**
 * Stores the data for offline access.
 * @param {string} txt The data to display.
 * @return {void}
 */
function _save(txt) {
  // store data for offline reading
  window.bhv.db.write('players:' + window.bhv.request.utils.getKey(), txt);
}

/**
 * Injects the stored players if offline.
 * @return {void}
 */
function getPlayersOffline() {
  window.bhv.request.utils.showOffline('players');
}

function onErrorArchive(info) {
  log('---------------------------------------------------------------------');
  log('Cannot read players from archive!');
  log('---------------------------------------------------------------------');
  log(info);
  log('---------------------------------------------------------------------');
}


// #region -- create archive mode ---------------------------------------------

// if to create the archive
if (window.bhv.archive) {
  window.bhv.archive.getPlayersMap = function(key) {
    return map[key];
  }
}

// #endregion -- create archive mode ------------------------------------------
