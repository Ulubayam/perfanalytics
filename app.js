var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var metricsRouter = require('./routes/metrics');

require('dotenv').config()
var db = require('./db')
db()
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cors
var cors = require('cors')
app.use(cors())

app.use('/', indexRouter);
app.use('/metrics', metricsRouter);

app.use(express.static(path.join(__dirname, './perfanalytics-dashboard/build')));
['/dashboard', '/dashboard/*'].forEach(p => {
  app.get(p, (req, res) => {
    res.sendFile(path.resolve(__dirname, './perfanalytics-dashboard', 'build', 'index.html'));
  });
});

app.use(express.static(path.join(__dirname, './test-client-react/build')));
['/test', '/test/*'].forEach(p => {
  app.get(p, (req, res) => {
    res.sendFile(path.resolve(__dirname, './test-client-react', 'build', 'index.html'));
  });
});

app.get('/perfanalytics.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './perfanalytics-js', 'src', 'index.js'));
});

module.exports = app;
