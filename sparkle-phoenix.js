'use strict';

const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');
const Game = require('./src/game');

var wsManager = new WSManager();

var httpServer = new HttpServer(8080, wsManager);

httpServer.startServer();

var game = new Game(function(id, state) {
  console.log(`Callback = ID: ${id}`);
  console.log(state);
  wsManager.sendMessage(id, state);
});

wsManager.addFunction('playerJoin', function(id) {
  game.addPlayer(id);
});

wsManager.addFunction('playerEndTurn', function(message) {
  if (message && message.playerId && message.moveDir && message.fireDir) {
    game.endTurn(message.playerId, message.moveDir, message.fireDir);
  }
});

game.newGame(3);



/*

app.delete('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});
*/