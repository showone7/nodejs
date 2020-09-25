const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const url = `mongodb+srv://new:asdw34vD@cluster0.any1t.mongodb.net/test?retryWrites=true&w=majority`;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const bookSchema = new mongoose.Schema({
  title: String,
  published: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },

});
const Book = mongoose.model("Book", bookSchema);

const authorSchema = new mongoose.Schema({
  name: String,
  born: Number
});
const Author = mongoose.model("Author", authorSchema);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get("/api2/getAllBooks", (req, res) => {
  Book.find({}).then((books) => {
    res.json(books);
  });
});


app.post("/api2/saveBook", async (request, response) => {
  const body = request.body;
  const isAuthor = await Author.find({ name: body.author })
  let authorId;
  if (!isAuthor.length) {
    const author = new Author({
      name: body.author,
    });
    await author.save();
    authorId = await Author.find({ name: body.author });
  } else {
    authorId = isAuthor;
  }
  const book = new Book({
    title: body.title,
    published: body.published,
    author: authorId[0]._id,
  });
  book.save().then((savedBook) => {
    response.json(savedBook);
  })
})


app.patch('/api2/updateBook/:id', function (req, res) {
  let updateBook = books[req.params.id] || res.send('Book not found!')
  updateBook.name = req.body.name
  updateBook.year = req.body.year
  res.send('Book updated!')
})


app.delete('/api2/deleteBook/:id', function (req, res) {
  if (req.params.id) {
    books.splice(req.params.id, 1)
    res.send('Book deleted!')
  }
})


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

