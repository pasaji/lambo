const { WEEK, DAY, now } = require('../utils/time-utils')

class ExchangeSimulator {
  constructor(options = {}) {
    this.exchanges = {}
    this.balance = {}
  }

  getExchange(id) {
    if (!this.exchanges.hasOwnProperty(id)) {
      this.exchanges[id] = {
        balance: {
          /*
          'BTC':   {           // string, three-letter currency code, uppercase
              'free': 321.00   // float, money available for trading
              'used': 234.00,  // float, money on hold, locked, frozen or pending
              'total': 555.00, // float, total balance (free + used)
          }
          */
        }
      }
    }
    return this.exchanges[id];
  }

  getCurrency(exchange, currency) {
    const e = this.getExchange(exchange)
    if (!e.hasOwnProperty(currency)) {
      e[currency] = {
        free: 0,
        user: 0,
        total: 0
      }
    }
    return e[currency]
  }

  deposit(exchange, currency, amount) {
    const c = this.getCurrency(exchange, currency)
    c.free =+ amount
    c.total =+ amount
  }

  createOrder({ type, strategy, exchange, market, price, amount }) {
    const currencies = market.split('/') // 'ETH/USDT'
    const base = this.getCurrency(exchange, currencies[0])
    const quote = this.getCurrency(exchange, currencies[1]) // fiat

    if (type === 'buy') {
      base.free = base.total = (0.9985 * quote.free) / price
      base.used = 0
      quote.free = quote.used = quote.total = 0
      console.log('B - ' + currencies[0] + ': ' + base.total + ', \t' + currencies[1] + ': ' + quote.total);
    } else if (type === 'sell') {
      quote.free = quote.total = (0.9985 * base.free) * price
      quote.used = 0
      base.free = base.used = base.total = 0
      console.log('B - ' + currencies[0] + ': ' + base.total + ', \t\t\t' + currencies[1] + ': ' + quote.total);
    }
  }
}

module.exports = new ExchangeSimulator()
