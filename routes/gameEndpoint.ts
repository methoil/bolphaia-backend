// import { playerIds } = require('../models/pieceMeta.model');
import { generateNewBoard } from '../models/boardSetup';

var _ = require('lodash/core');
var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var chatkit = require('./chatkit');

var pusher = new Pusher({
  appId: '941125',
  key: '6e48a6609db3a8a6b150',
  secret: 'fb33e58cef4d8e9e574c',
  cluster: 'mt1',
  encrypted: true,
});

// TODO: import these...
enum playerIds {
  phrygians = 'phrygians',
  hittites = 'hittites',
}

const games = {};
let lastUpdate = {
  player: null,
  updatedSquares: [],
};

router.post('/', (req, res) => {
  const room = req.body.room;
  const phrygianPlayerId = req.body.whitePlayer;
  const hititePlayerId = req.body.blackPlayer;
  const newGame = {
    players: {
      [phrygianPlayerId]: playerIds.phrygians,
      [hititePlayerId]: playerIds.hittites,
    },
    board: generateNewBoard(),
  };

  games[room] = newGame;
  chatkit
    .assignRoomRoleToUser({
      userId: phrygianPlayerId,
      name: 'Player',
      roomId: room,
    })
    .then(res => {
      console.log('success');
      console.log(res);
    })
    .catch(err => {
      console.log('no role :(');
      console.log(err);
    });
  chatkit.assignRoomRoleToUser({
    userId: hititePlayerId,
    name: 'Player',
    roomId: room,
  });
  res.send(newGame);
});

router.get('/:room', (req, res) => {
  const room = req.params.room;
  const game = games[room];
  if (game) {
    game.player = lastUpdate?.player;
    game.updatedSquares = lastUpdate?.updatedSquares;
    res.send(game);
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

router.post('/:room', (req, res) => {
  const room = req.params.room;
  const player = req.body.player;
  const game = games[room];

  const fromRow = req?.body?.updatedSquares?.[0].row;
  const fromColumn = req?.body?.updatedSquares?.[0].col;
  const fromPiece = req?.body?.updatedSquares?.[0].piece;

  const toRow = req?.body?.updatedSquares?.[1].row;
  const toColumn = req?.body?.updatedSquares?.[1].col;
  const toPiece = req?.body?.updatedSquares?.[1].toColumn;

  if (game) {
    const piece = game.board[fromRow][fromColumn];
    const playerSide = game.players[player];

    if (!playerSide) {
      res.status(400).send(`Not a player: ${player}`);
      // can't rely on bc of damage but not killed
      // } else if (playerSide !== fromPiece.player) {
      //   res.status(400).send(`Not your piece. Player=${playerSide}, Piece=${piece}`);
    } else {
      game.board[fromRow][fromColumn] = fromPiece;
      game.board[toRow][toColumn] = toPiece;

      // just resend the data, client will ignore if it's their move
      // no need to resend the whole board - maybe when/if there's more validation?
      lastUpdate = req.body;
      res.send(req.body);
      pusher.trigger('game-' + room, 'board-updated', {});
    }
  } else {
    res.status(404).send(`Game not found: ${room}`);
  }
});

module.exports = router;
