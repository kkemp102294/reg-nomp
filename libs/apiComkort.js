var request = require('request');
var nonce   = require('nonce');

module.exports = function() {
    'use strict';

    // Module dependencies


    ///////////////////////////////////////////
    //  PRIVATE METHODS HAVE NOT BEEN ADDED  //
    ///////////////////////////////////////////
    //
    //
    ////////////////
    // CONSTANTS  //
    ////////////////
    var version         = '0.1.0',
        PUBLIC_API_URL  = 'https://api.comkort.com/v1/public',
        PRIVATE_API_URL = 'https://api.cryptsy.com/api',
        USER_AGENT      = 'nomp/node-open-mining-portal'
    //
    //
    ///////////////////
    //  CONSTRUCTOR  //
    ///////////////////
    function Comkort(key, secret){
        // Generate headers signed by this user's key and secret.
        // The secret is encapsulated and never exposed
        this._getPrivateHeaders = function(parameters){
            var paramString, signature;

            if (!key || !secret){
                throw 'Comkort: Error. API key and secret required';
            }

            // Sort parameters alphabetically and convert to `arg1=foo&arg2=bar`
            paramString = Object.keys(parameters).sort().map(function(param){
                return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
            }).join('&');

            signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');

            return {
                Key: key,
                Sign: signature
            };
        };
    }
    //
    //
    ///////////
    //  SSL  //  If a site uses non-trusted SSL certificates, set this value to false
    ///////////
    Comkort.STRICT_SSL = true;
    //
    //
    /////////////////////
    // HELPER METHODS  //
    /////////////////////
    function joinCurrencies(currencyA, currencyB){
        return currencyA + '_' + currencyB;
    }
    //
    //
    /////////////////
    //  PROTOTYPE  //
    /////////////////
    Comkort.prototype = {
        constructor: Comkort,

        // Make an API request
        _request: function(options, callback){
            if (!('headers' in options)){
                options.headers = {};
            }

            options.headers['User-Agent'] = USER_AGENT;
            options.json = true;
            options.strictSSL = Comkort.STRICT_SSL;

            request(options, function(err, response, body) {
                callback(err, body);
            });

            return this;
        },

        // Make a public API request
        _public: function(parameters, callback, theUrl){
            var options = {
                method: 'GET',
                url: theUrl,
                qs: parameters
            };

            return this._request(options, callback);
        },

        // Make a private API request
        // _private: function(parameters, callback){  //  DO NOT USE THIS YET!!!!!!!
        //     var options;
        //
        //     parameters.nonce = nonce();
        //     options = {
        //         method: 'POST',
        //         url: PRIVATE_API_URL,
        //         form: parameters,
        //         headers: this._getPrivateHeaders(parameters)
        //     };
        //
        //     return this._request(options, callback);
        // },
        //
        //
        //
        /////////////////////
        // PUBLIC METHODS  //
        /////////////////////
        getTicker: function(callback){
            var theUrl = PUBLIC_API_URL + '/market/summary';
            // var url = 'https://api.comkort.com/v1/public/market/list';
            var options = {
                method: 'GET',
                // url: theUrl
                // qs: null
            };

            return this._public(options, callback, theUrl)
            // console.log(this._request(options, callback));
        },

        // getMarketSummary: function(ticker, callback) {
        //     var theUrl = PUBLIC_API_URL + "/market/summary?" + ticker;
        //     var options = {
        //         method: 'GET',
        //         // url: theUrl
        //         // qs: null
        //     };
        //     console.log('bang');
        //
        //     return this._public(options, callback, theUrl)
        // },


        getOrderBook: function(currencyA, currencyB, callback){
          var url = PUBLIC_API_URL + '/market/summary?market_alias=' + currencyA + '_' + currencyB;
            var parameters = {
                    command: 'GET',
                    // url: PUBLIC_API_URL + '/depth/' + currencyA + '_' + currencyB
                    // currencyPair: joinCurrencies(currencyA, currencyB)
                };

            return this._public(parameters, callback, url);
        },

        getTradeHistory: function(currencyA, currencyB, callback){
            var parameters = {
                    command: 'returnTradeHistory',
                    currencyPair: joinCurrencies(currencyA, currencyB)
                };

            return this._public(parameters, callback);
        },
        //
        //
        //
        //////////////////////
        // PRIVATE METHODS  //
        //////////////////////
        // myBalances: function(callback){
        //     var parameters = {
        //             command: 'returnBalances'
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // myOpenOrders: function(currencyA, currencyB, callback){
        //     var parameters = {
        //             command: 'returnOpenOrders',
        //             currencyPair: joinCurrencies(currencyA, currencyB)
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // myTradeHistory: function(currencyA, currencyB, callback){
        //     var parameters = {
        //             command: 'returnTradeHistory',
        //             currencyPair: joinCurrencies(currencyA, currencyB)
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // buy: function(currencyA, currencyB, rate, amount, callback){
        //     var parameters = {
        //             command: 'buy',
        //             currencyPair: joinCurrencies(currencyA, currencyB),
        //             rate: rate,
        //             amount: amount
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // sell: function(currencyA, currencyB, rate, amount, callback){
        //     var parameters = {
        //             command: 'sell',
        //             currencyPair: joinCurrencies(currencyA, currencyB),
        //             rate: rate,
        //             amount: amount
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // cancelOrder: function(currencyA, currencyB, orderNumber, callback){
        //     var parameters = {
        //             command: 'cancelOrder',
        //             currencyPair: joinCurrencies(currencyA, currencyB),
        //             orderNumber: orderNumber
        //         };
        //
        //     return this._private(parameters, callback);
        // },
        //
        // withdraw: function(currency, amount, address, callback){
        //     var parameters = {
        //             command: 'withdraw',
        //             currency: currency,
        //             amount: amount,
        //             address: address
        //         };
        //
        //     return this._private(parameters, callback);
        // }
        //
        //
    };
    //
    //
    return Comkort;
    //
    //
    //
}();
