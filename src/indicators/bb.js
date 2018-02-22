const { Transform } = require('stream')
const { BollingerBands } = require('technicalindicators');

class BBStream extends Transform {
  constructor({ period = 14, stdDev = 2, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.stdDev = stdDev;
    this.suffix = suffix;
    this.bb = new BollingerBands({ period, stdDev, values : [] });
  }
  _transform(chunk, encoding, callback) {
    chunk['bb' + this.suffix] = this.bb.nextValue(chunk.close)
    callback(null, chunk)
  }
}

module.exports = BBStream
