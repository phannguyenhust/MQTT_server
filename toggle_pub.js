const mqtt = require('mqtt');

// Địa chỉ MQTT broker (thay đổi nếu cần)
const brokerUrl = 'mqtt://localhost:1883';

// Tạo client MQTT và kết nối tới broker
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Toggle pump device
  const topic = 'esp/pump';
  const state = true; // Turn on pump
  client.publish(topic, state ? 'on' : 'off', { qos: 0, retain: true }, function (err) {
    if (!err) {
      console.log(`Published control message "${state ? 'on' : 'off'}" to topic "${topic}"`);
    } else {
      console.error('Failed to publish control message', err);
    }
  });

  // Toggle pump device again after 5 seconds
  setTimeout(() => {
    state = false; // Turn off pump
    client.publish(topic, state ? 'on' : 'off', { qos: 0, retain: true }, function (err) {
      if (!err) {
        console.log(`Published control message "${state ? 'on' : 'off'}" to topic "${topic}"`);
      } else {
        console.error('Failed to publish control message', err);
      }
    });
  }, 5000);
});

client.on('error', function (err) {
  console.error('Connection error: ', err);
  client.end();
});