'use strict'

function Price(timestamp, close, high, low, open, volumeFrom, volumeTo) {
  this.timestamp = timestamp
  this.close = close
  this.high = high
  this.low = low
  this.open = open
  this.volumeFrom = volumeFrom
  this.volumeTo = volumeTo
}

module.exports = { Price }
