'use strict';

function getProductsForSpinningWheel() {
    var Site = require('dw/system/Site');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var spinerOptions = Site.current.getCustomPreferenceValue('spinerOptions');
    if (spinerOptions.value === "Products") {
        var spinerData = Site.current.getCustomPreferenceValue('spinerID');

        var spinnerList = [];
        for (var j = 0; j < spinerData.length; j++) {
            var pid = spinerData[j];
            var factoryProduct = ProductFactory.get({ pid });
            var SpinProductModel = require('*/cartridge/models/spinProduct');
            var spinObj = new SpinProductModel(factoryProduct.id, factoryProduct.productName, factoryProduct.images.small[0].absURL, factoryProduct.shortDescription);
            var temp = spinObj;
            // {
            //     productID: factoryProduct.id,
            //     productName: factoryProduct.productName,
            //     productImage: factoryProduct.images.small[0].absURL,
            //     description: factoryProduct.shortDescription
            // };
            spinnerList.push(spinObj);

        }

        return spinnerList;

    }

    else {
        var spinerPoints = Site.current.getCustomPreferenceValue('spinerPoints');

        return spinerPoints;

    }
}




function validateEmail(recipient) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    if (!regex.test(recipient)) {
        return false;
    }

    return true;

}

function getProducts(pid) {
    var Site = require('dw/system/Site');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var factoryProduct = ProductFactory.get({ pid });
    var SpinProductModel = require('*/cartridge/models/spinProduct');
    var spinObj = new SpinProductModel(factoryProduct.id, factoryProduct.productName, factoryProduct.images.small[0].absURL, factoryProduct.shortDescription);

    return spinObj;

}


function sendEmail(recipients, url, getProduct, productId) {
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Resource = require('dw/web/Resource');
    // var emailData = {};
    // var urlandparams = url.split('?');
    // var newUrl = urlandparams[0];
    // var params = urlandparams[1].split('&');
    // emailData.basketModel = basketModel;
    // emailData.token = params[0].split('token=')[1];
    // emailData.lineItems = params[1].split('lineItems=')[1];
    // emailData.url = newUrl;
    getProduct.url = url;
    getProduct.productId = productId;
    var emailObj = {
        to: null,
        subject: "Product Details",
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') ||
            'no-reply@testorganization.com'
    };
    var recipientArr = recipients.split(',');
    recipientArr.forEach(function (email) {
        emailObj.to = email;
        emailHelpers.sendEmail(
            emailObj,
            'email/sendEmail',
            getProduct
        );
    });
}

function sharePage(recipient, page_url) {
    var Site = require('dw/system/Site');
    var share_spinningwheel_page = Site.current.getCustomPreferenceValue('share_WheelPage');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Resource = require('dw/web/Resource');

    if (share_spinningwheel_page) {
        var emailObj = {
            to: null,
            subject: "Spinning Wheel Page Details",
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') ||
                'no-reply@testorganization.com'
        };
        var recipientArr = recipient.split(',');
        var myPageUrl = { page_url };
        recipientArr.forEach(function (email) {
            emailObj.to = email;
            emailHelpers.sendEmail(
                emailObj,
                'email/shareWheelPage',
                myPageUrl
            );
        });
    }
}


function spinWheelDuration(req) {
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var todayDate = StringUtils.formatCalendar(new Calendar(new Date()), "YYYY-MM-dd");
    var Site = require('dw/system/Site');
    var max_spin_count = Site.current.getCustomPreferenceValue('max_spin_count');
    var current_customer = req.currentCustomer.raw.profile.custom;
    var last_spin_date = req.currentCustomer.raw.profile.custom.last_spin_date;
    var formatted_last_spin_date = StringUtils.formatCalendar(new Calendar(new Date()), "YYYY-MM-dd");
    var spin_count = req.currentCustomer.raw.profile.custom.spin_count;
    var spin_wheel = false;
    // var now = new Date();

    if (max_spin_count > 0) {
        if (!('spin_count' in current_customer && 'last_spin_date' in current_customer)) {
            spin_wheel = true;

        }

        else {
            if (todayDate === formatted_last_spin_date) {
                if (spin_count < max_spin_count) {
                    spin_wheel = true;
                }
                else {
                    spin_wheel = false;
                }

            }
            else {
                // reset the counter and check if the date is changed or not
                var Transaction = require('dw/system/Transaction');
                Transaction.wrap(function () {
                    last_spin_date = req.currentCustomer.raw.profile.custom.last_spin_date;
                    var spin_count = 0;

                });

            }
        }

    }

    else {
        spin_wheel = false;

    }

    return spin_wheel;

}

module.exports = {
    getProductsForSpinningWheel: getProductsForSpinningWheel,
    getProducts: getProducts,
    validateEmail: validateEmail,
    sendEmail: sendEmail,
    sharePage: sharePage,
    spinWheelDuration: spinWheelDuration
}