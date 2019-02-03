const express = require('express');
const path = require('path');
const router = require('./router');
const { API, PORT, PUPBLIC_PATH } = require('./consts');

const app = express();

app.use(express.static(path.resolve(__dirname, PUPBLIC_PATH)));
app.use(API.PATH, router.api);
app.use('*', (req, res) => res.sendFile(path.resolve(__dirname, PUPBLIC_PATH, 'index.html')));

module.exports.run = cb => app.listen(PORT, cb);
