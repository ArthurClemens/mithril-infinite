// Copies the data files from the original examples

require('shelljs/global');

var originDir = '../../examples/src/app/';
var destinationDir = 'src/app/';

mkdir('-p', destinationDir);

var copyData = function(dir) { 
    var dest = destinationDir + dir;
    rm('-rf', dest);
    mkdir('-p', dest);
    cp('-R', originDir + dir + 'data', dest);
}

var dirNames = ['grid', 'horizontal', 'images', 'short', 'table'];
dirNames.forEach(function(name) {
    copyData(name + '/');
});
