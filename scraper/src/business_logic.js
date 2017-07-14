'use strict'

const config = require('../config.js')
const Promise = require('promise')

const Database = require('./database.js')
const Price = require('./models.js').Price
const RemoteAPI = require('./remote_api.js')

const databaseURL = config.mongodb.url
const database = new Database(databaseURL)
const remoteAPI = new RemoteAPI()

function get_history_hour() {
  const start = new Promise(function (resolve, reject) {
    console.info("Inserting price history.")
    resolve()
  })
  return start.then(function() {
    return database.connect()
  }).then(function() {
    return database.clear()
  }).then(function(db) {
    return remoteAPI.fetchPriceHistory(function(prices) {
      return database.insertPrices(prices)
    })
  }).finally(function() {
    database.disconnect()
  }).then(function(prices) {
    console.log("[SUCCESS] Has inserted price history.")
    process.exit(0)
  }).catch(function(error) {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { get_history_hour }
