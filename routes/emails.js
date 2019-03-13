var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var CONSTANT = require('./../config/constant');
var STATUS = require('./../config/status');
var DUMMY = require('./../config/dummy');

var EMAILES = require('./../model/emails');

var EMAIL_SERVICE = require('./../service/emailService');

/**
 * @api {post} /v1/emails 1. Send Email
 * @apiVersion 1.0.0
 * @apiName SendEmail
 * @apiGroup Emails 
 * @apiDescription 
 * @apiPermission none
 * 
 * @apiParam {String} to The email address that `email` should be delivered to.
 * @apiParam {String} subject The `subject` of `email`
 * @apiParam {String} content The `email` content
 * 
 * @apiSuccess {String} id Unique `id` for this email request. eg : `5c8820162d958994f71cbfa6`
 * @apiSuccess {String} status Include three status `SENT`, `QUEUED` and `FAILED`
 * 
 * @apiSuccessExample {json} Success-Response:   
 *     {
 *       "id": "5c8820162d958994f71cbfa6",
 *       "status" : "SENT" 
 *     }
 *
 * @apiError ValidationError `to`, `subject` and `content` are required
 * @apiError EmailValidationError `email` address is invalid format
 * 
 *
 * @apiErrorExample Error-Response:
 *     Error 400 Bad Request
 *     {
 *       "error": "ValidationError",
 *       "message": "`subject` is required"
 *     }
 */
router.post('/', function(req, res, next) {
  
    var emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Required Parameters Validation
    if(!req.body.to){
        return res.status(400).json({ error: "ValidationError", message: "`to` The email address is required as to" });          
    }else if(!req.body.subject){
        return res.status(400).json({ error: "ValidationError", message: "`subject` is required" });          
    }else if(!req.body.content){
        return res.status(400).json({ error: "ValidationError", message: "`content` is required" });          
    
        // Email format Validation
    }else if(!emailRegx.test(String(req.body.to).toLowerCase())){
      return res.status(400).json({error : "EmailValidationErr", message: "`email` is invalid format. value: `" + req.body.to});
    }else{

        let nowTime = new Date();    
        let status = (nowTime.getHours() < CONSTANT.office.open || nowTime.getHours() > CONSTANT.office.close ) ? STATUS.QUEUED: null;
        let newEmail = new EMAILES({
            to: req.body.to,
            subject: req.body.subject,
            content: req.body.content,
            status: status
        })
        newEmail.save(function(err, result){
            if(err){
                return res.status(500).jsonp({error : err })
            }
            if(result.status === STATUS.QUEUED){
                return res.status(200).json({ id : result._id, status : result.status })
            }else{
                let emailInfo = { to: result.to, subject: result.subject, content: result.content };
                /** Email Sending Here */
                EMAIL_SERVICE.sendEmail(emailInfo, function(err, message){                
                    if(err){
                        result.status = STATUS.FAILED;   
                    }else{
                        result.status = STATUS.SENT;
                    }                    
                    result.save(function(err2, result2){                
                        if(err2){
                            return res.status(500).jsonp({error : err2 })
                        }                    
                        return res.status(200).json({ id: result2.id, status: result2.status })
                    })                
                })
            }
        })
    }
});

/**
 * @api {GET} /v1/emails/:id 2. Get Email Info
 * @apiVersion 1.0.0
 * @apiName GetEmailInfo
 * @apiGroup Emails 
 * @apiDescription 
 * @apiPermission none
 * 
 * @apiParam {String} id “:id” represents the unique email ID that was returned to the developer when she
sent a new email via [POST] /v1/emails endpoint.
 * 
 * 
 * @apiSuccess {String} id Unique `id` for this email request. eg : `5c8820162d958994f71cbfa6`
 * @apiSuccess {String} status Include three status `SENT`, `QUEUED` and `FAILED`
 * 
 * @apiSuccessExample {json} Success-Response:   
 *     {
 *       "id": "5c8820162d958994f71cbfa6",
 *       "status" : "SENT" 
 *     }
 *
 * @apiError ValidationError `id` is invalid format. id : invalid-fomrat-id
 * @apiError NotFound  given `id` is not found. id : 5c8820162d958994f71cbfa6.
 *
 * @apiErrorExample Error-Response:
 *     Error 400 Bad Request
 *     {
 *       "error": "ValidationError",
 *       "message": "`id` is invalid format. id : invalid-fomrat-id"
 *     }
 */
router.get('/:id', function(req, res, next) {
  
    if(ObjectId.isValid(req.params.id)){
        EMAILES.findById({ _id: ObjectId(req.params.id)}, function(err, result){
            if(err){
                return res.status(500).json({error: err })
            }
            if(result){
                return res.status(200).json({ id: req.params.id, status: result.status })
            }else{
                return res.status(404).json({ error: "NotFound", message: "given `id` is not found. id : " + req.params.id });                  
            }
        })
    }else{
        return res.status(400).json({ error: "ValidationError", message: "`id` is invalid format. id :" + req.params.id });          
    }    
});


/**
 * @api {DELETE} /v1/emails/:id 3. Delete Email Info
 * @apiVersion 1.0.0
 * @apiName DeleteEmailInfo
 * @apiGroup Emails 
 * @apiDescription 
 * @apiPermission none
 * 
 * @apiParam {String} id “:id” represents the unique email ID that was returned to the developer when she
sent a new email via [POST] /v1/emails endpoint.
 * 
 * @apiSuccess {String} id Unique `id` for this email request. eg : `5c8820162d958994f71cbfa6`
 * @apiSuccess {String} delete if deleted `true` else `false`
 * 
 * @apiSuccessExample {json} Success-Response:   
 *     {
 *       "id": "5c8820162d958994f71cbfa6",
 *       "deleted" : "true" 
 *     }
 *
 * @apiError ValidationError `id` is invalid format. id : invalid-fomrat-id
 * @apiError NotFound  given `id` is not found. id : 5c8820162d958994f71cbfa6.
 *
 * @apiErrorExample Error-Response:
 *     Error 400 Bad Request
 *     {
 *       "error": "ValidationError",
 *       "message": "`id` is invalid format. id : invalid-fomrat-id"
 *     }
 */
router.delete('/:id', function(req, res, next) {
  
    if(ObjectId.isValid(req.params.id)){
        EMAILES.findById(req.params.id, function(err, result){
            if(err){
                return res.status(500).json({error: err })
            }
            if(result){                
                EMAILES.deleteOne({ _id: ObjectId(req.params.id) }, function (err) {        
                    if(err){
                        return res.status(200).json({ id: req.params.id, deleted: false })
                    }
                    return res.status(200).json({ id: req.params.id, deleted: true })
                });        
            }else{
                return res.status(404).json({ error: "NotFound", message: "given `id` is not found. id : " + req.params.id });                  
            }
        })
    }else{
        return res.status(400).json({ error: "ValidationError", message: "`id` is invalid format. id :" + req.params.id });          
    }    

});

module.exports = router;
