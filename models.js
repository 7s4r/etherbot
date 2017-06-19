'use strict'

function Price(timestamp, value) {
  this.timestamp = timestamp
  this.value = value
}

function Serializer() {
}

Serializer.prototype.deserialisePrice = function(raw) {
  const timestamp = raw['time']
  const usd = raw['usd']
  return new Price(timestamp, usd)
}

Serializer.prototype.deserialiseKrakenPrice = function(raw) {
  const isValid = Array.isArray(raw) && (raw.length == 3)
  if (!isValid) {
    throw new Error("Price raw data is crappy: " + raw)
  }
  return new Price(raw[0], raw[1], raw[2])
}

module.exports = { Price, Serializer }
