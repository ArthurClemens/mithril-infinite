var j2c = require('j2c');

var style = require('../lib/mithril-infinite-style.js');
var sheet = j2c.sheet(style);

process.stdout.write(sheet);
