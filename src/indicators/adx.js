const { Transform } = require('stream')
const { ADX } = require('technicalindicators');

class ADXStream extends Transform {
  constructor({ period = 14, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.adx = new ADX({ period, high : [], low:[], close:[] })
  }
  _transform(chunk, encoding, callback) {
    chunk['adx' + this.suffix] = this.adx.nextValue({
      high: chunk.high,
      low: chunk.low,
      close: chunk.close
    })
    callback(null, chunk)
  }
}

module.exports = ADXStream
