const { Transform } = require('stream')
const { MACD } = require('technicalindicators')

class MACDStream extends Transform {
  constructor({ fastPeriod = 5, slowPeriod = 8, signalPeriod = 3, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.fastPeriod = fastPeriod
    this.slowPeriod = slowPeriod
    this.signalPeriod = signalPeriod
    this.suffix = suffix
    this.macd = new MACD({
      fastPeriod: fastPeriod,
      slowPeriod: slowPeriod,
      signalPeriod: signalPeriod,
      values : []
    })
  }
  _transform(chunk, encoding, callback) {
    chunk['macd' + this.suffix] = this.macd.nextValue(chunk.close)
    callback(null, chunk)
  }
}

module.exports = MACDStream
