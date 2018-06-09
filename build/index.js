'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tradier = function () {
  function Tradier(accesstoken) {
    var _endpoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Tradier);

    this.accesstoken = accesstoken;
    this._endpoint = _endpoint.toLowerCase();
    this._host = 'https://api.tradier.com/v1/';
    this._hostBeta = 'https://api.tradier.com/beta/';

    if (!this.accesstoken) {
      this._throw('Need a valid accesstoken');
    }
    if (this._endpoint === 'sandbox') {
      this._host = 'https://sandbox.tradier.com/v1/';
    }

    // create an axios instance
    this._axios = _axios2.default.create({
      baseURL: this._host,
      timeout: 1000,
      headers: {
        "Authorization": 'Bearer ' + this.accesstoken
      }
    });

    // and one for the beta endpoints
    this._axiosBeta = _axios2.default.create({
      baseURL: this._hostBeta,
      timeout: 1000,
      headers: {
        "Authorization": 'Bearer ' + this.accesstoken
      }
    });
  }

  _createClass(Tradier, [{
    key: 'quote',
    value: function quote(ticker) {
      return this._axios.get('markets/quotes?symbols=' + ticker).then(function (response) {
        var quotes = response.data.quotes;

        return new Promise(function (resolve, reject) {
          if (quotes) {
            resolve(quotes);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'timesales',
    value: function timesales(ticker) {
      return this._axios.get('markets/timesales?symbol=' + ticker).then(function (response) {
        var series = response.data.series;

        return new Promise(function (resolve, reject) {
          if (series) {
            resolve(series);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'optionchain',
    value: function optionchain(ticker, expiration) {
      return this._axios.get('markets/options/chains?symbol=' + ticker + '&expiration=' + expiration).then(function (response) {
        var options = response.data.options;

        return new Promise(function (resolve, reject) {
          if (options) {
            resolve(options);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'optionstrikes',
    value: function optionstrikes(ticker, expiration) {
      return this._axios.get('markets/options/strikes?symbol=' + ticker + '&expiration=' + expiration).then(function (response) {
        var strikes = response.data.strikes;

        return new Promise(function (resolve, reject) {
          if (strikes) {
            resolve(strikes);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'optionexpirations',
    value: function optionexpirations(ticker) {
      return this._axios.get('markets/options/expirations?symbol=' + ticker).then(function (response) {
        var expirations = response.data.expirations;

        return new Promise(function (resolve, reject) {
          if (expirations) {
            resolve(expirations);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'historical',
    value: function historical(ticker) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      opts.symbol = ticker;
      opts.interval = opts.interval | 'daily';
      opts.start = opts.start | (0, _moment2.default)(opts.start).format('YYYY-MM-DD');
      opts.end = opts.end | (0, _moment2.default)(opts.end).format('YYYY-MM-DD');

      return this._axios.get('markets/history?' + _queryString2.default.stringify(opts)).then(function (response) {
        var history = response.data.history;

        return new Promise(function (resolve, reject) {
          if (history) {
            resolve(history);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'intradaystatus',
    value: function intradaystatus() {
      return this._axios.get('markets/clock').then(function (response) {
        var data = response.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'marketcalendar',
    value: function marketcalendar() {
      return this._axios.get('markets/calendar').then(function (response) {
        var data = response.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'companysearch',
    value: function companysearch(ticker) {
      return this._axios.get('markets/search?q=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getCompanyInfo',
    value: function getCompanyInfo(ticker) {
      // we use a separate axios, as we need the beta endpoint
      return this._axiosBeta.get('markets/fundamentals/company?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getCorporateCalendar',
    value: function getCorporateCalendar(ticker) {
      return this._axiosBeta.get('markets/fundamentals/calendars?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getDividendInfo',
    value: function getDividendInfo(ticker) {
      return this._axiosBeta.get('markets/fundamentals/dividends?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getCorporateActions',
    value: function getCorporateActions(ticker) {
      return this._axiosBeta.get('markets/fundamentals/corporate_actions?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getRatios',
    value: function getRatios(ticker) {
      return this._axiosBeta.get('markets/fundamentals/ratios?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getCorporateFinancials',
    value: function getCorporateFinancials(ticker) {
      return this._axiosBeta.get('markets/fundamentals/financials?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'getPriceStats',
    value: function getPriceStats(ticker) {
      return this._axiosBeta.get('markets/fundamentals/statistics?symbols=' + ticker).then(function (response) {
        var data = response.data.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: '_throw',
    value: function _throw(e) {
      if (typeof e === 'string') {
        e = "Tradier Client | " + e;
      } else {
        throw e;
      }
    }
  }, {
    key: 'lookup',
    value: function lookup() {
      var queryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      //TODO: use module for building query
      var params = Object.assign({
        q: null,
        exchanges: [],
        types: []
      }, queryParams);
      var q = params.q,
          exchanges = params.exchanges,
          types = params.types;

      var filteredQuery = [q !== null && 'q=' + q || null, exchanges.length !== 0 && 'exchanges=' + exchanges.join(',') || null, types.length !== 0 && 'types=' + types.join(',') || null];
      var query = filteredQuery.filter(function (q) {
        return q !== null;
      }).join('&');
      return this._axios.get('markets/lookup?' + query).then(function (response) {
        var data = response.data;

        return new Promise(function (resolve, reject) {
          if (data) {
            resolve(data);
          } else {
            var error = new Error();
            reject(error);
          }
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }]);

  return Tradier;
}();

module.exports = Tradier;