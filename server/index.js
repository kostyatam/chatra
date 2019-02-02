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
app.get('/api/getUserInfo', (req, res) => {
  const { name } = req.query;

  if (!name) {
    res.status(500).json({ errorMessage: 'Something went wrong' });
  }

  steamApi
    .get('/ISteamUser/ResolveVanityURL/v0001', {
      vanityurl: name,
    })
    .then((user) => {
      const { success, steamid } = user;
      if (success === 42) {
        return res.status(404).json({
          errorMessage: 'User not found',
        });
      }

      if (success === 1) {
        return steamApi
          .get('/ISteamUser/GetPlayerSummaries/v0002', { steamIds: steamid })
          .then(({ players }) => res.json({ player: players[0] }));
      }

      return new Error(res);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'Something went wrong',
      });
    });
});

app.get('/api/getMultiplayerGames', (req, res) => {
  const { steamIds } = req.query;

  if (!steamIds) {
    res.status(500).json({ errorMessage: 'Something went wrong' });
  }

  const requests = steamIds.split(',').map(steamId => steamApi.get('/IPlayerService/GetOwnedGames/v0001', {
    steamId,
    include_appinfo: 1,
  }));

  Promise.all(requests).then((result) => {
    const allPlayersHasGames = result.every(player => player.games.length);

    if (!allPlayersHasGames) {
      res.status(404).json({ errorMessage: 'Common games not found' });
    }

    const commonGames = intersectionWith(
      ...result.map(response => response.games),
      (a, b) => a.appid === b.appid,
    );

    if (!commonGames.length) {
      res.status(404).json({ errorMessage: 'Common games not found' });
    }

    return getAllSteamMultiplayerGames()
      .then((allMultiplayerGames) => {
        const multiplayerGames = commonGames.filter(game => allMultiplayerGames[game.appid]);

        if (!multiplayerGames.length) {
          res.status(404).json({ errorMessage: 'Common games not found' });
        }

        return res.json({ games: multiplayerGames });
      });
  })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Something went wrong' });
    });
});

app.listen(PORT);
