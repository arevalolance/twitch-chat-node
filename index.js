const WebSocketClient = require('websocket').client;
const { parseMessage } = require('./parser');
const client = new WebSocketClient();
require('dotenv').config();

const OAUTH_PASS = process.env.OAUTH_PASS;
const NICKNAME = process.env.NICKNAME;
const CHANNEL_NAME = process.env.CHANNEL_NAME;

console.log(typeof OAUTH_PASS, "test")

client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
  console.log('WebSocket Client Connected');

  connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
  connection.sendUTF('PASS ' + OAUTH_PASS);
  connection.sendUTF('NICK ' + NICKNAME);

  connection.sendUTF("JOIN #" + CHANNEL_NAME);

  connection.on('message', function incoming(data) {
    let message = parseMessage(data.utf8Data);
    let author = message?.source.nick;
    let messageText = message?.parameters;
    console.log(author + ": " + messageText);
  });
});


client.connect('ws://irc-ws.chat.twitch.tv:80');
