const MongoClient = require('mongodb').MongoClient

function Database(url) {
	this.url = url
}

Database.prototype.connect = function() {
	const self = this
	const promise = new Promise(function (resolve, reject) {
		MongoClient.connect(self.url, function(err, db) {
			if (err) {
				reject(err)
			} else {
				self.db = db
				resolve(db)
			}
		})
	})
	return promise
}

Database.prototype.insertPrices = function(prices) {
	const self = this
	const promise = new Promise(function (resolve, reject) {
		self.db.collection('prices').insertMany(prices, function(err, result) {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
	  })
	})
	return promise
}

Database.prototype.clear = function() {
	const self = this
	const promise = new Promise(function (resolve, reject) {
		self.db.collection('prices').removeMany()
		resolve()
	})
	return promise
}

Database.prototype.disconnect = function() {
	this.db.close()
}

module.exports = Database
