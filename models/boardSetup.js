"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash/core');
var playerIds;
(function (playerIds) {
    playerIds["phrygians"] = "phrygians";
    playerIds["hittites"] = "hittites";
})(playerIds = exports.playerIds || (exports.playerIds = {}));
var pieceTypes;
(function (pieceTypes) {
    pieceTypes["levy"] = "levy";
    pieceTypes["archer"] = "archer";
    pieceTypes["cataphract"] = "cataphract";
    pieceTypes["hoplite"] = "hoplite";
    pieceTypes["chariot"] = "chariot";
    pieceTypes["warElephant"] = "warElephant";
    pieceTypes["centaur"] = "centaur";
    pieceTypes["lightCavalry"] = "lightCavalry";
    pieceTypes["general"] = "general";
})(pieceTypes = exports.pieceTypes || (exports.pieceTypes = {}));
exports.pieceDefs = [
    {
        pieceType: 'levy',
        health: 2,
    },
    {
        pieceType: 'archer',
        health: 2,
    },
    {
        pieceType: 'hoplite',
        health: 8,
    },
    {
        pieceType: 'cataphract',
        health: 8,
    },
    {
        pieceType: 'chariot',
        health: 12,
    },
    {
        pieceType: 'warElephant',
        health: 20,
    },
    {
        pieceType: 'lightCavalry',
        health: 4,
    },
    {
        pieceType: 'centaur',
        health: 4,
    },
    {
        pieceType: 'general',
        health: 10,
    },
];
var BOARD_WIDTH = 18;
var BOARD_HEIGHT = 12;
function generateNewBoard() {
    var boardState = [];
    for (var x = 0; x < BOARD_HEIGHT; x++) {
        var rowArray = new Array(BOARD_WIDTH).fill(null);
        // phrygian side
        if (x === 0) {
            rowArray[5] = makePhrygianPiece('cataphract');
            rowArray[rowArray.length - 5] = makePhrygianPiece('cataphract');
            rowArray[7] = makePhrygianPiece('general');
            rowArray[9] = makePhrygianPiece('warElephant');
            rowArray[2] = makePhrygianPiece('archer');
            rowArray[10] = makePhrygianPiece('archer');
            rowArray[13] = makePhrygianPiece('archer');
        }
        else if (x === 1) {
            rowArray[6] = makePhrygianPiece('chariot');
            rowArray[rowArray.length - 6] = makePhrygianPiece('chariot');
            rowArray[4] = makePhrygianPiece('archer');
            rowArray[8] = makePhrygianPiece('archer');
            rowArray[12] = makePhrygianPiece('archer');
            rowArray[2] = makePhrygianPiece('centaur');
            rowArray[rowArray.length - 2] = makePhrygianPiece('centaur');
        }
        else if (x === 2) {
            rowArray[1] = makePhrygianPiece('lightCavalry');
            rowArray.fill(makePhrygianPiece('hoplite'), 3, 6);
            rowArray.fill(makePhrygianPiece('hoplite'), 7, 10);
            rowArray.fill(makePhrygianPiece('hoplite'), 11, 14);
            rowArray[rowArray.length - 2] = makePhrygianPiece('lightCavalry');
        }
        else if (x === 3) {
            rowArray.fill(makePhrygianPiece('levy'), 2, 4);
            rowArray.fill(makePhrygianPiece('levy'), 7, 11);
            rowArray.fill(makePhrygianPiece('levy'), 12, 14);
        }
        else if (x === 4) {
            rowArray[4] = makePhrygianPiece('lightCavalry');
            rowArray.fill(makePhrygianPiece('levy'), 2, 6);
            rowArray.fill(makePhrygianPiece('levy'), 8, 10);
            rowArray.fill(makePhrygianPiece('levy'), 10, 14);
            rowArray[rowArray.length - 5] = makePhrygianPiece('lightCavalry');
        }
        // hittite side
        else if (x === BOARD_HEIGHT - 1) {
            rowArray[5] = makeHittitePiece('cataphract');
            rowArray[rowArray.length - 5] = makeHittitePiece('cataphract');
            rowArray[7] = makeHittitePiece('general');
            rowArray[9] = makeHittitePiece('warElephant');
            rowArray[2] = makeHittitePiece('archer');
            rowArray[10] = makeHittitePiece('archer');
            rowArray[13] = makeHittitePiece('archer');
        }
        else if (x === BOARD_HEIGHT - 2) {
            rowArray[6] = makeHittitePiece('chariot');
            rowArray[rowArray.length - 6] = makeHittitePiece('chariot');
            rowArray[4] = makeHittitePiece('archer');
            rowArray[8] = makeHittitePiece('archer');
            rowArray[12] = makeHittitePiece('archer');
            rowArray[2] = makeHittitePiece('centaur');
            rowArray[rowArray.length - 2] = makeHittitePiece('centaur');
        }
        else if (x === BOARD_HEIGHT - 3) {
            rowArray[1] = makeHittitePiece('lightCavalry');
            rowArray.fill(makeHittitePiece('hoplite'), 3, 6);
            rowArray.fill(makeHittitePiece('hoplite'), 7, 10);
            rowArray.fill(makeHittitePiece('hoplite'), 11, 14);
            rowArray[rowArray.length - 2] = makeHittitePiece('lightCavalry');
        }
        else if (x === BOARD_HEIGHT - 4) {
            rowArray.fill(makeHittitePiece('levy'), 2, 4);
            rowArray.fill(makeHittitePiece('levy'), 7, 11);
            rowArray.fill(makeHittitePiece('levy'), 12, 14);
        }
        else if (x === BOARD_HEIGHT - 5) {
            rowArray[4] = makeHittitePiece('lightCavalry');
            rowArray.fill(makeHittitePiece('levy'), 2, 6);
            rowArray.fill(makeHittitePiece('levy'), 8, 10);
            rowArray.fill(makeHittitePiece('levy'), 10, 14);
            rowArray[rowArray.length - 5] = makeHittitePiece('lightCavalry');
        }
        boardState.push(rowArray);
    }
    return boardState;
}
exports.generateNewBoard = generateNewBoard;
function makePhrygianPiece(pieceType) {
    return makePiece(playerIds.phrygians, pieceType);
}
function makeHittitePiece(pieceType) {
    return makePiece(playerIds.hittites, pieceType);
}
function makePiece(player, pieceType) {
    return _.clone(_.extend(_.find(exports.pieceDefs, function (meta) { return meta.pieceType === pieceType; }), { player: player }));
}
