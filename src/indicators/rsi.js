const { Transform } = require('stream')
// const RSI = require('technicalindicators').RSI;

class RSIStream extends Transform {
  constructor() {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = 14
    this.closes = []
  }

  _transform(chunk, encoding, callback) {
    this.closes.push(chunk.close)
    if (this.closes.length === this.period) {
      this.closes.shift()
      chunk.rsi = 999
    } else {
      chunk.rsi = null
    }
    callback(null, chunk)
  }
}

module.exports = RSIStream
