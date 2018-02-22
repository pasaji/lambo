const ccxt = require('ccxt')
const { Readable } = require('stream')
const { DAY, now } = require('../utils/time-utils')

class ExchangeAPI {
  constructor({ keychain = {} }) {
    this.keychain = keychain
  }

  readOHLCV({ exchange, market }) {
    const stream = new Readable({
      objectMode: true,
      read(size) {
        // this.push({ date: new Date().getTime() })
      }
    })
    const e = new ccxt[ exchange ]({ 'timeout': 30000 })
    e.fetchOHLCV(market, '5m', now() - DAY, 999).then((result) => {
      result.forEach((item) => {
        stream.push({ date: item[0], open: item[1], high: item[2], low: item[3], close: item[4], volume: item[5] })
      })
    }, (err) => {
      throw err
    });
    return stream
  }
}

module.exports = ExchangeAPI
