const express = require('express');
const url = require('url');
const request = require('request');

const intersectionWith = require('lodash/intersectionWith');

const PORT = 4040;
const API_URL = 'http://api.steampowered.com';
const API_PRIVATE_KEY = '8738270D3B5D8959A13E1BC255D5702A';

const getAllSteamMultiplayerGames = () => new Promise((resolve, reject) => request.get({
  url: 'http://steamspy.com/api.php?request=tag&tag=Multiplayer',
  json: true,
}, (err, res, games) => {
  if (err) {
    return reject(err);
  }
  return resolve(games);
}));

const steamApi = {
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
  },
};

const app = express();
app.get('/api/getUserInfo', (req, res, next) => {
  const { name } = req.query;
  // add if !name Error
  steamApi
    .get('/ISteamUser/ResolveVanityURL/v0001', {
      vanityurl: name,
    })
    .then((user) => {
      const { success, steamid } = user;
      if (success === 42) {
        return res.status(404).end();
      }

      if (success === 1) {
        return steamApi
          .get('/ISteamUser/GetPlayerSummaries/v0002', { steamIds: steamid })
          .then(players => res.json(players));
      }

      return new Error(res);
    })
    .catch(next);
});

app.get('/api/getMultiplayerGames', (req, res, next) => {
  const { steamIds } = req.query;
  const requests = steamIds.split(',').map(steamId => steamApi.get('/IPlayerService/GetOwnedGames/v0001', {
    steamId,
    include_appinfo: 1,
  }));

  Promise.all(requests).then((result) => {
    const games = intersectionWith(
      ...result.map(response => response.games),
      (a, b) => a.appid === b.appid,
    );
    return getAllSteamMultiplayerGames()
      .then(multiplayerGames => games.filter(game => multiplayerGames[game.appid]));
  })
    .then(games => res.json({ games }))
    .catch(next);
});

app.listen(PORT);
