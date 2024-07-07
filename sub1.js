const mqtt = require('mqtt');
const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Đăng ký nhận dữ liệu từ chủ đề "esp/pump"
  client.subscribe('esp/pump', function (err) {
    if (!err) {
      console.log('Subscribed to topic "esp/pump"');
    } else {
      console.error('Failed to subscribe to topic', err);
    }
  });
});

client.on('message', function (topic, message) {
  // Xử lý dữ liệu nhận được từ chủ đề
  console.log(`Received message from topic "${topic}":`, message.toString());

  // Kiểm tra xem có phải thông báo từ chủ đề "esp/pump" không
  if (topic === 'esp/pump') {
    // Chuyển đổi tin nhắn nhận được từ buffer sang chuỗi
    const msg = message.toString();

    // Kiểm tra xem tin nhắn là "off" và có đánh dấu là từ tự động hóa không
    if (msg === 'off' && isFromAutomation) {
      // Thực hiện hành động tắt máy bơm ở đây
      console.log('Turn off the pump');
      // Ví dụ: Tắt máy bơm
    }
  }
});

client.on('error', function (err) {
  console.error('Connection error: ', err);
  client.end();
});

