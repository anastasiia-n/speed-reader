'use strict'

const electron = require('electron');
const remote = electron.remote;
const {dialog} = remote;
const options = require('./modules/settingsManager').getOptions();
var tags = require('html-tag');
const themeManager = require('./modules/themeManager');

const ipc = electron.ipcRenderer;

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
var speed = parseInt(options.speed, 10);
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
  exit(0);
}

function exit(exitFromAppFlag) {
  var saved = new Object();
  saved._id = bookID;
  saved.pointer = currIndex;
  if (exitFromAppFlag == 1) return;
  ipc.send('showLibrary', saved);
}

function changeSpeed(value) {
  speed += value;
  if (speed < 50) speed = 50;
  else if (speed > 1000) speed = 1000;

  renderElements(false);
  var opt = {
    speed: speed
  }
  //options.saveSettings(opt);
}

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
    bResume.style.display = 'inline-block';
    bPause.style.display = 'none';

    themeManager.getCssLink( (link) => {
      document.head.appendChild(link);
    });
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

ipc.on('readBook', (event, book) => {
  bookID = book._id;
  title.innerHTML = book.name;
  var text = book.text.replace('\r', ' ').replace('\n', ' ')
                      .replace('\t', ' ');
  bookArr = text.split(/\s+/);
  currIndex = book.pointer;
  lastIndex = bookArr.length - 1;
});

ipc.on('changeSpeed', (event, flag) => {
  if (flag === 1) changeSpeed(50);
  else changeSpeed(-50);
});

remote.getCurrentWindow().onbeforeunload = function(event) {
  dialog.showMessageBox({ type: 'question', message: 'Do you want to quit?', buttons: ['No', 'Yes']},
  (response, cbC) => {
    if (response === 0) {
      event.preventDefault();
    }
  });
  exit(1);
  return false;
}

renderElements(true);
ipc.send('readerReady');
