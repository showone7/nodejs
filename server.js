const express = require('express')
var bodyParser = require('body-parser')

const app = express()

const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let books = []

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/api2/getAllBooks', function (req, res) {
  res.send(books)
})

app.patch('/api2/updateBook/:id', function (req, res) {
  // console.log(req.params)
  let updateBook = books[req.params.id] || res.send('Book not found!')
  updateBook.name = req.body.name
  updateBook.year = req.body.year
  res.send('Book updated!')
})

app.post('/api2/saveBook', function (req, res) {
  books.push({
    name: req.body.name,
    year: req.body.year,
    id: books.length
  })
  console.log(books)
  res.send('Book saved!')
})

app.delete('/api2/deleteBook/:id', function (req, res) {
  if (req.params.id) {
    books.splice(req.params.id, 1)
    res.send('Book deleted!')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})