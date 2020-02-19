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
    pieceTypes["legion"] = "legion";
    pieceTypes["chariot"] = "chariot";
    pieceTypes["warElephant"] = "warElephant";
    pieceTypes["centaur"] = "centaur";
    pieceTypes["lightCavalry"] = "lightCavalry";
    pieceTypes["general"] = "general";
})(pieceTypes = exports.pieceTypes || (exports.pieceTypes = {}));
exports.pieceDefs = [
    {
        pieceType: 'levy',
        health: 3,
    },
    {
        pieceType: 'archer',
        health: 2,
    },
    {
        pieceType: 'legion',
        health: 8,
    },
    {
        pieceType: 'cataphract',
        health: 10,
    },
    {
        pieceType: 'chariot',
        health: 10,
    },
    {
        pieceType: 'warElephant',
        health: 24,
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
        health: 12,
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
            //d
            rowArray[4] = makePhrygianPiece('cataphract');
            rowArray[rowArray.length - 5] = makePhrygianPiece('cataphract');
            rowArray[8] = makePhrygianPiece('general');
            rowArray[9] = makePhrygianPiece('warElephant');
            rowArray[6] = makePhrygianPiece('chariot');
            rowArray[rowArray.length - 7] = makePhrygianPiece('chariot');
            rowArray[2] = makePhrygianPiece('centaur');
            rowArray[rowArray.length - 3] = makePhrygianPiece('centaur');
        }
        else if (x === 1) {
            rowArray.fill(makePhrygianPiece('levy'), 0, 3);
            rowArray.fill(makePhrygianPiece('levy'), rowArray.length - 3, rowArray.length);
            rowArray.fill(makePhrygianPiece('legion'), 4, 6);
            rowArray.fill(makePhrygianPiece('legion'), 12, 14);
            rowArray.fill(makePhrygianPiece('archer'), 7, 11);
        }
        else if (x === 2) {
            rowArray[2] = makePhrygianPiece('lightCavalry');
            rowArray[4] = makePhrygianPiece('levy');
            rowArray[rowArray.length - 3] = makePhrygianPiece('lightCavalry');
            rowArray[rowArray.length - 5] = makePhrygianPiece('levy');
            rowArray.fill(makePhrygianPiece('legion'), 6, 12);
        }
        else if (x === 3) {
            rowArray[2] = makePhrygianPiece('chariot');
            rowArray.fill(makePhrygianPiece('archer'), 3, 4);
            rowArray.fill(makePhrygianPiece('archer'), 5, 6);
            // rowArray.fill(makePhrygianPiece('levy'), 7, rowArray.length - 7);
            rowArray[rowArray.length - 6] = makePhrygianPiece('archer');
            rowArray[rowArray.length - 3] = makePhrygianPiece('chariot');
            rowArray[rowArray.length - 4] = makePhrygianPiece('archer');
            rowArray[0] = makePhrygianPiece('lightCavalry');
            rowArray[rowArray.length - 1] = makePhrygianPiece('lightCavalry');
        }
        else if (x === 4) {
            rowArray.fill(makePhrygianPiece('levy'), 0, 1);
            rowArray.fill(makePhrygianPiece('levy'), 3, 7);
            rowArray.fill(makePhrygianPiece('levy'), rowArray.length - 7, rowArray.length - 3);
            rowArray.fill(makePhrygianPiece('levy'), rowArray.length - 1, rowArray.length);
        }
        // hittite side
        else if (x === BOARD_HEIGHT - 1) {
            rowArray[4] = makeHittitePiece('cataphract');
            rowArray[rowArray.length - 5] = makeHittitePiece('cataphract');
            rowArray[8] = makeHittitePiece('general');
            rowArray[9] = makeHittitePiece('warElephant');
            rowArray[6] = makeHittitePiece('chariot');
            rowArray[rowArray.length - 7] = makeHittitePiece('chariot');
            rowArray[2] = makeHittitePiece('centaur');
            rowArray[rowArray.length - 3] = makeHittitePiece('centaur');
        }
        else if (x === BOARD_HEIGHT - 2) {
            rowArray.fill(makeHittitePiece('levy'), 0, 3);
            rowArray.fill(makeHittitePiece('levy'), rowArray.length - 3, rowArray.length);
            rowArray.fill(makeHittitePiece('legion'), 4, 6);
            rowArray.fill(makeHittitePiece('legion'), 12, 14);
            rowArray.fill(makeHittitePiece('archer'), 7, 11);
        }
        else if (x === BOARD_HEIGHT - 3) {
            rowArray[2] = makeHittitePiece('lightCavalry');
            rowArray[4] = makeHittitePiece('levy');
            rowArray[rowArray.length - 3] = makeHittitePiece('lightCavalry');
            rowArray[rowArray.length - 5] = makeHittitePiece('levy');
            rowArray.fill(makeHittitePiece('legion'), 6, 12);
        }
        else if (x === BOARD_HEIGHT - 4) {
            rowArray[2] = makeHittitePiece('chariot');
            rowArray.fill(makeHittitePiece('archer'), 3, 4);
            rowArray.fill(makeHittitePiece('archer'), 5, 6);
            // rowArray.fill(makeHittitePiece('levy'), 7, rowArray.length - 7);
            rowArray[rowArray.length - 6] = makeHittitePiece('archer');
            rowArray[rowArray.length - 3] = makeHittitePiece('chariot');
            rowArray[rowArray.length - 4] = makeHittitePiece('archer');
            rowArray[0] = makeHittitePiece('lightCavalry');
            rowArray[rowArray.length - 1] = makeHittitePiece('lightCavalry');
        }
        else if (x === BOARD_HEIGHT - 5) {
            rowArray.fill(makeHittitePiece('levy'), 0, 1);
            rowArray.fill(makeHittitePiece('levy'), 3, 7);
            rowArray.fill(makeHittitePiece('levy'), rowArray.length - 7, rowArray.length - 3);
            rowArray.fill(makeHittitePiece('levy'), rowArray.length - 1, rowArray.length);
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
