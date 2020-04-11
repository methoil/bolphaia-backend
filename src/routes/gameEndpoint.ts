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

interface IGame {
  players: any;
  nextTurn: any;
  board: any;
  player: string; // last to make a move
  updatedSquares: any;
  fallenPieces: any;
}

const games = {};
let lastUpdate = {
  player: null,
  updatedSquares: [],
};

router.post('/', (req, res) => {
  console.log('is this root post hit somehow???');
  const room = req.body.room;
  const phrygianPlayerId = req.body.whitePlayer;
  const hititePlayerId = req.body.blackPlayer;
  const newGame = {
    players: {
      [phrygianPlayerId]: playerIds.phrygians,
      [hititePlayerId]: playerIds.hittites,
    },
    nextTurn: playerIds.phrygians,
    board: generateNewBoard(),
  };

  games[room] = games[room] || newGame;
  chatkit.assignRoomRoleToUser({
    userId: phrygianPlayerId,
    name: 'Player',
    roomId: room,
  });
  chatkit.assignRoomRoleToUser({
    userId: hititePlayerId,
    name: 'Player',
    roomId: room,
  });
  res.send(games[room]);
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

  if (game) {
    const playerSide = game.players[player];

    if (!playerSide) {
      res.status(400).send(`Not a player: ${player}`);
    } else {
      for (let square of req?.body?.updatedSquares ?? []) {
        const pieceMeta = square.piece;
        game.board[square.row][square.col] = pieceMeta;
      }
      game.nextTurn = req?.body?.newTurn ?? game.nextTurn;
      game.fallenPieces = req?.body?.fallenPieces;

      lastUpdate = req.body;
      res.send(req.body);
      pusher.trigger('game-' + room, 'board-updated', {});
    }
  } else {
    // TODO: make a new game here
    res.status(404).send(`Game not found: ${room}`);
  }
});

module.exports = router;
