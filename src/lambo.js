const { RSI } = require('./indicators')
const { ExchangeAPI } = require('./services')
const Moon = require('./strategies/moon')

class Lambo {
  constructor({ keychain = {} }) {
    this.keychain = keychain
  }

  start() {
    console.log('-- START LAMBO --')

    const api = new ExchangeAPI({ keychain: this.keychain })
    const rsi = new RSI()
    const moon = new Moon()

    api.readOHLCV({ exchange: 'poloniex', market: 'ETH/USDT' })
      .pipe(rsi)
      .pipe(moon.writeOHLCV())      
  }

  stop() {
    console.log('-- MOON? --')
  }
}

module.exports = Lambo
