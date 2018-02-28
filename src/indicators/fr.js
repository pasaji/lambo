const { Transform } = require('stream')

class FRStream extends Transform {
  constructor({ period = 288, suffix = '' } = {}) {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.period = period;
    this.suffix = suffix;
    this.data = []
  }

  getBounds() {
    let high, low
    for (var i = 0; i < this.data.length; i++) {
      const item = this.data[i]
      if (!isNaN(item.high)) {
        if (isNaN(high)) {
          high = item.high
        } else {
          high = high > item.high ? high : item.high
        }
        if (!isNaN(item.low)) {
          if (isNaN(low)) {
            low = item.low
          } else {
            low = low < item.low ? low : item.low
          }
        }
      }
    }
    return { high, low }
  }

  nextValue(item) {
    this.data.push(item)
    if (this.data.length > this.period) {
      this.data.shift()
    }
    /*
    if (this.data.length !== this.period) {
      return {
        high: null,
        level1: null,
        level2: null,
        level3: null,
        low: null
      }
    }
    */

    const { high, low } = this.getBounds()

    return {
      high,
      level5: (high && low) ? low + (high - low) * 0.764 : null ,
      level4: (high && low) ? low + (high - low) * 0.618 : null ,
      level3: (high && low) ? low + (high - low) * 0.5 : null ,
      level2: (high && low) ? low + (high - low) * 0.382 : null ,
      level1: (high && low) ? low + (high - low) * 0.236 : null ,
      low
    }
  }

  _transform(chunk, encoding, callback) {
    chunk['fr' + this.suffix] = this.nextValue(chunk)
    callback(null, chunk)
  }
}

module.exports = FRStream
