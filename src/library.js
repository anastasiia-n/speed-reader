'use strict'
const electron = require('electron')
const {ipcRenderer: ipc} = electron;
const tags = require('html-tag')
const themeManager = require('./modules/themeManager');

const content = document.getElementById('libContent');
var buttonsRead = [];
var buttonsEdit = [];
var currTitle, currDescription, currEdit;
var editingButton = themeManager.getButtons().edit;
var editingDoneButton = themeManager.getButtons().done;

function generateLibrary(books) {
  var html = ''
  books.forEach( (book) => {
    var read = tags('div', {class: 'buttonRead accent', id: 'read' + book._id}, '<i class="fa fa-book fa-2x" aria-hidden="true"></i>');

    var edit = tags('div', {class: 'buttonEdit accent', id: 'edit' + book._id}, editingButton);
    var descr = tags('div', {class: 'bookDescription', id: 'bookDescription' + book._id}, book.description);
    var name = tags('h3', {class: 'bookTitle', id: 'bookTitle' + book._id}, book.name);
    var texts = tags('div', {class: 'textsLib'}, name + descr);
    var prop = tags('div', {class: 'propLib'}, texts + edit);

    html += tags('div', {id: 'bookBlock', class: 'bookBlock'}, read + prop);
  });
  return html;
}

ipc.on('initLibrary', (event, data) => {
  content.innerHTML = generateLibrary(data);
  buttonsRead = document.getElementsByClassName("buttonRead");
  buttonsEdit = document.getElementsByClassName("buttonEdit");

  [].forEach.call(buttonsRead, (button) => {
    button.onclick = function(e) {
        readBook(this.id);
    };
  });
  [].forEach.call(buttonsEdit, (button) => {
    button.onclick = function(e) {
        editBook(this.id);
    };
  });

  themeManager.getCssLink( (link) => {
    document.head.appendChild(link);
  });
});

function readBook(buttonId) {
  var bookid = buttonId.replace('read', '');
  ipc.send('readBook', bookid);
}

function editBook(buttonId) {
  var book = new Object();
  book._id = buttonId.replace('edit', '');
  currTitle = document.getElementById('bookTitle' + book._id);
  currDescription = document.getElementById('bookDescription' + book._id);
  currEdit = document.getElementById('edit' + book._id);

  if (currEdit.innerHTML === editingButton) {
    editingMode(true);
  } else {
    editingMode(false);
    book.name = currTitle.innerHTML;
    book.description = currDescription.innerHTML;
    ipc.send('editedBook', book);
  }
}

function editingMode(boolMode) {
  currTitle.setAttribute("contenteditable", boolMode);
  currDescription.setAttribute("contenteditable", boolMode);
  if (boolMode) {
    currTitle.setAttribute('style', 'color: #808080');
    currDescription.setAttribute('style', 'color: #808080');
    currEdit.innerHTML = editingDoneButton;
  } else {
    currTitle.setAttribute('style', 'color: black');
    currDescription.setAttribute('style', 'color: black');
    currEdit.innerHTML = editingButton;
  }
}

ipc.send('libReady');
