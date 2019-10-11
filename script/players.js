// a6335ee9f3a27260e61c90928f8f3ba8

var activeSeason = '20';
var map = {
  '20': {
    // UL 24971 3: 31661, 4: 31662
    'br4g_20': [31662, null, 'Spielerinnen Unterliga 4'],
    'br3g_20': [31661, null, 'Spielerinnen Unterliga 3'],
    // LLD
    'br2g_20': [31654, null, 'Spielerinnen Landesliga'],
    // BL 30505
    'br1g_20': [30505, null, 'Spielerinnen Bundesliga']
  }
}

function getPlayers() {
  var key = bhv.request.utils.getKey();

  var keys = Object.keys(map);
  for (var k1 = 0; k1 < keys.length; ++k1) {
    var mm = map[keys[k1]];
    if (mm && mm[key]) {
      if (keys[k1] === activeSeason) {
        bhv.request.queryPlayers(
          mm[key][0],
          handlePlayers, getPlayersOffline
        );
      } else {
        // TODO
        bhv.request.queryPlayersArchiveGz(
          keys[k1], key,
          handlePlayers, getPlayersOffline
        );
      }
    }
  }
}

function handlePlayers(response) {

  // create xml data
  var msg = '',
      xml = bhv.request.xml.fromText(response, 'xml');
  if (xml) {
    // get list of players
    var players = bhv.request.xml.getNodes(xml, 'kader');
    if (players && players.length) {
      var xplayer = false, funktion;

      for (var i = 0; i < players.length; ++i) {
        msg += NL;

        funktion = bhv.request.xml.findNode(players[i].childNodes, 'funktion');
        if (funktion !== 'Spieler' && !xplayer) {
          xplayer = true;
          msg += NL;
        }

        msg += bhv.request.xml.findNode(players[i].childNodes, 'vorname') + ' '
          + bhv.request.xml.findNode(players[i].childNodes, 'name');

        if (xplayer > 0) {
          msg += ' (' + funktion + ')';
        }
      }

      // save data for offline mode
      _save(bhv.request.utils.getTitle('players', new Date(), map) + msg);
    }
  }

  // add created text to page
  bhv.request.utils.inject(bhv.request.utils.getTitle('players', null, map) + msg);
}

/**
 * Stores the data for offline access.
 * @param {string} txt The data to display.
 * @return {void}
 */
function _save(txt) {
  // store data for offline reading
  bhv.db.write('players:' + bhv.request.utils.getKey(), txt);
}

/**
 * Injects the stored players if offline.
 * @return {void}
 */
function getPlayersOffline() {
  bhv.request.utils.showOffline('players');
}
