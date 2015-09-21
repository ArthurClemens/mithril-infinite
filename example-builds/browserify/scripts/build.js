var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");

// These path look really complicated because we are referring to the
// original example directory in this package.
// In real life it would be simpler.
browserify({
    entries: ['../../examples/src/app/index/index.es6.js'],
    extensions: ['.es6.js'],
    paths: ['./node_modules','../../lib/', '../../examples/src/']
})
.transform(babelify)
.bundle()
.on("error", function (err) { console.log("Error : " + err.message); })
.pipe(fs.createWriteStream("src/bundle.js"));