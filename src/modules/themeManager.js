const options = require('./settingsManager').getOptions();
const tags = require('html-tag')
var exports = module.exports = {};

const EDIT_BUTTON = '<i class="fa fa-pencil" aria-hidden="true"></i>';
const DONE_BUTTON = '<i class="fa fa-check" aria-hidden="true"></i>';

exports.getCssLink = function(cb) {
  options.getThemeName(options.theme, (name) => {
    var ref = `${__dirname}/../css/themes/${name}.css`;
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.type = 'text/css'; link.href = ref;
    if (typeof cb === "function") cb(link);
  });
}

exports.getButtons = function() {
  var result = {
    edit: EDIT_BUTTON,
    done: DONE_BUTTON
  }
  return result;
}
