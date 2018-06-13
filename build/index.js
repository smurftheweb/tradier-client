'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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
        "Authorization": 'Bearer ' + this.accesstoken,
        "Accept": "application/json"
      }
    });

    // and one for the beta endpoints
    this._axiosBeta = _axios2.default.create({
      baseURL: this._hostBeta,
      timeout: 1000,
      headers: {
        "Authorization": 'Bearer ' + this.accesstoken,
        "Accept": "application/json"
      }
    });
  }

  /**
   * Get quotes for an individual or multiple symbols.
   * Required:
   * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
   */


  _createClass(Tradier, [{
    key: 'quote',
    value: function quote(ticker) {
      return this._axios.get('markets/quotes', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get time and sales for a given symbol.
     * Required:
     * @param {string} ticker The requested symbol
     * Optional: 
     * @param {string} interval The interval of time from timesales pricing. One of tick, 1min, 5min, 15min (default: tick)
     * @param {datetime} start Start datetime for timesales range represented as YYYY-MM-DD HH:MM
     * @param {datetime} end End datetime for timesales range represented as YYYY-MM-DD HH:MM
     * @param {string} session_filter The session conditions to requested data for. 
     *                                'all' for all available data points (default)
     *                                'open' for data points within open market hours only
     */

  }, {
    key: 'timesales',
    value: function timesales(ticker) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var params = { symbols: opts.symbols || ticker };
      if (opts.interval) params.interval = opts.interval;
      if (opts.start) params.start = (0, _moment2.default)(opts.start).format('YYYY-MM-DD HH:mm');
      if (opts.end) params.end = (0, _moment2.default)(opts.end).format('YYYY-MM-DD HH:mm');
      if (opts.session_filter) params.session_filter = opts.session_filter;

      return this._axios.get('markets/timesales', { params: params }).then(function (response) {
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

    /**
     * Get an option chain.
     * Required:
     * @param {string} ticker The requested symbol
     * @param {datetime} expiration The expiration date to obtain strikes for, respresented as YYYY-MM-DD.
     */

  }, {
    key: 'optionchain',
    value: function optionchain(ticker, expiration) {
      var params = { symbol: ticker, expiration: (0, _moment2.default)(expiration).format('YYYY-MM-DD') };
      return this._axios.get('markets/options/chains', { params: params }).then(function (response) {
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

    /**
     * Get an option's strike prices.
     * Required:
     * @param {string} ticker The requested symbol
     * @param {datetime} expiration The expiration date to obtain strikes for, respresented as YYYY-MM-DD.
     */

  }, {
    key: 'optionstrikes',
    value: function optionstrikes(ticker, expiration) {
      return this._axios.get('markets/options/strikes', { params: { symbol: ticker, expiration: expiration } }).then(function (response) {
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

    /**
     * Get an option's expiration dates.
     * Required:
     * @param {string} ticker The requested symbol
     */

  }, {
    key: 'optionexpirations',
    value: function optionexpirations(ticker) {
      return this._axios.get('markets/options/expirations', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get the historical pricing for a symbol.
     * Required:
     * @param {string} ticker The requested symbol
     * Optional:
     * @param {string} interval The interval of time for historical pricing, one of daily, weekly or monthly (default: daily)
     * @param {datetime} start Start datetime for timesales range represented as YYYY-MM-DD
     * @param {datetime} end End datetime for timesales range represented as YYYY-MM-DD
     */

  }, {
    key: 'historical',
    value: function historical(ticker) {
      return this._axios.get('markets/history', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get the intraday market status. This call will change and return information pertaining to the current day.
     */

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

    /**
     * Get the market calendar for a given month.
     * Optional:
     * @param {int} month Month of the calendar requested.
     * @param {int} year Year of the calendar requested.
     */

  }, {
    key: 'marketcalendar',
    value: function marketcalendar() {
      var month = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var params = {};
      if (month && !isNaN(month)) params.month = month;
      if (year && !isNaN(year)) params.year = year;
      return this._axios.get('markets/calendar', { params: params }).then(function (response) {
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

    /**
     * You can search for a stock symbol using a keyword lookup on the symbols description. Results are ordered by average volume of the symbol.
     * Required:
     * @param {string} q A search keyword
     * Optional:
     * @param {boolean} indexes Include indexes in the results
     */

  }, {
    key: 'companysearch',
    value: function companysearch(q) {
      var indexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var params = { q: q };
      if (indexes) params.indexes = true;
      return this._axios.get('markets/search', { params: params }).then(function (response) {
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

    /**
     * Get company fundamental information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getCompanyInfo',
    value: function getCompanyInfo(ticker) {
      // we use a separate axios, as we need the beta endpoint
      return this._axiosBeta.get('markets/fundamentals/company', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get the corporate calendar information for a symbol
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getCorporateCalendar',
    value: function getCorporateCalendar(ticker) {
      return this._axiosBeta.get('markets/fundamentals/calendars', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get company dividend information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getDividendInfo',
    value: function getDividendInfo(ticker) {
      return this._axiosBeta.get('markets/fundamentals/dividends', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get corporate actions information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getCorporateActions',
    value: function getCorporateActions(ticker) {
      return this._axiosBeta.get('markets/fundamentals/corporate_actions', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get operation ratio information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getRatios',
    value: function getRatios(ticker) {
      return this._axiosBeta.get('markets/fundamentals/ratios', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get corporate financials information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getCorporateFinancials',
    value: function getCorporateFinancials(ticker) {
      return this._axiosBeta.get('markets/fundamentals/financials', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Get price statistics information
     * Required:
     * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
     */

  }, {
    key: 'getPriceStats',
    value: function getPriceStats(ticker) {
      return this._axiosBeta.get('markets/fundamentals/statistics', { params: { symbols: ticker } }).then(function (response) {
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

    /**
     * Lookup a symbol or partial symbol. Results are ordered by average volume of the symbol.
     * Inputs can be
     * - q: A symbol or partial symbol to look up
     * - exchanges: A comma-delimited list of exchange codes to query (i.e. Q,N)
     * - types: A comma-delimited list of security types to query (i.e. stock,etf)
     * @param {*} queryParams 
     */

  }, {
    key: 'lookup',
    value: function lookup() {
      var queryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      var parameterFound = false;
      var params = {};

      if (queryParams.q) {
        params.q = queryParams.q;
        parameterFound = true;
      }
      if (queryParams.exchanges && queryParams.exchanges.length !== 0) {
        params.exchanges = queryParams.exchanges.join(',');
        parameterFound = true;
      }
      if (queryParams.types && queryParams.types.length !== 0) {
        params.types = queryParams.types.join(',');
        parameterFound = true;
      }

      if (!parameterFound) _throw('No valid parameter specified');

      return this._axios.get('markets/lookup', { params: params }).then(function (response) {
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