const options = require('../settingsManager').getOptions();
const themeManager = require('../themeManager');
const tags = require('html-tag');
const electron = require('electron');
const ipc = electron.ipcRenderer;

const main = document.getElementById('options');
const buttonDone = document.getElementById('settingsDone');
var speedInput;
var themesRadio = [];
var br = '<br/>';

(function init() {
  generateHtml();

  speedInput = document.getElementById('speedInput');
  speedInput.value = options.speed;
  themesRadio = document.getElementsByClassName('theme');
  var selected = options.theme;
  [].forEach.call(themesRadio, (theme) => {
    if (theme.id === 'theme' + selected) theme.checked = true;
  });

  themeManager.getCssLink( (link) => {
    document.head.appendChild(link);
  });
})();

buttonDone.onclick = function() {
  var sp = speedInput.value;
  var th;
  [].forEach.call(themesRadio, (theme) => {
    if (theme.checked) th = theme.id.replace('theme', '');
  });
  var opt = {
    speed: sp,
    theme: th
  }
  options.saveSettings(opt);
  ipc.send('closeSettings');
}

function generateHtml() {
  var speedLab = tags('label', 'Speed:');
  var speedIn = tags('input', {type: 'number', id: 'speedInput', class: 'speedInput',
                      min: '50', max: '1000', step: '50'});
  var html = speedLab + speedIn + br;

  var themes = options.getThemes();
  for(var name in themes) {
    var value = themes[name];
    var themeIn = tags('input', {type: 'radio', name: 'theme', class: 'theme', id: 'theme' + value});
    var themeLab = tags('label', name);
    html += themeIn + themeLab + br;
  }

  main.innerHTML = html;
}
