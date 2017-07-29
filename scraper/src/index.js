const express = require('express')
const getHistoryHour = require('./business_logic.js').getHistoryHour
const app = express()

app.get('/history/hours', function (req, res, next) {
  getHistoryHour() // Aynchronous
  next()
}, function (req, res, next) {
  res.send('Launched')
})

app.listen(4000)
