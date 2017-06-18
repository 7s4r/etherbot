'use strict'

function Price(timestamp, bit, ask) {
  this.timestamp = timestamp
  this.bit = bit
  this.ask = ask
}

function Serializer() {
}

Serializer.prototype.deserialisePrice = function(raw) {
  const isValid = Array.isArray(raw) && (raw.length == 3)
  if (!isValid) {
    throw new Error("Price raw data is crappy: " + raw)
  }
  return new Price(raw[0], raw[1], raw[2])
}

module.exports = { Price, Serializer }
