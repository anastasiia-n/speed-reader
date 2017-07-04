var exports = module.exports = {};
const TITLE_LEN = 10;
const DESCRIPTION_LEN = 15;

exports.parseBook = function(text, name) {
  var book = new Object();
  console.log(name);
  if (name) {
    book.name = parseName(name);
  } else {
    book.name = text.substring(0, TITLE_LEN).trim().replace('\t', '');
  }
  book.description = text.substring(0, DESCRIPTION_LEN).trim().replace('\t', '');
  book.text = text;
  return book;
}

function parseName(name) {
  var newName = name;
  //remove path
  var index = newName.lastIndexOf('\\');
  if (index > 0) {
    newName = newName.substring(index + 1);
  } else {
    index = newName.lastIndexOf('/');
    if (index > 0)
      newName = newName.substring(index + 1);
  }
  //remove extension
  index = newName.lastIndexOf('.');
  if (index > 0)
    newName = newName.substring(0, index);

  if (newName.indexOf('_') >= 0)
    newName = newName.replace(/_/g, ' ');
  else if (newName.indexOf('-') >= 0)
    newName = newName.replace(/-/g, ' ');

  return newName;
}
