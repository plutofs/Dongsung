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
var Controller = require(rootPath + '/controllers/sangju/ctl_sangju');
var controller = new Controller();

router.get('/sangju', function (req, res, next) {  controller.get.getSangju(req, res, next); });

module.exports = router;
