'use strict'
const electron = require('electron')
var tags = require('html-tag')
const tManager = require('./modules/textManager')
const options = require('./modules/settingsManager').getOptions()
const ipc = electron.ipcRenderer

const textView = document.getElementById('textView')
const title = document.getElementById('title')
const bSlower = document.getElementById('buttonSlower')
const bFaster = document.getElementById('buttonFaster')
const speedView = document.getElementById('speedView')
const bPause = document.getElementById('buttonPause')
const bResume = document.getElementById('buttonResume')
const bExit = document.getElementById('buttonExit')

const debug = document.getElementById('debug')

var bookArr = [];
var bookID;
var currIndex, lastIndex;
var speed = options.speed;
var clock;

bSlower.onclick = function() {
  changeSpeed(-50);
}
bFaster.onclick = function() {
  changeSpeed(50);
}

bPause.onclick = function() {
  bPause.style.display = 'none';
  bResume.style.display = 'inline-block';
  clearTimeout(clock);
}
bResume.onclick = function() {
  bResume.style.display = 'none';
  bPause.style.display = 'inline-block';
  showNextWord();
}

bExit.onclick = function() {
  loadLibrary();
}

function loadLibrary() {
  var saved = new Object();
  saved._id = bookID;
  saved.pointer = currIndex;
  ipc.send('showLibrary', saved);
}

function changeSpeed(value) {
  speed += value; renderElements(false);
  var opt = {
    speed: speed
  }
  options.saveSettings(opt);
}

ipc.on('readBook', (event, book) => {
  bookID = book._id;
  title.innerHTML = book.name;
  var text = book.text.replace('\r', ' ').replace('\n', ' ')
                      .replace('\t', ' ');
  bookArr = text.split(/\s+/);
  currIndex = book.pointer;
  lastIndex = bookArr.length - 1;
  showNextWord();
})

function showNextWord() {
    clock = setTimeout(function () {
      if(currIndex <= lastIndex) {
        textView.innerHTML = textToHtml(bookArr[currIndex++])
        showNextWord();
      }
    }, timeout());
}

function renderElements(firstTime) {
  if(firstTime) {
    bPause.style.display = 'inline-block';
    bResume.style.display = 'none';
  }
  speedView.innerHTML = speed;
}

function timeout() {
  return 60000/speed
}

function textToHtml(text) {
  var center = Math.ceil(text.length / 2);
  var accent = tags('span', {class: 'accent'}, text.charAt(center - 1));
  var html = text.substring(0, center - 1) + accent + text.substring(center);
  return html;
}


renderElements(true);
ipc.send('readerReady');
