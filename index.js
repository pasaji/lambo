const Lambo = require('./src/lambo')

const lambo = new Lambo({ keychain: { poloniex: {} } })
lambo.start()
