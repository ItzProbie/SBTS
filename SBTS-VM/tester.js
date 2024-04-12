const poly = require("polyline");
const axios = require("axios");

exports.call = async ({ coordinates, userId }) => {
    try {
console.log(coordinates);
const polyline = poly.encode(coordinates);
console.log(polyline);

const res = await axios.post(
"https://sbts-be.vercel.app/api/v1/map/tollCalculator",
{
polyline,
userId,
}
);

console.log(res?.data?.tolls);
    } catch (err) {
console.error(err.message);
    }
  };