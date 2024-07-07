const mqtt = require('mqtt');

// Địa chỉ MQTT broker (thay đổi nếu cần)
const brokerUrl = 'mqtt://localhost:1883';

// Tạo client MQTT và kết nối tới broker
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Hàm gửi tin nhắn điều khiển thiết bị với cờ isFromAutomation
  const publishControlMessage = (topic, message, isFromAutomation) => {
    const payload = JSON.stringify({ message, isFromAutomation });
    client.publish(topic, payload, { qos: 0, retain: true }, function (err) {
      if (!err) {
        console.log(`Published control message "${payload}" to topic "${topic}"`);
      } else {
        console.error('Failed to publish control message', err);
      }
    });
  };

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

  // Gửi lệnh bật bơm "on" tới topic esp/pump với cờ isFromAutomation là false
  publishControlMessage('esp/fan', 'on', false);
publishControlMessage('esp/light', 'on', false);
publishControlMessage('esp/pump', 'off', false);

  // Bắt đầu nhiệt độ từ 35
  let temperature = 35;

  // Định kỳ gửi giá trị nhiệt độ giảm dần lên topic esp/temp mỗi 5 giây
  const intervalId = setInterval(function () {
    publishDataMessage('esp/temp', temperature.toString());

    // Giảm nhiệt độ mỗi lần một đơn vị
    temperature -= 1;

    // Nếu nhiệt độ giảm xuống 25 thì dừng
    if (temperature < 25) {
      clearInterval(intervalId);
    }


  }, 5000);
let hum = 35;

  // Định kỳ gửi giá trị nhiệt độ giảm dần lên topic esp/temp mỗi 5 giây
  const intervalId1 = setInterval(function () {
    publishDataMessage('esp/hum', temperature.toString());

    // Giảm nhiệt độ mỗi lần một đơn vị
    hum += 1;

    // Nếu nhiệt độ giảm xuống 25 thì dừng
    if (hum > 45) {
      clearInterval(intervalId1);
    }


  }, 5000);
});





client.on('error', function (err) {
  console.error('Connection error: ', err);
  client.end();
});
