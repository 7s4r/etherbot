var KrakenClient = require('kraken-api')
var config = require('config')

var krakenApiKey = config.get('kraken.api_key')
var krakenApiSecret = config.get('kraken.api_secret')
var kraken = new KrakenClient(krakenApiKey, krakenApiSecret);

kraken.api('Spread', {"pair": 'ETHEUR'}, function(error, data) {
    if(error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
