'use strict';


/**
 * @namespace Home
 */

var server = require('server');
// server.extend(module.superModule);
var cache = require('*/cartridge/scripts/middleware/cache');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var ProductList = require('dw/customer/ProductList');
// var UUIDUtils = require('dw/util/UUIDUtils');
var Transaction = require('dw/system/Transaction');

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
    var addProductUrl = dw.web.URLUtils.url('SpinningWheel-AddProduct');
    var getProductUrl = dw.web.URLUtils.url('SpinningWheel-GetProduct');
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var spinObjArray = spinningWheelHelpers.getProductsForSpinningWheel();
    var spinerObj = JSON.stringify(spinObjArray);

    res.render('sw/spiningWheel', {
        spinerObj: spinerObj,
        addProductUrl: addProductUrl,
        getProductUrl: getProductUrl
    }
    );

    // res.setViewData({
    //     spinerObj: spinerObj
    //    
    // })

    next();
});

server.post('AddProduct', function (req, res, next) {
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var product = JSON.parse(req.querystring.spinObj);
    var pid = product. productID;
    // var pid = req.form.spinObj.productID;


    var config = {
        qty:1,
        productName:  product.productName,
        productImage:  product.productImage,
        description:  product.description,
        req: req,
        type: 100
    };
    var found = productListHelper.itemExists(list, pid, config);
    if (!found) {
        var success = productListHelper.addItem(list, pid, config);
        if (success) {
            res.json({
                success: true,
                pid: pid,
                msg: "The item added successfully!"
            });
        } else {
            res.json({
                error: true,
                pid: pid,
                msg: "Unknowmn error!"
            });
        }

    }

    else {
        // var quantity = found.setQuantityValue(found.quantityValue + config.qty);
        //  var item1 = productListHelper.itemQuantity(list, pid, config);
        res.json({
            error: true,
            pid: pid,
            // quantity: item1,
            msg: "The item already exists."
        })

    }

    next();
});

server.get('GetProduct', function (req, res, next) {
    // var ProductListItemModel = require('*/cartridge/models/productListItem');
    // var result = {};
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var temp = list.items[0].ID
    var temp1 = temp
    // result.success = true;
    res.json({
        success: true
    });
    
    next();
});

module.exports = server.exports();