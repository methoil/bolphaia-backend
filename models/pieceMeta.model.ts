var _ = require('lodash/core');

export enum playerIds {
  phrygians = 'phrygians',
  hittites = 'hittites',
}

export enum pieceTypes {
  levy = 'levy',
  archer = 'archer',
  cataphract = 'cataphract',
  hoplite = 'hoplite',
  chariot = 'chariot',
  warElephant = 'warElephant',
  centaur = 'centaur',
  lightCavalry = 'lightCavalry',
  general = 'general',
}

interface IPieceMeta {
  pieceType: string;
  player: string;
  health: number;
}

export const pieceDefs = [
  {
    pieceId: 'levy',
    health: 2,
  },
  {
    pieceId: 'archer',
    health: 2,
  },
  {
    pieceId: 'hoplite',
    health: 8,
  },
  {
    pieceId: 'cataphract',
    health: 8,
  },
  {
    pieceId: 'chariot',
    health: 12,
  },
  {
    pieceId: 'warElephant',
    health: 20,
  },
  {
    pieceId: 'lightCavalry',
    health: 4,
  },
  {
    pieceId: 'centaur',
    health: 4,
  },
  {
    pieceId: 'general',
    health: 10,
  },
];

const BOARD_WIDTH: number = 18;
const BOARD_HEIGHT: number = 12;

function initBoard(): Array<IPieceMeta | null>[] {
  const boardState: Array<IPieceMeta | null>[] = [];
  for (let x = 0; x < BOARD_HEIGHT; x++) {
    const rowArray: Array<IPieceMeta | null> = new Array(BOARD_WIDTH).fill(null);
    // phrygian side
    if (x === 1) {
      rowArray[5] = makePhrygianPiece('cataphract');
      rowArray[rowArray.length - 5] = makePhrygianPiece('cataphract');
      rowArray[7] = makePhrygianPiece('general');
      rowArray[9] = makePhrygianPiece('elephant');

      rowArray[2] = makePhrygianPiece('archer');
      rowArray[10] = makePhrygianPiece('archer');
      rowArray[13] = makePhrygianPiece('archer');

      boardState.push(rowArray);
    } else if (x === 2) {
      rowArray[6] = makePhrygianPiece('chariot');
      rowArray[rowArray.length - 6] = makePhrygianPiece('chariot');
      rowArray[4] = makePhrygianPiece('archer');
      rowArray[8] = makePhrygianPiece('archer');
      rowArray[12] = makePhrygianPiece('archer');
      rowArray[2] = makePhrygianPiece('centaur');
      rowArray[rowArray.length - 2] = makePhrygianPiece('centaur');
    } else if (x === 3) {
      rowArray[1] = makePhrygianPiece('lightCavalry');
      rowArray.fill(makePhrygianPiece('hoplite'), 3, 6);
      rowArray.fill(makePhrygianPiece('hoplite'), 7, 10);
      rowArray.fill(makePhrygianPiece('hoplite'), 11, 14);
      rowArray[rowArray.length - 2] = makePhrygianPiece('lightCavalry');
    } else if (x === 3) {
      rowArray.fill(makePhrygianPiece('levy'), 2, 4);
      rowArray.fill(makePhrygianPiece('levy'), 7, 11);
      rowArray.fill(makePhrygianPiece('levy'), 12, 14);
    } else if (x === 4) {
      rowArray[4] = makePhrygianPiece('lightCavalry');
      rowArray.fill(makePhrygianPiece('levy'), 2, 6);
      rowArray.fill(makePhrygianPiece('levy'), 8, 10);
      rowArray.fill(makePhrygianPiece('levy'), 10, 14);
      rowArray[rowArray.length - 5] = makePhrygianPiece('lightCavalry');
    }
    // hittite side
    else if (x === BOARD_HEIGHT - 2) {
      rowArray[5] = makeHittitePiece('cataphract');
      rowArray[rowArray.length - 5] = makeHittitePiece('cataphract');
      rowArray[7] = makeHittitePiece('general');
      rowArray[9] = makeHittitePiece('elephant');

      rowArray[2] = makeHittitePiece('archer');
      rowArray[10] = makeHittitePiece('archer');
      rowArray[13] = makeHittitePiece('archer');

      boardState.push(rowArray);
    } else if (x === BOARD_HEIGHT - 3) {
      rowArray[6] = makeHittitePiece('chariot');
      rowArray[rowArray.length - 6] = makeHittitePiece('chariot');
      rowArray[4] = makeHittitePiece('archer');
      rowArray[8] = makeHittitePiece('archer');
      rowArray[12] = makeHittitePiece('archer');
      rowArray[2] = makeHittitePiece('centaur');
      rowArray[rowArray.length - 2] = makeHittitePiece('centaur');
    } else if (x === BOARD_HEIGHT - 4) {
      rowArray[1] = makeHittitePiece('lightCavalry');
      rowArray.fill(makeHittitePiece('hoplite'), 3, 6);
      rowArray.fill(makeHittitePiece('hoplite'), 7, 10);
      rowArray.fill(makeHittitePiece('hoplite'), 11, 14);
      rowArray[rowArray.length - 2] = makeHittitePiece('lightCavalry');
    } else if (x === BOARD_HEIGHT - 5) {
      rowArray.fill(makeHittitePiece('levy'), 2, 4);
      rowArray.fill(makeHittitePiece('levy'), 7, 11);
      rowArray.fill(makeHittitePiece('levy'), 12, 14);
    } else if (x === BOARD_HEIGHT - 6) {
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

function makePhrygianPiece(pieceId: string) {
  return makePiece(playerIds.phrygians, pieceId);
}

function makeHittitePiece(pieceId: string) {
  return makePiece(playerIds.hittites, pieceId);
}

function makePiece(player: playerIds, pieceId: string): IPieceMeta {
  return _.extend(
    _.find(pieceDefs, meta => meta.pieceId === pieceId),
    { player },
  );
}
