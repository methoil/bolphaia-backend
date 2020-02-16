"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { playerIds } = require('../models/pieceMeta.model');
var boardSetup_1 = require("../models/boardSetup");
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
var playerIds;
(function (playerIds) {
    playerIds["phrygians"] = "phrygians";
    playerIds["hittites"] = "hittites";
})(playerIds || (playerIds = {}));
var games = {};
var lastUpdate = {
    player: null,
    updatedSquares: [],
};
router.post('/', function (req, res) {
    var _a;
    console.log('is this root post hit somehow???');
    var room = req.body.room;
    var phrygianPlayerId = req.body.whitePlayer;
    var hititePlayerId = req.body.blackPlayer;
    var newGame = {
        players: (_a = {},
            _a[phrygianPlayerId] = playerIds.phrygians,
            _a[hititePlayerId] = playerIds.hittites,
            _a),
        nextTurn: playerIds.phrygians,
        board: boardSetup_1.generateNewBoard(),
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
router.get('/:room', function (req, res) {
    var _a, _b;
    var room = req.params.room;
    // console.log(games);
    // console.log(games[room]);
    var game = games[room];
    if (game) {
        game.player = (_a = lastUpdate) === null || _a === void 0 ? void 0 : _a.player;
        game.updatedSquares = (_b = lastUpdate) === null || _b === void 0 ? void 0 : _b.updatedSquares;
        res.send(game);
    }
    else {
        res.status(404).send("Game not found: " + room);
    }
});
router.post('/:room', function (req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var room = req.params.room;
    var player = req.body.player;
    var game = games[room];
    console.log('postHit');
    if (game) {
        // const piece = game.board[fromRow][fromColumn];
        var playerSide = game.players[player];
        console.log('game if entered');
        if (!playerSide) {
            res.status(400).send("Not a player: " + player);
        }
        else {
            console.log('main block entered');
            for (var _i = 0, _j = (_c = (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.updatedSquares, (_c !== null && _c !== void 0 ? _c : [])); _i < _j.length; _i++) {
                var square = _j[_i];
                var pieceMeta = square.piece;
                game.board[square.row][square.col] = pieceMeta;
            }
            game.nextTurn = (_f = (_e = (_d = req) === null || _d === void 0 ? void 0 : _d.body) === null || _e === void 0 ? void 0 : _e.newTurn, (_f !== null && _f !== void 0 ? _f : game.nextTurn));
            console.log('updatedSquares');
            console.log((_h = (_g = req) === null || _g === void 0 ? void 0 : _g.body) === null || _h === void 0 ? void 0 : _h.updatedSquares);
            console.log('gameUpdate');
            console.log(game.board[0]); // just resend the data, client will ignore if it's their move
            console.log(games[room].board[0]); // just resend the data, client will ignore if it's their move
            // no need to resend the whole board - maybe when/if there's more validation?
            lastUpdate = req.body;
            res.send(req.body);
            pusher.trigger('game-' + room, 'board-updated', {});
        }
    }
    else {
        // TODO: make a new game here
        res.status(404).send("Game not found: " + room);
    }
});
module.exports = router;
