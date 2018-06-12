import axios from 'axios';
import moment from 'moment';
class Tradier {
  constructor(accesstoken, _endpoint = '') {
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
    this._axios = axios.create({
      baseURL: this._host,
      timeout: 1000,
      headers: {
        "Authorization": `Bearer ${this.accesstoken}`
      }
    });

    // and one for the beta endpoints
    this._axiosBeta = axios.create({
      baseURL: this._hostBeta,
      timeout: 1000,
      headers: {
        "Authorization": `Bearer ${this.accesstoken}`
      }
    });
  }

  /**
   * Get quotes for an individual or multiple symbols.
   * Required:
   * @param {string} ticker A comma delimited list of symbols, both equity and option symbols are accepted.
   */
  quote(ticker) {
    return this._axios.get('markets/quotes', { params: { symbols: ticker } })
      .then(response => {
        const { quotes } = response.data;
        return new Promise((resolve, reject) => {
          if (quotes) {
            resolve(quotes);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
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
  timesales(ticker, opts = {}) {
    let params = { symbols: opts.symbols || ticker };
    if (opts.interval) params.interval = opts.interval;
    if (opts.start) params.start = moment(opts.start).format('YYYY-MM-DD HH:mm');
    if (opts.end) params.end = moment(opts.end).format('YYYY-MM-DD HH:mm');
    if (opts.session_filter) params.session_filter = opts.session_filter;

    return this._axios.get('markets/timesales', { params: params })
      .then(response => {
        const { series } = response.data;
        return new Promise((resolve, reject) => {
          if (series) {
            resolve(series);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Get an option chain.
   * Required:
   * @param {string} ticker The requested symbol
   * @param {datetime} expiration The expiration date to obtain strikes for, respresented as YYYY-MM-DD.
   */
  optionchain(ticker, expiration) {
    let params = { symbol: ticker, expiration: moment(expiration).format('YYYY-MM-DD') };
    return this._axios.get('markets/options/chains', { params: params })
      .then(response => {
        const { options } = response.data;
        return new Promise((resolve, reject) => {
          if (options) {
            resolve(options);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Get an option's strike prices.
   * Required:
   * @param {string} ticker The requested symbol
   * @param {datetime} expiration The expiration date to obtain strikes for, respresented as YYYY-MM-DD.
   */
  optionstrikes(ticker, expiration) {
    return this._axios.get('markets/options/strikes', { params: { symbol: ticker, expiration: expiration } })
      .then(response => {
        const { strikes } = response.data;
        return new Promise((resolve, reject) => {
          if (strikes) {
            resolve(strikes);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Get an option's expiration dates.
   * Required:
   * @param {string} ticker The requested symbol
   */
  optionexpirations(ticker) {
    return this._axios.get('markets/options/expirations', { params: { symbols: ticker } })
      .then(response => {
        const { expirations } = response.data;
        return new Promise((resolve, reject) => {
          if (expirations) {
            resolve(expirations);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
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
  historical(ticker) {
    return this._axios.get('markets/history', { params: { symbols: ticker } })
      .then(response => {
        const { history } = response.data;
        return new Promise((resolve, reject) => {
          if (history) {
            resolve(history);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Get the intraday market status. This call will change and return information pertaining to the current day.
   */
  intradaystatus() {
    return this._axios.get('markets/clock')
      .then(response => {
        const { data } = response;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Get the market calendar for a given month.
   * Optional:
   * @param {int} month Month of the calendar requested.
   * @param {int} year Year of the calendar requested.
   */
  marketcalendar(month = null, year = null) {
    let params = {};
    if (month && !isNaN(month)) params.month = month;
    if (year && !isNaN(year)) params.year = year;
    return this._axios.get('markets/calendar', { params: params })
      .then(response => {
        const { data } = response;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  companysearch(ticker) {
    return this._axios.get('markets/search', { params: { q: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCompanyInfo(ticker) {
    // we use a separate axios, as we need the beta endpoint
    return this._axiosBeta.get('markets/fundamentals/company', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCorporateCalendar(ticker) {
    return this._axiosBeta.get('markets/fundamentals/calendars', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getDividendInfo(ticker) {
    return this._axiosBeta.get('markets/fundamentals/dividends', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCorporateActions(ticker) {
    return this._axiosBeta.get('markets/fundamentals/corporate_actions', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getRatios(ticker) {
    return this._axiosBeta.get('markets/fundamentals/ratios', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCorporateFinancials(ticker) {
    return this._axiosBeta.get('markets/fundamentals/financials', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getPriceStats(ticker) {
    return this._axiosBeta.get('markets/fundamentals/statistics', { params: { symbols: ticker } })
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _throw(e) {
    if (typeof e === 'string') {
      e = "Tradier Client | " + e;
    } else {
      throw e;
    }
  }

  lookup(queryParams = {}) {
    //TODO: use module for building query
    const params = Object.assign({
      q: null,
      exchanges: [],
      types: [],
    }, queryParams);
    const { q, exchanges, types } = params;
    const filteredQuery = [
      q !== null && `q=${q}` || null,
      exchanges.length !== 0 && `exchanges=${exchanges.join(',')}` || null,
      types.length !== 0 && `types=${types.join(',')}` || null,
    ];
    const query = filteredQuery.filter(q => q !== null).join('&');
    return this._axios.get(`markets/lookup?${query}`)
      .then(response => {
        const { data } = response;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          } else {
            let error = new Error();
            reject(error);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

module.exports = Tradier;