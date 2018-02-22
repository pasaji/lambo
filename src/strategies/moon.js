const { Writable } = require('stream')

class Moon {
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

module.exports = Moon
