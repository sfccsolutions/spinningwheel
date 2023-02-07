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
    var enable_SpinningWheel = Site.current.getCustomPreferenceValue('Enable_SpinningWheel');
    var loyalty_points = Site.current.getCustomPreferenceValue('converted_points');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var spinerOptions = Site.current.getCustomPreferenceValue('spinerOptions');
    var shareProductUrl = URLUtils.url('SpinningWheel-shareProduct');
    var shareWheelPageUrl = URLUtils.url('SpinningWheel-shareWheelPage');
    var updateSpinCountUrl = URLUtils.url('SpinningWheel-updateSpinCount');
    var walletUrl = URLUtils.url('Rewards-addPoints');
    var addProductUrl = URLUtils.url('SpinningWheel-AddProduct');
    var getProductUrl = URLUtils.url('SpinningWheel-GetProduct');
    var removeProductUrl = URLUtils.url('SpinningWheel-removeSelectedProduct');
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var spinObjArray = spinningWheelHelpers.getProductsForSpinningWheel();
    // var spin_wheel = false;
    var spinWheelDuration = spinningWheelHelpers.spinWheelDuration(req);
    var spinerObj = JSON.stringify(spinObjArray);

    var rewards = req.currentCustomer.raw.profile.custom.rewards;
    if (!rewards) {
        rewards = 0;
    }

    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 100 });
    var earned_items = productListHelper.getItem(list);

    res.render('sw/spiningWheel', {
        spinerObj: spinerObj,
        addProductUrl: addProductUrl,
        getProductUrl: getProductUrl,
        removeProductUrl: removeProductUrl,
        earned_items: earned_items,
        spinerOptions: spinerOptions,
        shareProductUrl: shareProductUrl,
        shareWheelPageUrl: shareWheelPageUrl,
        walletUrl: walletUrl,
        rewards: rewards,
        enable_SpinningWheel: enable_SpinningWheel,
        loyalty_points: loyalty_points,
        updateSpinCountUrl: updateSpinCountUrl,
        spinWheelDuration: spinWheelDuration,
        addToCartUrl: addToCartUrl

    }
    );

    next();
});


server.post('updateSpinCount', function (req, res, next) {
    var Site = require('dw/system/Site');
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var enable_SpinningWheel = Site.current.getCustomPreferenceValue('Enable_SpinningWheel');
    var Transaction = require('dw/system/Transaction');
    var spinningWheelDuration = spinningWheelHelpers.spinWheelDuration(req);
    if (spinningWheelDuration && enable_SpinningWheel) {
        Transaction.wrap(function () {
            req.currentCustomer.raw.profile.custom.last_spin_date = new Date();
            req.currentCustomer.raw.profile.custom.spin_count += 1;

            res.json({
                success: true,
                message: "The count has been updated!"

            })

        });

    }

    else {
        if (!(spinningWheelDuration && enable_SpinningWheel)) {
            res.json({
                error: true,
                message: "The wheel is not enabled & the daily limit is up!"
            })

        }

        else if (!(enable_SpinningWheel)) {
            res.json({
                error: true,
                message: "You can't spin the wheel as there are no offers available right now."
            })

        }
        else {
            res.json({
                error: true,
                message: "You can't spin the wheel as the daily limit has been reached!"

            })
        }


    }

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
    // var found = productListHelper.itemExists(list, pid);
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
    var temp = removeProduct;

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


server.post('shareProduct', function (req, res, next) {
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var productId = req.form.productID;
    var url = URLUtils.https("Product-Show");
    var recipients = req.form.listOfEmails;
    var invalidEmail = spinningWheelHelpers.validateEmail(recipients);
    if (invalidEmail && invalidEmail.length < 1) {
        var getProduct = spinningWheelHelpers.getProducts(productId);
        var sendEmail = spinningWheelHelpers.sendEmail(recipients, url, getProduct, productId);
        res.json({
            success: true

        })
    }
    else {
        res.json({
            error: true
        });

    }



    next();


});

server.post('shareWheelPage', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var spinningWheelHelpers = require('*/cartridge/scripts/helpers/spinningWheelHelpers');
    var page_url = URLUtils.https("SpinningWheel-Show");
    var recipient = req.form.email;
    var invalidEmail = spinningWheelHelpers.validateEmail(recipient);
    if (invalidEmail) {
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
        var UUID = require('dw/util/UUIDUtils');
        var referral_id = UUID.createUUID();
        Transaction.wrap(function () {
            var co = CustomObjectMgr.createCustomObject('SpinningWheel_Referral', referral_id);
            co.custom.sender_id = req.currentCustomer.raw.profile.customerNo;
            co.custom.isExpired = false;
            co.custom.isUsed = false;
            co.custom.receiver_id = -1;

        });
        page_url += "?referral=" + referral_id;
        var sendEmail = spinningWheelHelpers.sharePage(recipient, page_url);
        res.json({
            success: true
        })
    }
    else {
        res.json({
            error: true
        });

    }

    next();

});

server.post('sendExpiryEmailAlert', function (req, res, next) {
    var url = URLUtils.https("Product-Show");
    var recipients = req.form.listOfEmails;
    var invalidEmail = spinningWheelHelpers.validateEmail(recipients);
    if (invalidEmail && invalidEmail.length < 1) {
        var getProduct = spinningWheelHelpers.getProducts(productId);
        var sendEmail = spinningWheelHelpers.sendEmail(recipients, url, getProduct, productId);
        res.json({
            success: true

        })
    }
    else {
        res.json({
            error: true
        });

    }



    next();
 

});

module.exports = server.exports();