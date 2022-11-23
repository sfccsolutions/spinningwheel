'use strict';


/**
 * @namespace Home
 */

var server = require('server');
server.extend(module.superModule);
var URLUtils = require('dw/web/URLUtils');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');


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
server.append('Show', function (req, res, next) {

    var spinningWheelURL = URLUtils.url('SpinningWheel-Show');
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var earned_items = productListHelper.getItem(list);
    var temp = earned_items;
    
    res.setViewData({
        spinningWheelURL: spinningWheelURL.toString(),
        earned_items: earned_items

    })

    next();
});

module.exports = server.exports();