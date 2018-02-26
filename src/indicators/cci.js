const { Transform } = require('stream')
const { CCI } = require('technicalindicators');

class CCIStream extends Transform {
  constructor({ period = 20, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.cci = new CCI({ period, open: [], high: [], low: [], close: [] })
  }
  _transform(chunk, encoding, callback) {
    chunk['cci' + this.suffix] = this.cci.nextValue({
      open: chunk.open,
      high: chunk.high,
      low: chunk.low,
      close: chunk.close
    })
    callback(null, chunk)
  }
}

module.exports = CCIStream
