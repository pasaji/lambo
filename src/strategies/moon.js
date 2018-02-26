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
    this.balance = {
      USD: 1000,
      ETH: 0
    }
  }

  addData(item) {
    this.data.push(item)
    if (this.data.length > this.maxData) {
      this.data.shift()
    }
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

    const overbought = item.rsi > 70 && item.cci > 200
    //const overbought = item.cci > 200
    const oversold = item.rsi < 30 && item.cci < -200
    // const oversold = item.cci < -200

    const upperBandOverflow = item.high > item.bb.upper
    const lowerBandOverflow = item.low < item.bb.lower
    const upTrend = item.adx.pdi > 30 && item.adx.mdi < 30 && item.adx.adx > 20
    const downTrend = item.adx.mdi > 30 && item.adx.pdi < 30 && item.adx.adx > 20

    // console.log({ rsi, cci, upTrend, downTrend })

    // non Trending adx < 20

    // Calculate risk award ratio. better reward = higher risk can be taken

    // rangeboundMarket or trendingMarket

    // Ideas:
    // 1. RSI (overbought/oversold)
    // (2. BB overflow)
    // 3. MACD turns (down/up)
    // MACD flippaa myöhemmin joka parempi merkki myynti/osto hetkelle
    // https://www.youtube.com/watch?v=C-770uuFILM

    // use ATR as stoploss. Set stoploss at 1 * ATR below buy price

    // console.log({ overbought, oversold, upperBandOverflow, lowerBandOverflow })
    /*
    if (overbought && upperBandOverflow && this.phase === 'sell') {
      this.balance.USD = (0.9985 * this.balance.ETH) * item.close
      this.balance.ETH = 0
      console.log('SELL', item.close, this.balance.USD+'$', ((100*this.balance.USD/1000)-100)+'%' );
      item.action = { type: 'sell' }

      // switch phase
      this.phase = 'buy'
    } else if (oversold && lowerBandOverflow && this.phase === 'buy') {
      console.log('BUY', item.close);
      this.balance.ETH = (0.9985 * this.balance.USD) / item.close
      this.balance.USD = 0
      item.action = { type: 'buy' }
      // switch phase
      this.phase = 'sell'
    }
    */

    const d = new Date(item.date)
    if (this.phase === 'buy') {
      /*
      if ( item.macd.MACD > 0 ) {
        this.buy(item)
      }
      */
      if (oversold) {
        this.buy(item)
      }
    } else if (this.phase === 'sell') {
      /*
      if ( item.macd.MACD < 0 ) {
        this.sell(item)
      }
      */
      if (overbought) {
        this.sell(item)
      }
    }
    cb(null, item)
  }

  buy(item) {
    this.balance.ETH = (0.9985 * this.balance.USD) / item.close
    this.balance.USD = 0

    // TODO: add action id
    item.action = { type: 'buy', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }

    // console.log('BUY', item.close);

    // switch phase
    this.phase = 'sell'
  }

  sell(item) {
    this.balance.USD = (0.9985 * this.balance.ETH) * item.close
    this.balance.ETH = 0
    item.action = { type: 'sell', strategy: this.id, exchange: this.exchange, market: this.market, price: item.close }
    // console.log('SELL', item.close, this.balance.USD+'$', ((100*this.balance.USD/1000)-100)+'%' );
    // switch phase
    this.phase = 'buy'
  }

  getState() {
    return  { data: this.data }
  }
}

module.exports = Moon
