/**
 * Created by KaSha on 2017. 4. 10..
 */
var express = require('express');
var router = express.Router();

//루트 디렉토리 경로
var rootPath = require('path').resolve('');

// Controller 연동
var Controller = require(rootPath + '/controllers/machine/ctl_machine');
var controller = new Controller();

/* GET */
router.get('/', function(req, res, next) {res.render("machineList", { session : req.session, req : req }); });
router.get('/raspRoomEdit', function(req, res, next) {  res.render('raspberryView/raspRoomEdit.html', { session : req.session, req : req });  });
router.get('/exportExcel/:cID', function (req, res, next) {  controller.get.getExcel(req, res, next); });


/* POST */
router.post('/', function(req, res, next) {controller.post.insertData(req, res, next); });
router.post('/list/:cID', function(req, res, next) {controller.get.getList(req, res, next); });
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
            res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));
            break;
    };
});
router.post('/reboot', function(req, res, next) {controller.post.rebootMachine(req, res, next); });

/* PUT */

/* DELETE */

module.exports = router;
