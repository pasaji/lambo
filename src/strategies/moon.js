const { Writable } = require('stream')

class Moon {

  constructor({ id = 'moon', max = 1000, min = 500 } = {}) {
    this.data = []
    this.max = max
    this.min = min
    this.phase = 'buy'
    this.flags = {} // phase notes
    this.balance = {
      USD: 1000,
      ETH: 0
    }
  }

  addData(item) {
    this.data.push(item)
    if (this.data.length > this.max) {
      this.data.shift()
    }
    if (this.data.length > this.min) {
      this.analyze()
    }
  }

  // TODO: make this dublex, so strategies can be piped
  ohlcv() {
    const self = this
    const stream = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        self.addData(chunk)
        callback()
      }
    })
    return stream
  }

  // IDEA: Pitäisikö itemiin liittää buy / sell action mukaan
  // - helpompi visualisointi
  // - kamat kulkisi samassa stramissa eteenpäin traderille
  analyze() {
    // console.log('analyze');

    const item = this.data[ this.data.length - 1 ]

    const overbought = item.rsi > 70
    //const overbought = item.cci > 200
    const oversold = item.rsi < 30
    // const oversold = item.cci < -200


    const upperBandOverflow = item.high > item.bb.upper
    const lowerBandOverflow = item.low < item.bb.lower
    const upTrend = item.adx.pdi > 20 && item.adx.mdi < 20
    const downTrend = item.adx.mdi > 20 && item.adx.pdi < 20

    const { rsi, cci } = item

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
  }

  getState() {
    return  { data: this.data }
  }
}

module.exports = Moon
