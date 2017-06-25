const options = require('../settings').getOptions()
var tags = require('html-tag')

const main = document.getElementById('options');
const buttonDone = document.getElementById('settingsDone');
var br = '<br/>';

(function init() {
  var speedLab = tags('label', 'Speed:');
  var speedVal = options.speed;
  var speedIn = tags('input', {type: 'number', id: 'speedInput', class: 'speedInput'
                      min: '50', max: '1000', step: '50'}, speedVal);
  var html = speedLab + speedIn + br;

  var themes = options.getThemes();
  var selected = options.theme;
  for(var name in themes) {
    var value = themes[name];
    var themeIn = tags('input', {type: 'radio', class: 'theme', id: 'theme' + value})
    if (value === selected)
      themeIn = tags('input', {type: 'radio', class: 'theme', id: 'theme' + value, checked: 'checked'})
    var themeLab = tags('label', name);
    html += themeIn + themeLab + br;
  }
  main.innerHTML = html;
})();

buttonDone.onclick = function() {
  var sp = document.getElementById('speedInput').value;
  var allThemes = document.getElementsByClassName('theme');
  var th;
  [].forEach.call(allThemes, (theme) => {
    if (theme.checked) th = theme.value.replace('theme', '');
  });
  var opt = {
    speed: sp,
    theme: th
  }
  options.saveSettings(opt);
}
