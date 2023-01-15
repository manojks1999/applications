const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()


module.exports.connect = () => mongoose.connect('mongodb://localhost:27017/test');
module.exports.disconnect = () => mongoose.disconnect();