'use strict';

/**
 * @namespace Order
 */

var server = require('server');
server.extend(module.superModule);

var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.replace(
    'Confirm',
    consentTracking.consent,
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var OrderMgr = require('dw/order/OrderMgr');
        var OrderModel = require('*/cartridge/models/order');
        var Locale = require('dw/util/Locale');

        var order;

        if (!req.form.orderToken || !req.form.orderID) {
            res.render('/error', {
                message: Resource.msg('error.confirmation.error', 'confirmation', null)
            });

            return next();
        }

        order = OrderMgr.getOrder(req.form.orderID, req.form.orderToken);

        if (!order || order.customer.ID !== req.currentCustomer.raw.ID
        ) {
            res.render('/error', {
                message: Resource.msg('error.confirmation.error', 'confirmation', null)
            });

            return next();
        }
        var lastOrderID = Object.prototype.hasOwnProperty.call(req.session.raw.custom, 'orderID') ? req.session.raw.custom.orderID : null;
        if (lastOrderID === req.querystring.ID) {
            res.redirect(URLUtils.url('Home-Show'));
            return next();
        }

        var config = {
            numberOfLineItems: '*'
        };

        var currentLocale = Locale.getLocale(req.locale.id);

        var orderModel = new OrderModel(
            order,
            { config: config, countryCode: currentLocale.country, containerView: 'order' }
        );
        var passwordForm;

        var reportingURLs = reportingUrlsHelper.getOrderReportingURLs(order);
        var Site = require('dw/system/Site');
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
        var CustomerMgr = require('dw/customer/CustomerMgr')
        var Transaction = require('dw/system/Transaction');
        var curr_customer = req.currentCustomer;

        if ('referral_id' in req.currentCustomer.raw.profile.custom) {
            var referral_id = req.currentCustomer.raw.profile.custom.referral_id;
            try {
                var discounts = CustomObjectMgr.getCustomObject('SpinningWheel_Referral', referral_id);
                // Transaction.wrap(function () {
                if (req.currentCustomer.raw.orderHistory.orderCount === 1) {
                    Transaction.wrap(function () {
                        // var temp = "anber";
                        var rewardPoints = Site.current.getCustomPreferenceValue('rewardPoints');
                        var earned_rewards = 0;
                        for (let index = 0; index < rewardPoints.length; index++) {
                            let discounted_price = JSON.parse(rewardPoints[index]);
                            let total = orderModel.totals.grandTotal.substring(1);
                            let new_total = parseInt(total);
                            if (index === 0 && new_total < discounted_price.amount) {
                                break;

                            }
                            else if (new_total < discounted_price.amount) {
                                rewardPoints = JSON.parse(rewardPoints[index - 1]).reward;
                                break;

                            }
                            else if (new_total === discounted_price.amount || index === rewardPoints.length - 1) {
                                rewardPoints = discounted_price.reward;
                                break;


                            }

                        }

                        // var discounts = CustomObjectMgr.getCustomObject('SpinningWheel_Referral', referral_id);
                        var sender_id = discounts.custom.sender_id;
                        var customer = CustomerMgr.getCustomerByCustomerNumber(sender_id);
                        var customerProfile = customer.getProfile();

                        customerProfile.custom.rewards += parseInt(rewardPoints);
                        discounts.custom.isUsed = true;
                        req.currentCustomer.raw.profile.custom.referral_id = "";
                        CustomObjectMgr.remove(discounts);


                        // });

                    });

                }



            } catch (error) {
                var err = error;
                var temp1 = err;

            }


        }


        if (!req.currentCustomer.profile) {
            passwordForm = server.forms.getForm('newPasswords');
            passwordForm.clear();
            res.render('checkout/confirmation/confirmation', {
                order: orderModel,
                returningCustomer: false,
                passwordForm: passwordForm,
                reportingURLs: reportingURLs,
                orderUUID: order.getUUID()
            });
        } else {
            res.render('checkout/confirmation/confirmation', {
                order: orderModel,
                returningCustomer: true,
                reportingURLs: reportingURLs,
                orderUUID: order.getUUID()
            });
        }

        req.session.raw.custom.orderID = req.querystring.ID; // eslint-disable-line no-param-reassign

        return next();
    }

);

module.exports = server.exports();