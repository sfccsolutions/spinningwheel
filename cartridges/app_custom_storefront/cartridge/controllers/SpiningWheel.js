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
    var Site = require('dw/system/Site');
    var spinerData = Site.current.getCustomPreferenceValue('spinerID');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var apiProduct = [];
    var productImage = [];
    for (var j = 0; j < spinerData.length; j++) {
        var productId = spinerData[j];
        apiProduct[j] = ProductMgr.getProduct(productId);
        var spinParam = {
            pid: productId
        };
        var product = ProductFactory.get(spinParam);
        productImage[j] = product.images.small[0].absURL;
    }
    var spinObjArray = [];
    for (var i = 0; i < spinerData.length; i++) {
        var spinObj =
        {
            productID: apiProduct[i].ID,
            productName: apiProduct[i].name,
            productImage: productImage[i],
            description: apiProduct[i].pageDescription
        };
        spinObjArray.push(spinObj);
    }

    var spinerObj = JSON.stringify(spinObjArray);

    res.render('sw/spiningWheel', {
        items: itemsArray,
        spinerData: spinerData,
        apiProduct: apiProduct,
        spinObj: spinObj,
        spinerObj: spinerObj
    });
    next();
});

module.exports = server.exports();