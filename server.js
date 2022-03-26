const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config()
const app = express();

//Using middlewares
app.use(...require('./middlewares'))

//connecting to mongoDb
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/reunion",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).then(() => {
    //Middleware routes for /api path
    const userRoutes = require('./routes/userRoutes')
    app.use('/users', userRoutes);
    console.log("Successfully connected to the database");
}).catch((err) => {
    console.log("Could not connect to the database. ", err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({
        'message': 'Server is up and running'
    })
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port} \nhttp://localhost:8080/`);
})