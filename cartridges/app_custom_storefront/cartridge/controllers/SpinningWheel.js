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
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

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
server.get('Show', userLoggedIn.validateLoggedIn, function (req, res, next) {
    var Site = require('dw/system/Site');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var spinerOptions = Site.current.getCustomPreferenceValue('spinerOptions');
    var addProductUrl = dw.web.URLUtils.url('SpinningWheel-AddProduct');
    var getProductUrl = dw.web.URLUtils.url('SpinningWheel-GetProduct');
    var removeProductUrl = dw.web.URLUtils.url('SpinningWheel-removeSelectedProduct');
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var spinObjArray = spinningWheelHelpers.getProductsForSpinningWheel();
    var spinerObj = JSON.stringify(spinObjArray);

    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var earned_items = productListHelper.getItem(list);

    res.render('sw/spiningWheel', {
        spinerObj: spinerObj,
        addProductUrl: addProductUrl,
        getProductUrl: getProductUrl,
        removeProductUrl: removeProductUrl,
        earned_items: earned_items,
        spinerOptions: spinerOptions


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
    var spinObj = req.form;
    // var product = req.form.spinObj;
    var pid = spinObj.productID;
    // var pid = req.form.spinObj.productID;


    var config = {
        qty: 1,
        productName: spinObj.productName,
        productImage: spinObj.productImage,
        description: spinObj.description,
        req: req,
        type: 100
    };
    var found = productListHelper.itemExists(list, pid);
    // if (!found) {
    var success = productListHelper.addItem(list, pid, config);
    var getProductUrl = dw.web.URLUtils.url('SpinningWheel-GetProduct');
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

        // else {

        //     // var quantity = found.setQuantityValue(found.quantityValue + config.qty);
        //     var updated_quantity = productListHelper.itemQuantity(list, pid, config);
        //     if(updated_quantity){
        //         res.json({
        //             message: "The quantity is successfully updated!"
        //         })
        //     }
        //     else {
        //         res.json({
        //             message: " The quantity is not updated yet!"
        //         })
        //     }
        // res.json({
        //     error: true,
        //     pid: pid,
        //     updated_quantity: updated_quantity,
        //     msg: "The item already exists."
        // })

    }

    next();
});

server.get('GetProduct', function (req, res, next) {
    try {
        var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
        var product_item = productListHelper.getItem(list);
        // var dummy = product_item[0].product_status;
        var abc = product_item;

        res.json({
            product_item: product_item,
            success: true
            // dummy: dummy
        });

    } catch (error) {
        var err = error;
        var ab = err;

    }

    next();
});

server.post('removeSelectedProduct', function (req, res, next) {
    var pid = req.form.deleteProduct;
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var removeProduct = productListHelper.removeItem(list, pid);

    if (typeof pid === undefined || !pid) {
        res.json({
            error: true,
            message: "The product id is not defined."
        })

    }

    res.json({
        success: true,
        removeProduct: removeProduct

    });

    next();
});


module.exports = server.exports();