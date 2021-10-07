/**
 * Created by KaSha on 2017. 5. 11..
 */
var express = require('express');
var router = express.Router();

//루트 디렉토리 경로
var rootPath = require('path').resolve('');

// user Controller 연동
var Controller = require(rootPath + '/controllers/raspberry/ctl_raspberry');
var controller = new Controller();

router.get("/socketList", function (req, res, next) { controller.get.socketList(req, res, next) });
router.get("/socketListInspect", function (req, res, next) { controller.get.socketListInspect(req, res, next) });
router.post('/registMac', function(req, res, next) {controller.post.registMac(req, res, next); });

router.prototype = {    //TODO check
    connected : controller.put.updateNetworkInfo,
    checkLogo : controller.get.checkLogo
};

module.exports = router;
