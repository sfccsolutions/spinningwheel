window.jQuery = window.$ = require('jquery');
var processInclude = require('./util');

$(document).ready(function () {
    processInclude(require('./spiningWheel/productWheel'));
    processInclude(require('./spiningWheel/spiningWheel'));

    
});
