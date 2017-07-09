'use strict'

const express = require('express')
const get_history_hour = require('./business_logic.js').get_history_hour
const app = express()

app.get('/history/hours', function (req, res, next) {
  get_history_hour() // Aynchronous
  next()
}, function (req, res, next) {
  res.send('Launched')
})

app.listen(4000)
