const { Transform } = require('stream')
const { EMA } = require('technicalindicators');

class EMAStream extends Transform {
  constructor({ period = 21, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.ema = new EMA({ period: period, values : [] });
  }
  _transform(chunk, encoding, callback) {
    chunk['ema' + this.suffix] = this.ema.nextValue(chunk.close)
    callback(null, chunk)
  }
}

module.exports = EMAStream
