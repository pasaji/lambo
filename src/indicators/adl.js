const { Transform } = require('stream')
const { ADL } = require('technicalindicators')

class ADLStream extends Transform {
  constructor({ suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.suffix = suffix;
    this.adl = new ADL({ high: [], low: [], close: [], volume: [] })
  }
  _transform(chunk, encoding, callback) {
    chunk['adl' + this.suffix] = this.adl.nextValue({
      high: chunk.high,
      low: chunk.low,
      close: chunk.close,
      volume: chunk.volume
    })
    callback(null, chunk)
  }
}

module.exports = ADLStream
