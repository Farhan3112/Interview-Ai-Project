//only need for deployement
const path = require("path");

module.exports = {
    cacheDirectory: path.join(__dirname, ".cache", "puppeteer"),
};