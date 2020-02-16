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

interface IGame {
  players: any;
  nextTurn: any;
  board: any;
  player: string; // last to make a move
  updatedSquares: any; // why is this here?
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
  // .then(res => {
  //   console.log('success');
  //   console.log(res);
  // })
  // .catch(err => {
  //   console.log('no role :(');
  //   console.log(err);
  // });
  chatkit.assignRoomRoleToUser({
    userId: hititePlayerId,
    name: 'Player',
    roomId: room,
  });
  res.send(games[room]);
});

router.get('/:room', (req, res) => {
  const room = req.params.room;
  // console.log(games);
  // console.log(games[room]);
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

  console.log('postHit');

  if (game) {
    // const piece = game.board[fromRow][fromColumn];
    const playerSide = game.players[player];

    console.log('game if entered');

    if (!playerSide) {
      res.status(400).send(`Not a player: ${player}`);
    } else {
      console.log('main block entered');
      for (let square of req?.body?.updatedSquares ?? []) {
        const pieceMeta = square.piece;
        game.board[square.row][square.col] = pieceMeta;
      }
      game.nextTurn = req?.body?.newTurn ?? game.nextTurn;

      console.log('updatedSquares');
      console.log(req?.body?.updatedSquares);
      console.log('gameUpdate');
      console.log(game.board[0]); // just resend the data, client will ignore if it's their move
      console.log(games[room].board[0]); // just resend the data, client will ignore if it's their move
      // no need to resend the whole board - maybe when/if there's more validation?
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
