var store = require('user-settings').file('.settings');

const SPEED = 100;
const THEMES = {
  light: 1,
  dark: 2
}
if (!store.get('speed')) {
  store.set('speed', SPEED);
}
if (!store.get('theme')) {
  store.set('theme', THEMES.light);
}

var options = {
  speed: store.get('speed'),
  theme: store.get('theme'),
  saveSettings: save,
  getThemes: function() { return THEMES; }
}

module.exports = {
  getOptions: function() {
    return options
  }
}


function save(opt) {
  console.log('saved:' + opt.speed + ' and ' + opt.theme);
  if (opt.speed) {
    store.set('speed', opt.speed);
  }
  if (opt.theme) {
    store.set('theme', opt.theme);
  }
}
