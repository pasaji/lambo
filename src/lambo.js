const { RSI, CCI, SMA, EMA, BB, ADX, MACD, VWAP, ATR, FI } = require('./indicators')
const { ExchangeAPI } = require('./services')
const Moon = require('./strategies/moon')

class Lambo {
  constructor({ keychain = {} }) {
    this.keychain = keychain
    this.strategy = {}
  }

  start() {
    console.log('-- START LAMBO --')

    const api = new ExchangeAPI({ keychain: this.keychain })

    const rsi = new RSI()
    const cci = new CCI()
    const sma = new SMA()
    const ema21 = new EMA({ period: 21, suffix: 'Slow' })
    const ema9 = new EMA({ period: 9, suffix: 'Fast' })
    const bb = new BB({ period: 9 })
    const macd = new MACD()
    const adx = new ADX()
    const vwap = new VWAP()
    const atr = new ATR()
    const fi = new FI()

    const moon = this.strategy = new Moon()

    api.readOHLCV({ exchange: 'poloniex', market: 'ETH/USDT' })
      .pipe(rsi)
      .pipe(cci)
      .pipe(sma)
      .pipe(ema21)
      .pipe(ema9)
      .pipe(bb)
      .pipe(macd)
      .pipe(adx)
      .pipe(vwap)
      .pipe(atr)
      .pipe(fi)
      .pipe(moon.ohlcv())
  }

  stop() {
    console.log('-- MOON? --')
  }

  getState() {
    return this.strategy.getState()
  }
}

module.exports = Lambo
