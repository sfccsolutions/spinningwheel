'use strict';

var base = module.superModule;

function getProductsForSpinningWheel(){
    var Site = require('dw/system/Site');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var spinerData = Site.current.getCustomPreferenceValue('spinerID');
   
    var spinnerList = [];
    for (var j = 0; j < spinerData.length; j++) {
        var pid = spinerData[j];
        var factoryProduct = ProductFactory.get({pid});
        var spinObj =
        {
            productID: factoryProduct.id,
            productName: factoryProduct.productName,
            productImage: factoryProduct.images.small[0].absURL,
            description: factoryProduct.longDescription
        };
        spinnerList.push(spinObj);

    }

    return spinnerList;


}



module.exports = {

    getProductsForSpinningWheel:getProductsForSpinningWheel

};

Object.keys(base).forEach(function (prop) {

    // eslint-disable-next-line no-prototype-builtins

    if (!module.exports.hasOwnProperty(prop)) {

        module.exports[prop] = base[prop];

    }

});
