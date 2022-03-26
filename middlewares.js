const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config()


const corsOptions = {
    origin: "http://localhost:3000" || process.env.CLIENT_SIDE_URL
};
module.exports = [bodyParser.json(), bodyParser.urlencoded({ extended: true }), cors(corsOptions)];