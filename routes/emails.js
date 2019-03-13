var express = require('express');
var router = express.Router();

var STATUS = require('./../config/status');
var DUMMY = require('./../config/dummy');

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

        // 1. Email Info Dump in MongoDB as Email collection.
        // 2. Send Email with Email Info
        // 3. Update Email collection after email sent or not. update as SENT, QUEUED or FAILED
        return res.status(200).json({ id: DUMMY.id, status: STATUS.SENT })

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
  
    // 1. Checking id is valid format 
        // 400 id invalid format 
    // 2. Id find in DB
    // 3.1 if find 
        // 200 result
    // 3.2 else
        // 404 not found     
    return res.status(200).json({ id: DUMMY.id, status: STATUS.SENT })
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
  
    // 1. Checking id is valid format 
        // 400 id invalid format 
    // 2. Id find in DB
    // 3.1 if find delete
        // 200 result
    // 3.2 else
        // 404 not found     
    return res.status(200).json({ id: DUMMY.id, deleted: true })
});

module.exports = router;
