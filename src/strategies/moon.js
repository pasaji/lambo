const { Transform } = require('stream')

class Moon {

  constructor({
    id = 'moon',
    exchange,
    market,
    maxData = 1000,
    minData = 100,
  } = {}) {

    this.id = id
    this.exchange = exchange
    this.market = market
    this.data = [] // TODO: Create ohlcv store class
    this.maxData = maxData
    this.minData = minData
    this.phase = 'buy'
    this.flags = {} // phase notes
    this.traps = []
  }

  addData(item) {
    this.data.push(item)
    if (this.data.length > this.maxData) {
      this.data.shift()
    }
  }

  addTrap(trigger) {
    this.traps.push(trigger)
    // trigger
    // remove

  }

  // TODO: make this dublex, so strategies can be piped
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

    const overbought = item.cci > 200 && item.rsi > 70
    const upperBandOverflow = item.high > item.bb.upper

    const oversold = item.cci < -200 && item.rsi < 30
    const lowerBandOverflow = item.low < item.bb.lower

    const rangeboundMarket = item.adx.adx <= 20
    const trendingMarket = item.adx.adx > 20
    const upTrend = item.adx.pdi > 30 && item.adx.mdi < 30 && item.adx.adx > 20
    const downTrend = item.adx.mdi > 30 && item.adx.pdi < 30 && item.adx.adx > 20

    const buyRange = item.close < item.vwap - item.atr
    const sellRange = item.close > item.vwap + item.atr


    // TODO: Calculate risk award ratio. better reward = higher risk can be taken
    // TODO: use ATR as stoploss. Set stoploss at 1 * ATR below buy price

    if (this.traps.length) {
      for (let i = 0; i < this.traps.length; i++) {
        const action = this.traps[i](item)
        if (action === 'buy') {
          this.buy(item)
          // add stoploss
        }
        if (action === 'sell') {

          this.sell(item)
        }
        if (action === 'cancel') {
          // TODO: remove trap
        }
      }
    }

    const self = this

    if (this.phase === 'buy') {
      if (oversold && lowerBandOverflow && buyRange) {
        this.addTrap((i) => {
          if (i.cci > -60) {
            return 'buy'
          }
          // todo: cancel
          return null
        })
      }
    } else if (this.phase === 'sell' && sellRange) {
      if (item.macd.MACD < 0) {
        this.addTrap((i) => {
          if (i.cci < 60 && i.adx.adx < 30) {
            return 'sell'
          }
          // todo: cancel
          return null
        })
      }
    }
    cb(null, item)
  }

  buy(item) {
    // TODO: add action id
    item.action = { type: 'buy', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }
    this.traps = [] // clear traps
    // add stop loss
    const stopLossPrice = item.close - item.atr * 1.5
    this.addTrap((i) => {
      if (i.close  < stopLossPrice) {
        //return 'sell'
      }
      // todo: cancel
      return null
    })
    // switch phase
    this.phase = 'sell'
  }

  sell(item) {
    item.action = { type: 'sell', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }
    this.traps = []
    // add stop loss
    const stopLossPrice = item.close + item.atr * 1.5
    this.addTrap((i) => {
      if (i.close  > stopLossPrice) {
        //return 'buy'
      }
      // todo: cancel
      return null
    })
    // switch phase
    this.phase = 'buy'
  }

  getState() {
    return  { data: this.data }
  }
}

module.exports = Moon
