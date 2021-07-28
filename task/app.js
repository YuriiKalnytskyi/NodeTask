const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: '../.env' });

const { constant: { PORT, DB_CONNECTION_URL } } = require('./constants');
const { errorMess: { UNKNOWN_ERROR, ROUTE_NOT_FOUND } } = require('./errors');
const { apiRouter } = require('./routes');

const app = express();

_mongooseConnector();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

app.use(fileUpload({}));
app.use('/', apiRouter);
app.use('*', _notFoundHandler);
app.use(_hadleErrors);

app.listen(PORT, () => {
  console.log(`app listen ${PORT} `);
});

// eslint-disable-next-line no-unused-vars
function _hadleErrors(err, req, res, next) {
  res
    .status(err.status)
    .json({
      message: err.message || UNKNOWN_ERROR.message,
      customCode: err.code || UNKNOWN_ERROR.code
    });
}

function _notFoundHandler(err, req, res, next) {
  next({
    message: err.message || ROUTE_NOT_FOUND.message,
    status: err.status || ROUTE_NOT_FOUND.code
  });
}
function _mongooseConnector() {
  mongoose.connect(DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}
