const assert = require('assert').strict;

import Game from './board/model/Game'


test('game move validation', () => {
  let g = new Game(5)
  assert(g.is_valid_move("h5"))
  g.myBars.push("h5")
  assert(g.is_valid_move("h5"))
});

/* Manual tests

const Game = require('./src/board/model/Game')
const g = new Game(4)
