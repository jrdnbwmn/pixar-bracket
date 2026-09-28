/**
 * Pixar Bracket - backend
 * Deploy as Web App: Execute as "Me", Who has access: "Anyone".
 */

var SHEET_NAME = "State";
var ADMIN_PIN = "5207";

var BRACKET_SEED = {"movies":[{"id":"m1","title":"Toy Story","bye":true,"series":"TS","year":1995,"sequelOf":null},{"id":"m2","title":"A Bug's Life","bye":false,"series":null,"year":1998,"sequelOf":null},{"id":"m3","title":"Toy Story 2","bye":false,"series":"TS","year":1999,"sequelOf":"m1"},{"id":"m4","title":"Monsters, Inc.","bye":false,"series":"MU","year":2001,"sequelOf":null},{"id":"m5","title":"Finding Nemo","bye":true,"series":"ND","year":2003,"sequelOf":null},{"id":"m6","title":"The Incredibles","bye":false,"series":"INC","year":2004,"sequelOf":null},{"id":"m7","title":"Cars","bye":false,"series":null,"year":2006,"sequelOf":null},{"id":"m8","title":"Ratatouille","bye":false,"series":null,"year":2007,"sequelOf":null},{"id":"m9","title":"WALL-E","bye":true,"series":null,"year":2008,"sequelOf":null},{"id":"m10","title":"Up","bye":true,"series":null,"year":2009,"sequelOf":null},{"id":"m11","title":"Toy Story 3","bye":false,"series":"TS","year":2010,"sequelOf":"m3"},{"id":"m12","title":"Brave","bye":false,"series":null,"year":2012,"sequelOf":null},{"id":"m13","title":"Monsters University","bye":false,"series":"MU","year":2013,"sequelOf":null},{"id":"m14","title":"Inside Out","bye":true,"series":"IO","year":2015,"sequelOf":null},{"id":"m15","title":"The Good Dinosaur","bye":false,"series":null,"year":2015,"sequelOf":null},{"id":"m16","title":"Finding Dory","bye":false,"series":"ND","year":2016,"sequelOf":"m5"},{"id":"m17","title":"Coco","bye":false,"series":null,"year":2017,"sequelOf":null},{"id":"m18","title":"Incredibles 2","bye":false,"series":"INC","year":2018,"sequelOf":"m6"},{"id":"m19","title":"Toy Story 4","bye":false,"series":"TS","year":2019,"sequelOf":"m11"},{"id":"m20","title":"Onward","bye":false,"series":null,"year":2020,"sequelOf":null},{"id":"m21","title":"Soul","bye":false,"series":null,"year":2020,"sequelOf":null},{"id":"m22","title":"Luca","bye":false,"series":null,"year":2021,"sequelOf":null},{"id":"m23","title":"Elemental","bye":false,"series":null,"year":2023,"sequelOf":null},{"id":"m24","title":"Inside Out 2","bye":false,"series":"IO","year":2024,"sequelOf":"m14"},{"id":"m25","title":"Elio","bye":false,"series":null,"year":2025,"sequelOf":null},{"id":"m26","title":"Hoppers","bye":false,"series":null,"year":2026,"sequelOf":null},{"id":"m27","title":"Toy Story 5","bye":false,"series":"TS","year":2026,"sequelOf":"m19"}],"games":[{"id":"P1","round":"playin","quarter":0,"movieIds":["m24","m16"]},{"id":"P2","round":"playin","quarter":0,"movieIds":["m17","m27"]},{"id":"P3","round":"playin","quarter":0,"movieIds":["m7","m23"]},{"id":"P4","round":"playin","quarter":0,"movieIds":["m6","m3"]},{"id":"P5","round":"playin","quarter":1,"movieIds":["m25","m15"]},{"id":"P6","round":"playin","quarter":1,"movieIds":["m12","m21"]},{"id":"P7","round":"playin","quarter":1,"movieIds":["m13","m22"]},{"id":"P8","round":"playin","quarter":2,"movieIds":["m18","m8"]},{"id":"P9","round":"playin","quarter":2,"movieIds":["m2","m19"]},{"id":"P10","round":"playin","quarter":3,"movieIds":["m20","m11"]},{"id":"P11","round":"playin","quarter":3,"movieIds":["m26","m4"]},{"id":"R1","round":"r16","quarter":0,"slots":[{"ready":false,"sourceGame":"P1"},{"ready":false,"sourceGame":"P2"}]},{"id":"R2","round":"r16","quarter":0,"slots":[{"ready":false,"sourceGame":"P3"},{"ready":false,"sourceGame":"P4"}]},{"id":"R3","round":"r16","quarter":1,"slots":[{"ready":false,"sourceGame":"P5"},{"ready":false,"sourceGame":"P6"}]},{"id":"R4","round":"r16","quarter":1,"slots":[{"ready":true,"movieId":"m9"},{"ready":false,"sourceGame":"P7"}]},{"id":"R5","round":"r16","quarter":2,"slots":[{"ready":false,"sourceGame":"P8"},{"ready":true,"movieId":"m5"}]},{"id":"R6","round":"r16","quarter":2,"slots":[{"ready":false,"sourceGame":"P9"},{"ready":true,"movieId":"m1"}]},{"id":"R7","round":"r16","quarter":3,"slots":[{"ready":false,"sourceGame":"P10"},{"ready":true,"movieId":"m14"}]},{"id":"R8","round":"r16","quarter":3,"slots":[{"ready":false,"sourceGame":"P11"},{"ready":true,"movieId":"m10"}]},{"id":"Q1","round":"qf","quarter":0,"slots":[{"ready":false,"sourceGame":"R1"},{"ready":false,"sourceGame":"R2"}]},{"id":"Q2","round":"qf","quarter":1,"slots":[{"ready":false,"sourceGame":"R3"},{"ready":false,"sourceGame":"R4"}]},{"id":"Q3","round":"qf","quarter":2,"slots":[{"ready":false,"sourceGame":"R5"},{"ready":false,"sourceGame":"R6"}]},{"id":"Q4","round":"qf","quarter":3,"slots":[{"ready":false,"sourceGame":"R7"},{"ready":false,"sourceGame":"R8"}]},{"id":"S1","round":"sf","slots":[{"ready":false,"sourceGame":"Q1"},{"ready":false,"sourceGame":"Q2"}]},{"id":"S2","round":"sf","slots":[{"ready":false,"sourceGame":"Q3"},{"ready":false,"sourceGame":"Q4"}]},{"id":"F1","round":"final","slots":[{"ready":false,"sourceGame":"S1"},{"ready":false,"sourceGame":"S2"}]}]};

var PEOPLE = ["Jeff", "Celeste", "Jordan", "Tori", "Kinsey", "Paul", "Alyssa", "Daren"];

function doGet(e) {
  return respond(getState());
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ error: "bad_json" });
  }
  var lock = LockService.getScriptLock();
  var result;
  try {
    lock.waitLock(10000);
    switch (body.action) {
      case "vote":
        result = handleVote(body);
        break;
      case "championPick":
        result = handleChampionPick(body);
        break;
      case "admin_reset":
        result = handleAdminReset(body);
        break;
      case "admin_undo":
        result = handleAdminUndo(body);
        break;
      case "admin_force":
        result = handleAdminForce(body);
        break;
      default:
        result = { error: "unknown_action" };
    }
  } catch (err) {
    result = { error: String(err) };
  } finally {
    lock.releaseLock();
  }
  return respond(result);
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function initialState_() {
  return {
    bracket: BRACKET_SEED,
    people: PEOPLE,
    votes: {},
    results: {},
    championPicks: {}
  };
}

function getState() {
  var sh = getSheet_();
  var raw = sh.getRange(1, 1).getValue();
  if (!raw) {
    var init = initialState_();
    sh.getRange(1, 1).setValue(JSON.stringify(init));
    return init;
  }
  return JSON.parse(raw);
}

function saveState_(state) {
  getSheet_().getRange(1, 1).setValue(JSON.stringify(state));
}

function findGame_(state, gameId) {
  for (var i = 0; i < state.bracket.games.length; i++) {
    if (state.bracket.games[i].id === gameId) return state.bracket.games[i];
  }
  return null;
}

// Resolve what movie occupies a slot, or null if not yet decided.
function resolveSlot_(state, slot) {
  if (slot.ready) return slot.movieId;
  var res = state.results[slot.sourceGame];
  return res ? res.winner : null;
}

function gameMovies_(state, game) {
  if (game.round === "playin") return game.movieIds;
  return [resolveSlot_(state, game.slots[0]), resolveSlot_(state, game.slots[1])];
}

function handleVote(body) {
  var person = body.person, gameId = body.gameId, movieId = body.movieId;
  if (PEOPLE.indexOf(person) === -1) return { error: "unknown_person" };
  var state = getState();
  var game = findGame_(state, gameId);
  if (!game) return { error: "unknown_game" };
  if (state.results[gameId]) return { error: "already_resolved" };
  var movies = gameMovies_(state, game);
  if (!movies[0] || !movies[1]) return { error: "game_not_open" };
  if (movieId !== movies[0] && movieId !== movies[1]) return { error: "invalid_movie" };
  if (!state.votes[gameId]) state.votes[gameId] = {};
  if (state.votes[gameId][person]) return { error: "already_voted" };
  state.votes[gameId][person] = { movieId: movieId, ts: Date.now() };

  var voteCount = Object.keys(state.votes[gameId]).length;
  if (voteCount >= PEOPLE.length) {
    var tally = {};
    tally[movies[0]] = 0;
    tally[movies[1]] = 0;
    for (var p in state.votes[gameId]) {
      tally[state.votes[gameId][p].movieId]++;
    }
    var tie = tally[movies[0]] === tally[movies[1]];
    var winner, coinToss = null;
    if (tie) {
      var flip = Math.random() < 0.5 ? movies[0] : movies[1];
      winner = flip;
      coinToss = { flippedTo: flip, tally: tally };
    } else {
      winner = tally[movies[0]] > tally[movies[1]] ? movies[0] : movies[1];
    }
    state.results[gameId] = {
      winner: winner,
      movies: movies,
      tally: tally,
      tie: tie,
      coinToss: coinToss,
      decidingPerson: person,
      resolvedAt: Date.now()
    };
  }
  saveState_(state);
  return { ok: true, state: state };
}

function handleChampionPick(body) {
  var person = body.person, movieId = body.movieId;
  if (PEOPLE.indexOf(person) === -1) return { error: "unknown_person" };
  var state = getState();
  if (state.championPicks[person]) return { error: "already_picked" };
  state.championPicks[person] = movieId;
  saveState_(state);
  return { ok: true, state: state };
}

function checkPin_(body) {
  return body.pin === ADMIN_PIN;
}

function handleAdminReset(body) {
  if (!checkPin_(body)) return { error: "bad_pin" };
  var state = getState();
  state.votes = {};
  state.results = {};
  state.championPicks = {};
  saveState_(state);
  return { ok: true, state: state };
}

// clears a game's votes/result, and cascades forward to any game that depended on it
function handleAdminUndo(body) {
  if (!checkPin_(body)) return { error: "bad_pin" };
  var state = getState();
  var toClear = {};
  var queue = [body.gameId];
  while (queue.length) {
    var gid = queue.shift();
    if (toClear[gid]) continue;
    toClear[gid] = true;
    for (var i = 0; i < state.bracket.games.length; i++) {
      var g = state.bracket.games[i];
      if (g.slots) {
        for (var s = 0; s < g.slots.length; s++) {
          if (g.slots[s].sourceGame === gid) queue.push(g.id);
        }
      }
    }
  }
  for (var gid2 in toClear) {
    delete state.votes[gid2];
    delete state.results[gid2];
  }
  saveState_(state);
  return { ok: true, state: state };
}

function handleAdminForce(body) {
  if (!checkPin_(body)) return { error: "bad_pin" };
  var state = getState();
  var game = findGame_(state, body.gameId);
  if (!game) return { error: "unknown_game" };
  var movies = gameMovies_(state, game);
  state.results[body.gameId] = {
    winner: body.movieId,
    movies: movies,
    tally: state.votes[body.gameId] ? summarizeVotes_(state.votes[body.gameId], movies) : {},
    tie: false,
    coinToss: null,
    forced: true,
    resolvedAt: Date.now()
  };
  saveState_(state);
  return { ok: true, state: state };
}

function summarizeVotes_(votesForGame, movies) {
  var tally = {};
  tally[movies[0]] = 0;
  tally[movies[1]] = 0;
  for (var p in votesForGame) {
    var mid = votesForGame[p].movieId;
    if (tally[mid] !== undefined) tally[mid]++;
  }
  return tally;
}
