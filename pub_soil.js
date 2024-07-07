const mqtt = require('mqtt');

// Địa chỉ MQTT broker (thay đổi nếu cần)
const brokerUrl = 'mqtt://localhost:1883';

// Tạo client MQTT và kết nối tới broker
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Hàm gửi tin nhắn dữ liệu không có cờ isFromAutomation
  const publishDataMessage = (topic, message) => {
    client.publish(topic, message, { qos: 0, retain: true }, function (err) {
      if (!err) {
        console.log(`Published data message "${message}" to topic "${topic}"`);
      } else {
        console.error('Failed to publish data message', err);
      }
    });
  };

  // Bắt đầu giá trị độ ẩm đất từ 45
  let soilHumidity = 45;

  // Định kỳ gửi giá trị độ ẩm đất từ 45 đến 85 mỗi 5 giây
  const intervalId = setInterval(function () {
    publishDataMessage('esp/soil', soilHumidity.toString());

    // Tăng giá trị độ ẩm đất lên mỗi lần một đơn vị
    soilHumidity += 1;

    // Nếu giá trị độ ẩm đất đạt 85 thì dừng
    if (soilHumidity > 85) {
      clearInterval(intervalId);
    }
  }, 5000);
});

client.on('error', function (err) {
  console.error('Connection error: ', err);
  client.end();
});


