const { Writable } = require('stream')
const exchangeSimulator = require('./exchange-simulator');

class Trader {

  constructor({ maxData = 10000 } = {}) {
    this.maxData = maxData
    this.data = []
  }

  addData(item) {
    this.data.push(item)
    if (this.data.length > this.maxData) {
      this.data.shift()
    }
    if (item.action) {
      exchangeSimulator.createOrder(item.action)
    }
  }

  ohlcv() {
    const self = this
    const stream = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        self.addData(chunk)
        callback()
      }
    })
    return stream
  }

  getState() {
    return  { data: this.data }
  }

}

module.exports = Trader
