const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config()
const app = express();

//Applying middlewares
app.use(...require('./middlewares'))

//Connecting to mongoDb
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/reunion",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).then(() => {
    //Middleware routes for /api path
    const userRoutes = require('./routes/userRoutes');
    const postRoutes = require('./routes/postRoutes');
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
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