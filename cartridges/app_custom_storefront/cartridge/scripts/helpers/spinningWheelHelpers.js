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

function validateEmail(recipients) {
    var emailErrors = [];
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    var emails = recipients.split(',');
    emails.forEach(function (email) {

        if (!regex.test(email)) {
            emailErrors.push(email);

        }

    });

    return emailErrors;

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

function sharePage(recipients, page_url){
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Resource = require('dw/web/Resource');

    var emailObj = {
        to: null,
        subject: "Spinning Wheel Page Details",
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') ||
            'no-reply@testorganization.com'
    };
    var recipientArr = recipients.split(',');
    var myPageUrl = {page_url};
    recipientArr.forEach(function (email) {
        emailObj.to = email;
        emailHelpers.sendEmail(
            emailObj,
            'email/shareWheelPage',
            myPageUrl
        );
    });

}




module.exports = {
    getProductsForSpinningWheel: getProductsForSpinningWheel,
    getProducts: getProducts,
    validateEmail: validateEmail,
    sendEmail: sendEmail,
    sharePage: sharePage
}