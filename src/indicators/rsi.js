import { Transform } from 'stream'

export default class RSI extends Transform {
  constructor() {
    super({
      objectMode: true,
      readableObjectMode: true,
      writableObjectMode: true
    })
  }
  _transform(chunk, encoding, callback) {
    chunk.rsi = 123    
    callback(null, chunk)
  }
}
