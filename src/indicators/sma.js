const { Transform } = require('stream')
const { SMA } = require('technicalindicators');

class SMAStream extends Transform {
  constructor({ period = 50, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.sma = new SMA({ period: period, values : [] });
  }
  _transform(chunk, encoding, callback) {
    chunk['sma' + this.suffix] = this.sma.nextValue(chunk.close)
    callback(null, chunk)
  }
}

module.exports = SMAStream
