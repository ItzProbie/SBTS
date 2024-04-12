const awsIot = require("aws-iot-device-sdk");
const poly = require("polyline");
const axios = require("axios");

const { call } = require("./tester");

const device = awsIot.device({
  clientId: "TestingClient",
  host: "a1let9rdp6b9at-ats.iot.eu-north-1.amazonaws.com",
  port: 8883,
  keyPath: "./assets/private.pem.key",
  certPath: "./assets/certificate.pem.crt",
  caPath: "./assets/rootCA.pem",
});

let coordinateData = {};
let timeoutTimes = {}; 

async function performTask(userId) {
  if (coordinateData[userId].length === 0) return;

  try {
    console.log(`No data received for 2 minutes for userId ${userId}. Logging coordinates:`);
    const polyline = poly.encode(coordinateData[userId]);
    await call({ coordinates: coordinateData[userId], userId });

    coordinateData[userId] = [];
    delete timeoutTimes[userId];
  } catch (err) {
    console.error(err);
  }
}

async function receiveData(userId, data) {
  if (data.coordinates === "Not available") return;

  const { coordinates } = data;
  const lat = parseFloat(coordinates.split(",")[0].trim());
  const lng = parseFloat(coordinates.split(",")[1].trim());

  coordinateData[userId] = coordinateData[userId] || [];
  coordinateData[userId].push([lat, lng]);
  timeoutTimes[userId] = Date.now();
}

device.on("connect", function () {
console.log("Connected to AWS-IOT");
device.subscribe("TollCalc/data");
});

device.on("message", function (topic, payload) {
    const data = JSON.parse(payload.toString());

    const timestamp = Date.now();

    const currentDate = new Date(timestamp);

    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const yyyy = currentDate.getFullYear(); 

    const hr = String(currentDate.getHours()).padStart(2, '0'); 
    const min = String(currentDate.getMinutes()).padStart(2, '0'); 
    const sec = String(currentDate.getSeconds()).padStart(2, '0');

    data.date = `${dd}/${mm}/${yyyy}`;
    data.Time = `${hr}:${min}:${sec}`;

    console.log(data);

    receiveData( data.userId, data);
});

device.on("error", function (error) {
    console.error("Error:", error);
});

setInterval(() => {
    const currentTime = Date.now();
    for (const userId in timeoutTimes) {
    if (currentTime - timeoutTimes[userId] > 120000) { 
    performTask(userId);
    delete timeoutTimes[userId]; 
    }
}}, 10000);