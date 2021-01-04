const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

cloudinary.config({
    cloud_name: dotenv.PROCESS.cloud_name,
    api_key: dotenv.PROCESS.api_key,
    api_secret: dotenv.PROCESS.api_secret
});

module.exports = cloudinary;
