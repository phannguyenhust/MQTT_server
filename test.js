const aedes = require('aedes')();
const net = require('net');
const http = require('http');
const WebSocket = require('ws');
const websocketStream = require('websocket-stream');

// Cổng TCP cho MQTT
const mqttPort = 1883;
// Cổng WebSocket cho MQTT
const wsPort = 8000;

// Tạo máy chủ TCP cho MQTT
const mqttServer = net.createServer(aedes.handle);

mqttServer.listen(mqttPort, function () {
  console.log(`Aedes MQTT broker started and listening on port ${mqttPort}`);
});

// Tạo máy chủ HTTP để sử dụng WebSocket
const httpServer = http.createServer();
const wsServer = new WebSocket.Server({ server: httpServer });

wsServer.on('connection', function (ws) {
  const stream = websocketStream(ws);
  aedes.handle(stream);
});

httpServer.listen(wsPort, function () {
  console.log(`Aedes MQTT broker started and listening on port ${wsPort} (WebSocket)`);
});

// Các sự kiện Aedes
aedes.on('client', function (client) {
  console.log('Client Connected:', client ? client.id : client);
});

aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected:', client ? client.id : client);
});

aedes.on('publish', async function (packet, client) {
  console.log('Message Published:', packet.payload.toString());
  console.log('Retain flag:', packet.retain);
  // Xử lý tin nhắn tại đây
});

aedes.on('subscribe', function (subscriptions, client) {
  console.log('Client Subscribed:', subscriptions, client ? client.id : client);
});

aedes.on('unsubscribe', function (subscriptions, client) {
  console.log('Client Unsubscribed:', subscriptions, client ? client.id : client);
});
