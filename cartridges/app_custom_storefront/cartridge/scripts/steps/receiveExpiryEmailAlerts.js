'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var Calendar = require('dw/util/Calendar');
var StringUtils = require('dw/util/StringUtils');

/**
 * @function receiveExpiryEmailAlerts
 * @description Function that deletes all custom object for a CO type passed as a parameter.
 *
 * @param {Object} parameters Represents the parameters defined in the steptypes.json file
 */
module.exports = {
    receiveExpiryEmailAlerts: function receiveExpiryEmailAlerts(parameters) {
        try {
            var CustomerMgr = require('dw/customer/CustomerMgr');
            var customerList = CustomerMgr.getSiteCustomerList();
            var productListMgr = require('dw/customer/ProductListMgr');
            // var queryProductList = productListMgr.queryProductLists("type = {0}", null, 100);

            var iterator = require('dw/util/Iterator');
            iterator = productListMgr.queryProductLists("type = {0}", null, 100);

            while (iterator.hasNext()) {
                var queryProductList = iterator.next();
                if (queryProductList.items.length > 0) {

                    var temp = queryProductList;
                    for (var item in queryProductList.items) {
                        var expiryDate = queryProductList.items[item].custom.ExpiryDate;
                        var productName = queryProductList.items[item].product.name;
                        var productStatus = queryProductList.items[item].custom.Status;
                        if (!expiryDate) {
                            continue;
                        }
                        var items = queryProductList.items[item];
                        var todayDate = Date.parse(StringUtils.formatCalendar(new Calendar(new Date()), "YYYY-MM-dd"));
                        var alertEmailDate = Date.parse(StringUtils.formatCalendar(new Calendar(new Date(expiryDate.setDate(expiryDate.getDate() - 2))), "YYYY-MM-dd"));
                        var customerEmailData = {
                            "email": queryProductList.owner.profile.email,
                            "product": { expiryDate, productName, productStatus }
                        }

                        if (todayDate === alertEmailDate) {
                            dw.system.HookMgr.callHook('expiry.email', 'send', customerEmailData);
                        }

                    }
                }
            }

        } catch (error) {
            var err = error;
            var dum = err;

        }

    }
};