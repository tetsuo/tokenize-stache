var through = require('through2');
var combine = require('stream-combiner2');
var tokenize = require('tokenize-html');

module.exports = function () {
  var tr = through.obj(function (row, enc, next) {
    if (row[0] === 'text') {
      scan(row[1], function (type, value) {
        tr.push([type, value]);
      });
    } else this.push(row);
    next();
  });
  return combine(tokenize(), tr);
};

var tags = {
  '': 'variable',
  '#': 'section:open',
  '/': 'section:close' 
};

function scan (s, cb) {
  var i = -1, text = '', match, token,
      tokens = s.split(/({[^}]+})/);
  while (++ i < tokens.length) {
    token = tokens[i];
    if (0 !== i % 2) {
      free();
      match = token.match(/^{\s*([#\/]?)(\w+)\s*}$/);
      if (!match) throw new Error('scan error: ' + token);
      cb(tags[match[1]], match[2]);
    } else text += token;
  }
  function free () {
    if (text.length) {
      cb('text', text);
      text = '';
    }
  }
  free();
}
