'use strict'

const Sleep = require('sleep')
const request = require('request-promise-native')
const Price = require('./models.js').Price

function RemoteAPI() {
  this.beginingTimestamp = (new Date("2017-06-15").valueOf() / 1000)
  this.endingTimestamp = (new Date("2017-06-19").valueOf() / 1000)
  this.timestampIncrement = 60 * 60 // 1 hour
}

RemoteAPI.prototype.fetchPriceHistory = async function(insertion) {
  for ( var timestamp = this.beginingTimestamp;
        timestamp <= this.endingTimestamp;
        timestamp += this.timestampIncrement) {
    const url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&markets=Kraken&ts=" + timestamp
    const str = await request(url)
    const price = this.deserializeRequest(str, timestamp)
    await insertion(price)

    this.updateProgress(timestamp, price)
    Sleep.sleep(2) // To avoid DoS
  }
}

RemoteAPI.prototype.updateProgress = function(timestamp, price) {
  const priceStr = JSON.stringify(price)
  const progress = (timestamp - this.beginingTimestamp) / (this.endingTimestamp - this.beginingTimestamp)
  const percent = progress * 100
  const percentInt = Math.trunc(percent)
  console.log("Progress: " + percentInt + "%\tInsert price: " + priceStr)
}

RemoteAPI.prototype.deserializeRequest = function(str, timestamp) {
  const json = JSON.parse(str)
  const value = json["ETH"]["EUR"]
  const price = new Price(timestamp, value)
  return price
}

module.exports = RemoteAPI
