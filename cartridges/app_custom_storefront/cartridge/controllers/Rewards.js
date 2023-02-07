var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var Transaction = require('dw/system/Transaction');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var Calendar = require('dw/util/Calendar');
var StringUtils = require('dw/util/StringUtils');



server.post('addPoints', function (req, res, next) {
    try {

        var points = req.form.points;
        // var todayDate = StringUtils.formatCalendar(new Calendar(new Date()),"YYYY-MM-dd' 'HH:mm:ss.SSS-0000");
        // var pointsTableItem = points + " " + todayDate;
        var myRewards = req.currentCustomer.raw;
        var temp = myRewards;
        var Site = require('dw/system/Site');
        var loyalty_points = Site.current.getCustomPreferenceValue('converted_points');

        Transaction.wrap(function () {
            req.currentCustomer.raw.profile.custom.rewards += parseInt(points);



        });

        res.json({
            success: true,
            rewards: req.currentCustomer.raw.profile.custom.rewards,
            earned_dollar: req.currentCustomer.raw.profile.custom.rewards * loyalty_points
            // history: req.currentCustomer.raw.profile.custom.rewardHistory

        })


    } catch (error) {
        res.json({
            err : error,
            error: true,
            message: "Can't add points in wallet!"

        })

    }

    next();

});


module.exports = server.exports();