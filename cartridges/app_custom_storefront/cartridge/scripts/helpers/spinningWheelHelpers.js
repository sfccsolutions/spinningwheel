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

module.exports = {
    getProductsForSpinningWheel: getProductsForSpinningWheel
}