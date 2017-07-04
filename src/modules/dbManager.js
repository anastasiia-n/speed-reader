var Datastore = require('nedb')
var db;
var Connector = {
  db,
  getBook: getBook,
  getAll: getAllBooks,
  add: addBook,
  updatePointer: updateBookPointer,
  updateProperties: updateBookProperties,
  delete: deleteBook
};
module.exports = {
  loadDB: function(path, cb) {
    db = new Datastore({ filename: path, autoload: true });
    db.loadDatabase(function (err) {
      if (err) {console.log(err);}
      else if (typeof cb === "function") cb(Connector);
    });
  }
};

function getBook(id, cb) {
  db.findOne({ _id: id }, function (err, book) {
    if (err) console.log(err);
    else if (typeof cb === "function") cb(book);
  });
};

function getAllBooks(cb) {
  db.find({}, {name: 1, description: 1, _id: 1}, function (err,books){
    if (err) console.log(err);
    else if (typeof cb === "function") cb(books);
  });
};

function addBook(book) {
  if (!book.pointer) book.pointer = 0;
  db.insert(book);
};

function updateBookPointer(book) {
  db.update({ _id: book._id }, { $set: {pointer: book.pointer} }, {}, function (err, numReplaced) {
    //console.log(numReplaced);
  });
};

function updateBookProperties(book) {
  if (book.name.trim() === '') return;
  db.update({ _id: book._id }, { $set: {name: book.name, description: book.description} }, {}, function (err, numReplaced) {
    //console.log(numReplaced);
  });
};

function deleteBook(id) {
  db.remove({ _id: id }, {}, function (err, numRemoved) {
    //console.log(numRemoved);
  });
};
