var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Transaction = require('dw/system/Transaction');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');



server.post('sendInvite', function (req, res, next) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var UUID = require('dw/util/UUIDUtils');
    var referral_id = UUID.createUUID();
    Transaction.wrap(function () {
        var co = CustomObjectMgr.createCustomObject('SpinningWheel_Referral', referral_id);
        co.custom.sender_id =  req.currentCustomer.raw.profile.customer.customerNo;
        co.custom.isExpired = false;
        co.custom.isUsed = false;
        co.custom.receiver_id = -1;

    });

    next();

});


module.exports = server.exports();



