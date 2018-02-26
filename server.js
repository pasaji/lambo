const express = require('express')
const Lambo = require('./src/lambo')

const lambo = new Lambo({ keychain: { poloniex: {} } })
lambo.start()

const app = express()
app.use(express.static('public'))
app.get('/state', (req, res) => res.json(lambo.getState()))
app.get('/', (req, res) => res.sendFile('index.html'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
