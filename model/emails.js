var mongoose = require('mongoose');

var emailsSchema = new mongoose.Schema({
    
    to : { type: String, required: true },          // email here 
    subject : { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String }

}, { timestamps : true } )

module.exports = mongoose.model('Emails', emailsSchema);;