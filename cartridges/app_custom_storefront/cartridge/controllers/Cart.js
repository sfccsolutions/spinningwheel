'use strict';

/**
 * @namespace Cart
 */

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

/**
 * Cart-AddProduct : The Cart-MiniCart endpoint is responsible for displaying the cart icon in the header with the number of items in the current basket
 * @name Base/Cart-AddProduct
 * @function
 * @memberof Cart
 * @param {httpparameter} - pid - product ID
 * @param {httpparameter} - quantity - quantity of product
 * @param {httpparameter} - options - list of product options
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */

server.replace('AddProduct', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var Transaction = require('dw/system/Transaction');
    var CartModel = require('*/cartridge/models/cart');
    var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');


    var productFromSpinningWheel = req.form.isComingFromSpinningWheel;
    if (productFromSpinningWheel) {

        var SW_cartHelper = require('*/cartridge/scripts/cart/SW_cartHelpers');

        var percentageDiscount = require('dw/campaign/PercentageDiscount');
        var currentBasket = BasketMgr.getCurrentOrNewBasket();
        var productId = req.form.pid;
        var defaultShipment = currentBasket.defaultShipment;

        Transaction.wrap(function () {
            var productLineItem = currentBasket.createProductLineItem(productId, defaultShipment);
            var adjustedProductPrice = productLineItem.createPriceAdjustment('SpinningWheelProductDiscount', percentageDiscount(100));

            if (currentBasket) {
                var result = SW_cartHelper.addProductToCart(currentBasket, productId, quantity, {}, {});
                var temp = result;
            }
        });


        res.json({
            message: "Hello"
        })


    }

    else {

        var currentBasket = BasketMgr.getCurrentOrNewBasket();
        var previousBonusDiscountLineItems = currentBasket.getBonusDiscountLineItems();
        var productId = req.form.pid;
        var childProducts = Object.hasOwnProperty.call(req.form, 'childProducts')
            ? JSON.parse(req.form.childProducts)
            : [];
        var options = req.form.options ? JSON.parse(req.form.options) : [];
        var quantity;
        var result;
        var pidsObj;

        if (currentBasket) {
            Transaction.wrap(function () {
                if (!req.form.pidsObj) {
                    quantity = parseInt(req.form.quantity, 10);
                    result = cartHelper.addProductToCart(
                        currentBasket,
                        productId,
                        quantity,
                        childProducts,
                        options
                    );
                } else {
                    // product set
                    pidsObj = JSON.parse(req.form.pidsObj);
                    result = {
                        error: false,
                        message: Resource.msg('text.alert.addedtobasket', 'product', null)
                    };

                    pidsObj.forEach(function (PIDObj) {
                        quantity = parseInt(PIDObj.qty, 10);
                        var pidOptions = PIDObj.options ? JSON.parse(PIDObj.options) : {};
                        var PIDObjResult = cartHelper.addProductToCart(
                            currentBasket,
                            PIDObj.pid,
                            quantity,
                            childProducts,
                            pidOptions
                        );
                        if (PIDObjResult.error) {
                            result.error = PIDObjResult.error;
                            result.message = PIDObjResult.message;
                        }
                    });
                }
                if (!result.error) {
                    cartHelper.ensureAllShipmentsHaveMethods(currentBasket);
                    basketCalculationHelpers.calculateTotals(currentBasket);
                }
            });
        }

        var quantityTotal = ProductLineItemsModel.getTotalQuantity(currentBasket.productLineItems);
        var cartModel = new CartModel(currentBasket);

        var urlObject = {
            url: URLUtils.url('Cart-ChooseBonusProducts').toString(),
            configureProductstUrl: URLUtils.url('Product-ShowBonusProducts').toString(),
            addToCartUrl: URLUtils.url('Cart-AddBonusProducts').toString()
        };

        var newBonusDiscountLineItem =
            cartHelper.getNewBonusDiscountLineItem(
                currentBasket,
                previousBonusDiscountLineItems,
                urlObject,
                result.uuid
            );
        if (newBonusDiscountLineItem) {
            var allLineItems = currentBasket.allProductLineItems;
            var collections = require('*/cartridge/scripts/util/collections');
            collections.forEach(allLineItems, function (pli) {
                if (pli.UUID === result.uuid) {
                    Transaction.wrap(function () {
                        pli.custom.bonusProductLineItemUUID = 'bonus'; // eslint-disable-line no-param-reassign
                        pli.custom.preOrderUUID = pli.UUID; // eslint-disable-line no-param-reassign
                    });
                }
            });
        }

        var reportingURL = cartHelper.getReportingUrlAddToCart(currentBasket, result.error);

        res.json({
            reportingURL: reportingURL,
            quantityTotal: quantityTotal,
            message: result.message,
            cart: cartModel,
            newBonusDiscountLineItem: newBonusDiscountLineItem || {},
            error: result.error,
            pliUUID: result.uuid,
            minicartCountOfItems: Resource.msgf('minicart.count', 'common', null, quantityTotal)
        });
    }

    next();
});

module.exports = server.exports();