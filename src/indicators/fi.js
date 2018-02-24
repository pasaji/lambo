const { Transform } = require('stream')
const { ForceIndex } = require('technicalindicators');

class FIStream extends Transform {
  constructor({ suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.suffix = suffix;
    this.fi = new ForceIndex({ open: [], high: [], low: [], close: [], volume: [] })
  }
  _transform(chunk, encoding, callback) {
    chunk['fi' + this.suffix] = this.fi.nextValue({
      open: chunk.open,
      close: chunk.close,
      high: chunk.high,
      low: chunk.low,
      volume: chunk.volume
    })
    callback(null, chunk)
  }
}

module.exports = FIStream
