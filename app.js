require('dotenv').config();
require('./models/connection');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
app.use(cors());

const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profiles');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);

module.exports = app;