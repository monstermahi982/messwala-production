// external imports
const serverless = require("serverless-http");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// internal imports
// const config = require('./Configs/index');
// const { PORT, DB_URL } = config;
const userAuthHandler = require('./src/Middlewares/userAuthHandler');
const commentRoutes = require('./src/Routers/commentRoutes');
const userRoutes = require('./src/Routers/userRoutes');
const ownerRoutes = require('./src/Routers/ownerRoutes');
const actionRoutes = require('./src/Routers/actionRoutes');
const adminMessRoutes = require('./src/Routers/adminMessRoutes');
const adminRoutes = require('./src/Routers/adminRoutes');
const messRoutes = require('./src/Routers/messRoutes');
const menuRoutes = require('./src/Routers/menuRoutes');
const itemRoutes = require('./src/Routers/itemRoutes');
const staticsRoutes = require('./src/Routers/staticsRoutes');
const adminMenuRoutes = require('./src/Routers/adminMenuRoutes');

const app = express();

const mode = process.env.MODE;

if (mode === 'dev') {
    // mongodb connection
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log('DB is connected :- ' + mode);
    })
} else if (mode === 'prod') {
    // mongodb connection
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log('DB is connected :- ' + mode);
    })
}



// cors
app.use(cors({ origin: ['http://localhost:3000', 'https://messwala-frontend.vercel.app', 'https://messwala-admin.vercel.app', 'https://messwala.online', 'https://www.messwala.online', 'https://appaadmin.messwala.online'] }))

// express congfi
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// routes
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/action', actionRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/admin/mess', adminMessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/static', staticsRoutes);
app.use('/api/admin/menu', adminMenuRoutes);

// error handlers
app.use(userAuthHandler);

if (mode === 'dev') {
    // app port
    app.listen((PORT), () => console.log(`listening on port ${PORT}`))
}

// sls app
module.exports.handler = serverless(app);