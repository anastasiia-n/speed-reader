const settings = require('electron-settings');
var themes = {
  light: 1,
  dark: 2
}
if (!settings.has('options.speed')) {
  settings.set('options', {
    speed: 100,
    theme: themes.light
  });
}

var options = {
  speed: settings.get('options.speed'),
  theme: settings.get('options.theme'),
  saveSettings: save,
  getThemes: function() { return themes; }
}

module.exports = {
  getOptions: function() {
    return options
  }
}


function save(opt) {
  if (opt.speed) {
    settings.set('options', {
      speed: opt.speed
    });
  }
  if (opt.theme) {
    settings.set('options', {
      theme: opt.theme
    });
  }
}
