const { Transform } = require('stream')
const { VWAP } = require('technicalindicators');

class VWAPStream extends Transform {
  constructor({ suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    // this.period = period;
    this.suffix = suffix;
    this.vwap = new VWAP({ open: [], high: [], low: [], close: [], volume: [] })
  }
  _transform(chunk, encoding, callback) {
    chunk['vwap' + this.suffix] = this.vwap.nextValue({
      open: chunk.open,
      close: chunk.close,
      high: chunk.high,
      low: chunk.low,
      volume: chunk.volume
    })
    callback(null, chunk)
  }
}

module.exports = VWAPStream
