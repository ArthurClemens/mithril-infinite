if (typeof window !== 'undefined') {
  var waitSeconds = 100;
  
  var head = document.getElementsByTagName('head')[0];
  
  // get all link tags in the page
  var links = document.getElementsByTagName('link');
  var linkHrefs = [];
  for (var i = 0; i < links.length; i++) {
    linkHrefs.push(links[i].href);
  }
  
  var isWebkit = !!window.navigator.userAgent.match(/AppleWebKit\/([^ ;]*)/);
  var webkitLoadCheck = function(link, callback) {
    setTimeout(function() {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (sheet.href == link.href)
          return callback();
      }
      webkitLoadCheck(link, callback);
    }, 10);
  }
  
  var noop = function() {}
  
  var loadCSS = function(url) {
    return new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject('Unable to load CSS');
      }, waitSeconds * 1000);
      var _callback = function() {
        clearTimeout(timeout);
        link.onload = noop;
        setTimeout(function() {
          resolve('');
        }, 7);
      }
      var link = document.createElement('link')  ;
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
  
      if (!isWebkit)
        link.onload = _callback;
      else
        webkitLoadCheck(link, _callback);
  
      head.appendChild(link);
    });
  }
  
  exports.fetch = function(load) {
    // dont reload styles loaded in the head
    for (var i = 0; i < linkHrefs.length; i++)
      if (load.address == linkHrefs[i])
        return '';
    return loadCSS(load.address);
  }
}
else {
  exports.build = false;
}
