'use strict';

exports.send = function (customerEmailData) {
    var HashMap = require('dw/util/HashMap');
    var Mail = require('dw/net/Mail');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var Template = require('dw/util/Template');

    var context = new HashMap();
    var email = new Mail();
    var template = new Template('/expiryEmail/productExpiry');
    var content = template.render(context).text;

    email.addTo(customerEmailData.email);
    email.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail'));
    email.setSubject("Product Expiry Alert");
    email.setContent(content, 'text/html', 'UTF-8');
    email.send();
}