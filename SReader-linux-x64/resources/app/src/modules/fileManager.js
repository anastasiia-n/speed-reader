const {dialog} = require('electron');
const fs = require('fs');
var exports = module.exports = {};

exports.openFile = function(cb) {
  dialog.showOpenDialog({ filters: [
   { name: 'text', extensions: ['txt'] } ]},
    function (fileNames) {
      if (fileNames === undefined) return;
      var fileName = fileNames[0];
      fs.readFile(fileName, 'utf-8', function (err, data) {
        if (typeof cb === "function") {
          cb(fileName, data);
        }
      });
  });
}
