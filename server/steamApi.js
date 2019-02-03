const url = require('url');
const request = require('request');

const API_URL = 'http://api.steampowered.com';
const API_PRIVATE_KEY = '8738270D3B5D8959A13E1BC255D5702A';

const MS_IN_DAY = 60 * 60 * 24 * 1000;

let multiplayerGames = null;
let lastMultiplayerGamesRequest = null;

class SteamApi {
  get(uri, qs) {
    return new Promise((resolve, reject) => {
      request.get({
        url: url.resolve(API_URL, uri),
        json: true,
        qs: {
          key: API_PRIVATE_KEY,
          ...qs,
        },
      }, (err, res, data) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode !== 200) {
          return reject(res);
        }
        return resolve(data.response);
      });
    });
  }

  getAllSteamMultiplayerGames() {
    const shouldUpdate = lastMultiplayerGamesRequest - Date.now() > MS_IN_DAY;
    if (!multiplayerGames || shouldUpdate) {
      const gamesRequest = new Promise((resolve, reject) => request.get({
        url: 'http://steamspy.com/api.php?request=tag&tag=Multiplayer',
        json: true,
      }, (err, res, games) => {
        if (err) {
          return reject(err);
        }
        return resolve(games);
      })).then((games) => {
        multiplayerGames = gamesRequest;
        lastMultiplayerGamesRequest = Date.now();
        return games;
      });
      return gamesRequest;
    }

    return multiplayerGames;
  }
}

module.exports = new SteamApi();
