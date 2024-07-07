const mqtt = require('mqtt');
const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

let shouldStartListening = true; // Biến để đánh dấu xem liệu bạn muốn bắt đầu nhận dữ liệu mới hay không

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Chỉ đăng ký nhận dữ liệu khi cờ shouldStartListening là true
  if (shouldStartListening) {
    client.subscribe('esp/pump', function (err) {
      if (!err) {
        console.log('Subscribed to topic "esp/pump"');
      } else {
        console.error('Failed to subscribe to topic', err);
      }
    });

    client.subscribe('esp/light', function (err) {
      if (!err) {
        console.log('Subscribed to topic "esp/light"');
      } else {
        console.error('Failed to subscribe to topic', err);
      }
    });

    client.subscribe('esp/fan', function (err) {
      if (!err) {
        console.log('Subscribed to topic "esp/fan"');
      } else {
        console.error('Failed to subscribe to topic', err);
      }
    });
  }
});

client.on('message', function (topic, message) {
  // Xử lý dữ liệu nhận được từ chủ đề
  console.log(`Received message from topic "${topic}":`, message.toString());
});

client.on('error', function (err) {
  console.error('Connection error: ', err);
  client.end();
});

// Sau 5 giây, đặt shouldStartListening thành true để bắt đầu nhận dữ liệu mới
setTimeout(() => {
  shouldStartListening = true;
}, 5000);
