const { Writable } = require('stream')

class Moon {

  constructor({ id = 'moon', max = 100, min = 50 } = {}) {
    this.data = []
    this.max = max
    this.min = min
    this.phase = 'buy'

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

  analyze() {
    // console.log('analyze');

    const item = this.data[ this.data.length - 1 ]

    const overbought = item.rsi > 70
    const oversold = item.rsi < 30
    const upperBandOverflow = item.high > item.bb.upper
    const lowerBandOverflow = item.low < item.bb.lower

    // console.log({ overbought, oversold, upperBandOverflow, lowerBandOverflow })

    if (overbought && upperBandOverflow && this.phase === 'sell') {
      this.balance.USD = (0.9985 * this.balance.ETH) * item.close
      this.balance.ETH = 0

      console.log('SELL', item.close, this.balance.USD+'$', ((100*this.balance.USD/1000)-100)+'%' );

      // switch phase
      this.phase = 'buy'
    } else if (oversold && lowerBandOverflow && this.phase === 'buy') {
      console.log('BUY', item.close);
      this.balance.ETH = (0.9985 * this.balance.USD) / item.close
      this.balance.USD = 0
      // switch phase
      this.phase = 'sell'

    }
  }
}

module.exports = Moon
