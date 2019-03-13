/** npm lib **/
var emailJs = require("emailjs/email");

/** define config */
var EMAIL = require('./../config/email');

/** init */
var EmailService = {};

/** set function */
EmailService.sendEmail = sendEmail;

/** exports */
module.exports = EmailService;

/** ------------------- config email server here -------------------- */
var server  = emailJs.server.connect({
    user :      EMAIL.SERVER.USER,
    password :  EMAIL.SERVER.PASSWORD,
    host :      EMAIL.SERVER.HOST,
    ssl :       true
});
/** ----------------------------------------------------------------- */

/**
 *  @description :: Sending Email Common Function
 *
 *  @param {object} info
 *      => to
 *      => subject
 *      => data
 *
 *  */
function sendEmail(info, cb) {

    var emailInfo = {
        from:   EMAIL.NO_REPLY_EMAIL,
        to:     info.to,
        subject: info.subject,
        text: info.content
    };
    server.send(emailInfo, function (err, message) {

        console.log(" Email ", err, message)
        if(err){
            return cb(err, null)
        }
        return cb(null, message)
    });
}
