const { Transform } = require('stream')
const { WEEK, DAY, MINUTE, now } = require('../utils/time-utils')

class Mars {

  constructor({
    id = 'moon',
    exchange,
    market,
    maxData = Math.round( WEEK / 5 * MINUTE),
    minData = 100,
  } = {}) {

    this.id = id
    this.exchange = exchange
    this.market = market
    this.data = [] // TODO: Create ohlcv store class
    this.maxData = maxData
    this.minData = minData
    this.phase = 'buy'
    this.limit = null
    this.limitRange = 10
    this.traps = []



  }

  addData(item) {
    this.data.push(item)
    if (this.data.length > this.maxData) {
      this.data.shift()
    }
  }

  clearTraps() {
    this.traps = []
  }

  addTrap(trigger) {
    this.traps.push(trigger)
  }

  checkTraps(item) {
    if (this.traps.length) {
      for (let i = 0; i < this.traps.length; i++) {
        const action = this.traps[i](item)
        if (action === 'buy') {
          this.buy(item)
        }
        if (action === 'sell') {
          this.sell(item)
        }
        if (action === 'cancel') {
          // TODO: remove trap
        }
      }
    }
  }

  ohlcv() {
    const self = this
    const stream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        self.analyze(chunk, callback)
      }
    })
    return stream
  }

  analyze(item, cb) {
    this.addData(item)

    if (this.data.length < this.minData) {
      return cb(null, item)
    }

    this.checkTraps(item)

    const self = this

    // set trap for first buy
    if (!this.limit && item.cci < -200 && item.rsi < 30) {
      this.addTrap((i) => {
        if (i.cci > -60) return 'buy'
        return null
      })
    }

    if (this.phase === 'buy' && this.limit) {
      if (this.limit - item.close > this.limitRange) {
        this.limit = item.close + this.limitRange
      } else if (item.close > this.limit) {
        this.buy(item)
      }
    } else if (this.phase === 'sell' && this.limit) {
      // move limit
      if (item.close - this.limit > this.limitRange) {
        this.limit = item.close - this.limitRange
      } else if (item.close < this.limit) {
        this.sell(item)
      }
    }

    cb(null, item)
  }

  buy(item) {
    // TODO: add action id
    item.action = { type: 'buy', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }
    this.clearTraps()
    this.limit = item.close - this.limitRange
    // switch phase
    this.phase = 'sell'
  }

  sell(item) {
    item.action = { type: 'sell', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }
    this.clearTraps()
    this.limit = item.close + this.limitRange
    // switch phase
    this.phase = 'buy'
  }

  getState() {
    return  { data: this.data }
  }
}

module.exports = Mars
