const { Transform } = require('stream')
const { RSI } = require('technicalindicators');

class RSIStream extends Transform {
  constructor({ period = 14, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.rsi = new RSI({ period: period, values : [] });
  }
  _transform(chunk, encoding, callback) {
    chunk['rsi' + this.suffix] = this.rsi.nextValue(chunk.close)
    callback(null, chunk)
  }
}

module.exports = RSIStream
