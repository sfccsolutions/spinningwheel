'use strict';


/**
 * @typedef config
 * @type Object
 * @property {number} type - a number for what type of product list is being created
 */
/**
 * Returns the customer's current list based on type. If the customer is requesting a wishlist that doesn't exist, a new wishlist will be created
 * @param {dw.customer.Customer} customer - current customer
 * @param {Object} config - configuration object
 * @return {dw.customer.ProductList} list - target productList
 */

function getList(customer, config) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var type = config.type;
    var list;
    if (type === 100) {
        var productLists = productListMgr.getProductLists(customer, type);
        list = productLists.length > 0
            ? productLists[0]
            : null;
    }
    else {
        list = null;
    }
    return list;
}

function createList(customer, config) {
    var Transaction = require('dw/system/Transaction');
    var ProductListMgr = require('dw/customer/ProductListMgr');
    var list;

    if (config.type === 100) {
        Transaction.wrap(function () {
            list = ProductListMgr.createProductList(customer, config.type);
        });
    }

    else {

        list = null;
    }

    return list;

}

function getCurrentOrNewList(customer, config) {
    var type = config.type;
    var list = getList(customer, config);
    if (list === null && type === 100) {
        list = createList(customer, { type: type });
    }
    return list;
}

/**
 * @typedef config
 * @type Object
 */
/**
 * loop through the products and match the id
 * @param {dw.customer.ProductList} list - target productList
 * @param {string} pid - The product's id
 * @param {Object} config - configuration object
 * @return {boolean} - boolean based on if the pid exists with the productList
 */

function itemExists(list, pid, config) {
    var listItems = list.items.toArray();
    var found = false;
    listItems.forEach(function (item) {
        if (item.productID === pid) {
            found = item;
        }
    });

    return found;

}



/**
 * @typedef config
 * @type Object
 */
/**
 * Add an Item to the current customers wishlist
 * @param {dw.customer.ProductList} list - target productList
 * @param {string} pid - The product's variation model
 * @param {Object} config - configuration object
 * @return {boolean} - boolean based on if the product was added to the wishlist
 */
function addItem(list, pid, config) {
    var Transaction = require('dw/system/Transaction');

    var ProductMgr = require('dw/catalog/ProductMgr');
    var apiProduct = ProductMgr.getProduct(pid);

    if (apiProduct && list) {
        try {
            Transaction.wrap(function () {
                var productlistItem = list.createProductItem(apiProduct);
              
            });
            return true;
        }
        catch (e) {
            return false;
        }

    }
   
    return false;
}


// function itemQuantity(list, pid, config) {
//     var Transaction = require('dw/system/Transaction');
//     var itemExist = itemExists(list, pid, config)
//     if(itemExist && config.type === 100){
//         Transaction.wrap(function (){
//             var quantity = itemExist.setQuantityValue(itemExist.quantityValue + config.qty);
//         });
//     }

//     return true;
// }
   

module.exports = {
    getCurrentOrNewList: getCurrentOrNewList,
    itemExists: itemExists,
    addItem: addItem
    // itemQuantity: itemQuantity


};
