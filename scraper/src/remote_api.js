'use strict'

const Sleep = require('sleep')
const request = require('request-promise-native')
const Price = require('./models.js').Price

function RemoteAPI() {
  this.beginingTimestamp = (new Date("2016-09-01").valueOf() / 1000)
  this.endingTimestamp = (new Date("2017-06-19").valueOf() / 1000)
}

RemoteAPI.prototype.fetchPriceHistory = async function(insertionManyPrices) {
  var timestamp = this.endingTimestamp
  while (timestamp >= this.beginingTimestamp) {
    const url = "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=EUR&toTs=" + timestamp
    const str = await request(url)
    const tuple = this.deserializeRequest(str)
    await insertionManyPrices(tuple.prices)
    timestamp = tuple.firstTimestamp // decrementation
    this.updateProgress(timestamp, tuple.prices)
    Sleep.sleep(2) // To avoid DoS
  }
}

RemoteAPI.prototype.updateProgress = function(timestamp, prices) {
  const relativeTimestamp = timestamp - this.beginingTimestamp
  const relativeEndingTimestamp = this.endingTimestamp - this.beginingTimestamp
  // The timestamp is decremented from endingTimestamp to beginingTimestamp
  // So the numerator of the progression is inversed.
  const progress = (relativeEndingTimestamp - relativeTimestamp) / relativeEndingTimestamp
  const percent = progress * 100
  const percentInt = Math.trunc(percent)
  const date = new Date(timestamp * 1000)
  const dateString = date.toISOString().substring(0, 10)
  console.log("Progress: " + percentInt + "%\tInsert price from " + dateString + "\t" + prices.length + " items")
}

RemoteAPI.prototype.deserializeRequest = function(str) {
  const json = JSON.parse(str)
  const firstTimestamp = json["TimeFrom"]
  const rawPrices = json["Data"]
  const prices = rawPrices.map(function(rawPrice) {
    const time = rawPrice["time"]
    const close = rawPrice["close"]
    const high = rawPrice["high"]
    const low = rawPrice["low"]
    const open = rawPrice["open"]
    const volumeFrom = rawPrice["volumefrom"]
    const volumeTo = rawPrice["volumeto"]
    const price = new Price(time, close, high, low, open, volumeFrom, volumeTo)
    return price
  })
  return { prices: prices, firstTimestamp: firstTimestamp }
}

module.exports = RemoteAPI
