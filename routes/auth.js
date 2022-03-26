const jwt = require('jsonwebtoken');
const { parsed: { SECRET_KEY } } = require('dotenv').config();
module.exports = function (req, res, next) {
    try {
        const token = req.header('authorization');
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
};