import axios from 'axios';
import moment from 'moment';
import queryString from 'query-string';

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

  quote(ticker) {
    return this._axios.get(`markets/quotes?symbols=${ticker}`)
      .then(response => {
        const { quotes } = response.data;
        return new Promise((resolve, reject) => {
          if (quotes) {
            resolve(quotes)
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

  timesales(ticker) {
    return this._axios.get(`markets/timesales?symbol=${ticker}`)
      .then(response => {
        const { series } = response.data;
        return new Promise((resolve, reject) => {
          if (series) {
            resolve(series)
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

  optionchain(ticker, expiration) {
    return this._axios.get(`markets/options/chains?symbol=${ticker}&expiration=${expiration}`)
      .then(response => {
        const { options } = response.data;
        return new Promise((resolve, reject) => {
          if (options) {
            resolve(options)
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

  optionstrikes(ticker, expiration) {
    return this._axios.get(`markets/options/strikes?symbol=${ticker}&expiration=${expiration}`)
      .then(response => {
        const { strikes } = response.data;
        return new Promise((resolve, reject) => {
          if (strikes) {
            resolve(strikes)
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

  optionexpirations(ticker) {
    return this._axios.get(`markets/options/expirations?symbol=${ticker}`)
      .then(response => {
        const { expirations } = response.data;
        return new Promise((resolve, reject) => {
          if (expirations) {
            resolve(expirations)
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

  historical(ticker, opts = {}) {

    opts.symbol = opts.symbol || ticker;
    if (opts.start)
      opts.start = moment(opts.start).format('YYYY-MM-DD');
    if (opts.end)
      opts.end = moment(opts.end).format('YYYY-MM-DD');

    return this._axios.get(`markets/history?${queryString.stringify(opts)}`)
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


  intradaystatus() {
    return this._axios.get(`markets/clock`)
      .then(response => {
        const { data } = response;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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

  marketcalendar() {
    return this._axios.get(`markets/calendar`)
      .then(response => {
        const { data } = response;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axios.get(`markets/search?q=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/company?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/calendars?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/dividends?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/corporate_actions?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/ratios?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/financials?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
    return this._axiosBeta.get(`markets/fundamentals/statistics?symbols=${ticker}`)
      .then(response => {
        const { data } = response.data;
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data)
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
            resolve(data)
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