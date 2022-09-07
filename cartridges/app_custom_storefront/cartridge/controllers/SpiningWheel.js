'use strict';


/**
 * @namespace Home
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Home-Show
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.get('Show', function (req, res, next) {
    let itemsArray = ['Car', 'voucher', 'bonus', ' delivery', 'Bike', 'shipping', 'Diamond', 'Shirt'];

    res.render('sw/spiningWheel', {
        items: itemsArray
    });
    next();
});

module.exports = server.exports();