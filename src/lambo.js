import RSI from './indicators/rsi'
import ExchangeAPI from './services/exchange-api'
import Moon from './strategies/moon'

export default class Lambo {
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
