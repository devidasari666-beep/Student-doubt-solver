const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '../frontend')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

app.get('/doubts', (req, res) => {
  res.send('All doubts will show here')
})

app.get('/doubts/:id', (req, res) => {
  res.send('Single doubt page for id ' + req.params.id)
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})