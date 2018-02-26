const { Transform } = require('stream')
const { ATR } = require('technicalindicators');

class ATRStream extends Transform {
  constructor({ period = 14, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.atr = new ATR({ period, high : [], low:[], close:[] });
  }
  _transform(chunk, encoding, callback) {
    chunk['atr' + this.suffix] = this.atr.nextValue({
      high: chunk.high,
      low: chunk.low,
      close: chunk.close
    })
    callback(null, chunk)
  }
}

module.exports = ATRStream
