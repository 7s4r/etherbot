'use strict'

const KrakenClient = require('kraken-api')
const Promise = require('promise')

function RemoteAPI() {
  this.client = new KrakenClient("blabla", "blabla");
}

RemoteAPI.prototype.getFirstPagePrice = function() {
  const self = this
	const promise = new Promise(function (resolve, reject) {
    self.client.api('Spread', {"pair": 'ETHEUR'}, function(error, data) {
        if(error) {
            reject(err)
        } else {
          resolve(data.result)
        }
    })
	})
	return promise
}

module.exports = RemoteAPI
