'use strict';

var server = require('server');

server.get('log', function (req, res, next) {
    var Logger = require('dw/system/Logger');
    Logger.getLogger("test-file","test-category").warn("Hell00000o");


    res.render('/'
    )

});

module.exports = server.exports();


