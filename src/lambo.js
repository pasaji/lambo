const { RSI, SMA, EMA, BB } = require('./indicators')
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
    const sma = new SMA()
    const ema21 = new EMA({ period: 21, suffix: 'Slow' })
    const ema9 = new EMA({ period: 9, suffix: 'Fast' })
    const bb = new BB({ period: 9 })

    const moon = new Moon()

    api.readOHLCV({ exchange: 'poloniex', market: 'ETH/USDT' })
      .pipe(rsi)
      .pipe(sma)
      .pipe(ema21)
      .pipe(ema9)
      .pipe(bb)
      .pipe(moon.ohlcv())
  }

  stop() {
    console.log('-- MOON? --')
  }
}

module.exports = Lambo
