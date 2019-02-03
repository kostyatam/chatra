const express = require('express');
const intersectionWith = require('lodash/intersectionWith');
const steamApi = require('./steamApi');

const { API } = require('./consts');

const api = express.Router();

api.use(sendErrorMiddleware);
api.get(API.GET_USER_INFO.PATH, getUserInfoController);
api.get(API.GET_MULTIPLAYER_GAMES.PATH, getMultiplayerGamesController);

function sendErrorMiddleware (req, res, next) {
  res.sendError = function (status, errorMessage) {
    this.status(status).json({
      errorMessage,
    });
    return this;
  };
  next();
}

function getUserInfoController(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.sendError(400, 'Something went wrong');
  }

  steamApi
    .get('/ISteamUser/ResolveVanityURL/v0001', {
      vanityurl: name,
    })
    .then((user) => {
      const { success, steamid } = user;
      if (success === 42) {
        return res.sendError(404, 'User not found');
      }

      if (success === 1) {
        return steamApi
          .get('/ISteamUser/GetPlayerSummaries/v0002', { steamIds: steamid })
          .then(({ players }) => res.json({ player: players[0] }));
      }

      return new Error(res);
    })
    .catch(() => {
      res.sendError(400, 'Something went wrong');
    });
}

function getMultiplayerGamesController(req, res) {
  const { steamIds } = req.query;

  if (!steamIds) {
    return res.sendError(400, 'Something went wrong');
  }

  const requests = steamIds.split(',').map(steamId => steamApi.get('/IPlayerService/GetOwnedGames/v0001', {
    steamId,
    include_appinfo: 1,
  }));

  Promise.all(requests).then((result) => {
    const allPlayersHasGames = result.every(player => player.game_count);

    if (!allPlayersHasGames) {
      return res.sendError(404, 'Common games not found');
    }

    const commonGames = intersectionWith(
      ...result.map(response => response.games),
      (a, b) => a.appid === b.appid,
    );

    if (!commonGames.length) {
      return res.sendError(404, 'Common games not found');
    }

    return steamApi.getAllSteamMultiplayerGames()
      .then((allMultiplayerGames) => {
        const multiplayerGames = commonGames.filter(game => allMultiplayerGames[game.appid]);

        if (!multiplayerGames.length) {
          return res.sendError(404, 'Common games not found');
        }

        return res.json({ games: multiplayerGames });
      });
  })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Something went wrong' });
    });
}

module.exports.api = api;
