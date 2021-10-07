/**
 * Created by KaSha on 2017. 4. 6..
 */
var express = require('express');
var router = express.Router();

//루트 디렉토리 경로
var rootPath = require('path').resolve('');
var FileUpload = require(rootPath + "/utils/fileUpload");
var fileUpload = new FileUpload();

// user Controller 연동
var Controller = require(rootPath + '/controllers/company/ctl_company');
var controller = new Controller();

/* GET */
router.get('/', function(req, res, next) {res.render("companyList", { session : req.session, req : req }); });
router.get('/waitingView', function(req, res, next) {res.render("waitingView", { session : req.session, req : req }); });
router.get('/nameList', function(req, res, next) {controller.get.getNameList(req, res, next); });
router.get('/exportExcel', function (req, res, next) {  controller.get.getExcel(req, res, next); });
router.get('/company', function (req, res, next) {  controller.get.getCompany(req, res, next); });
router.get('/waitingViewData', function (req, res, next) {  controller.get.getWaitingViewData(req, res, next); });

/* POST */
router.post('/', function(req, res, next) {controller.post.insertData(req, res, next); });
router.post('/list', function(req, res, next) {controller.get.getList(req, res, next); });
router.post('/edit', function(req, res, next) {
    switch (req.body.oper){
        case "add":
            controller.post.insertData(req, res, next);
            break;

        case "edit":
            controller.put.editData(req, res, next);
            break;

        case "del":
            controller.remove.deleteData(req, res, next);
            break;
        default :
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE = 405;
            res.json(HttpCode.getResponseBody(HTTP_CODE, {}));
            break;
    };
});

router.post('/waitingView/image', function (req, res, next) {
    fileUpload.upload(req, res, next, "/waitingView", "dropzoneFile").then(
        function(data){
            res.json({msg:"OK"});
            controller.post.uploadImage(data.req, data.res, data.next);
        },
        function(err){
            console.log("fileUpload error");    res.status(500).send(err);
        });
});

router.post('/waitingView/video', function (req, res, next) {
    fileUpload.upload(req, res, next, "/waitingView", "video").then(
        function(data){
            controller.post.uploadVideo(data.req, data.res, data.next);
        },
        function(err){
            console.log("fileUpload error");    res.status(500).send(err);
        });

});

/* PUT */
router.put('/profile', function (req, res, next) {
    fileUpload.upload(req, res, next, "/logo", "cImage").then(
        function (data) {
            controller.put.updateProfile(data.req, data.res, data.next);
        },
        function (err) {
            res.status(500).send(err);
        });
});
router.put('/waitingView/disable', function (req, res, next) {  controller.put.disableWaitingView(req, res, next); });
router.put('/waitingView/changeType', function (req, res, next) {  controller.put.changeWaitingViewType(req, res, next); });



/* DELETE */
router.delete('/waitingView/deleteFiles', function (req, res, next) {   controller.remove.deleteDropzoneList(req, res, next);  });

module.exports = router;
