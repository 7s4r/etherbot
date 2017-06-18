'use strict'

var config = require('config')
const Promise = require('promise')

const Database = require('./database.js')
const Serializer = require('./models.js').Serializer
const Price = require('./models.js').Price
const RemoteAPI = require('./remote_api.js')

const databaseURL = config.get('mongodb.url')
const database = new Database(databaseURL)
const remoteAPI = new RemoteAPI()
const serializer = new Serializer()

const start = new Promise(function (resolve, reject) {
  console.info("Inserting first page of prices done.")
  resolve()
})

start.then(function() {
  return database.connect()
}).then(function(db) {
  return remoteAPI.getFirstPagePrice()
}).then(function(rawPrices) {
  const prices = rawPrices['XETHZEUR'].map(function(rawPrice) {
    return serializer.deserialisePrice(rawPrice)
  })
  return prices
}).then(function(prices) {
  return database.insertPrices(prices)
}).finally(function() {
  database.disconnect()
}).then(function(prices) {
  console.log("[SUCCESS] Insert first page of prices done.")
  process.exit(0)
}).catch(function(error) {
  console.error(error)
  process.exit(1)
})
