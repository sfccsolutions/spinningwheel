
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

function itemExists(list, pid) {
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
    var Site = require('dw/system/Site');
    var ExpiryDate = Site.current.getCustomPreferenceValue('SPW_ExpiryPeriod');


    if (apiProduct && list) {
        try {
            var productListItem;
            var ex_date = new Date();
            var current_date = ex_date.setDate(ex_date.getDate() + 7);
            // var months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            // var current_datetime = new Date();
            // var formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();

            // var datee = formatted_date;

            Transaction.wrap(function () {
                productListItem = list.createProductItem(apiProduct);
                var dummy = productListItem;
                productListItem.custom.ExpiryDate = ex_date;
                productListItem.custom.Status = "Available";

            });
            var abc = "001";
            return true;
        }
        catch (e) {

            var error = e;
            var err = error;
            return false;
        }

    }

    return false;
}


function getItem(list) {
    var Transaction = require('dw/system/Transaction');
    var empty_list = [];
    var now = Date.now();

    try {
        // removeList(list);
        Transaction.wrap(function () {
            for (var item in list.items) {
                // var tempp = list.items[item].custom;
                var product_name = list.items[item].product.name;
                var product_list_item_id = list.items[item].ID;
                var product_id = list.items[item].productID;
                var product_expiry = list.items[item].custom.ExpiryDate.toDateString();
                var product_status = list.items[item].custom.Status;


                if (Date.parse(product_expiry) <= now && product_status === "Available") {
                    product_status = "Expired";
                    list.items[item].custom.Status = "Expired";
                }

                empty_list.push({ product_name, product_expiry, product_status, product_id, product_list_item_id });

            }
            
        });

        return empty_list;


    } catch (error) {
        var e = error;
        var temp2 = e;

    }

}

function removeList(list) {
    var ProductListMgr = require('dw/customer/ProductListMgr');
    var Transaction = require('dw/system/Transaction');
    Transaction.wrap(function () {
        ProductListMgr.removeProductList(list);
    });

}

function removeItem(list, pid) {
    var Transaction = require('dw/system/Transaction');
    // var result = {};
    try {
        var item = list.getItem(pid);
        Transaction.wrap(function () {
            list.removeItem(item);
        });

        return true;

    } catch (error) {
        var e = error;
        var err = error;

    }

    return false;

}

module.exports = {
    getCurrentOrNewList: getCurrentOrNewList,
    itemExists: itemExists,
    addItem: addItem,
    getItem: getItem,
    removeList: removeList,
    removeItem: removeItem

};
