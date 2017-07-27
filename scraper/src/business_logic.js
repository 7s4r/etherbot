const config = require('../config.js')

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
  })
  // finally
  .then(disconnect)
  .catch(disconnect)
}

function disconnect() {
  database.disconnect()
  console.log("[SUCCESS] Has inserted price history.")
}

module.exports = { get_history_hour }
