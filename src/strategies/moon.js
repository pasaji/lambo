import ccxt from 'ccxt'
import { Writable } from 'stream'

export default class Moon {
  constructor(options = {}) {

  }

  writeOHLCV() {
    const stream = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        console.log(chunk);
        callback();
      }
    })
    return stream
  }
}
