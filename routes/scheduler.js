/**
 * Created by KaSha on 2017. 4. 6..
 */
var express = require('express');
var router = express.Router();

var rootPath = require('path').resolve('');
var Controller = require(rootPath + '/controllers/scheduler/ctl_scheduler');
var controller = new Controller();

/* GET */
router.get('/', function(req, res, next) {  res.render('scheduler', { session : req.session, req : req }); });
router.get('/ipgwanList', function(req, res, next) {controller.get.getIpgwanList(req, res, next); });
router.get('/schedulerList', function(req, res, next) {controller.get.getSchedulerList(req, res, next); });
router.get('/excelMonth', function(req, res, next) {controller.get.getExcel(req, res, next); });

/* POST */
router.post('/insertIpgwanScheduler', function(req, res, next) {controller.post.insertIpgwanScheduler(req, res, next); });


module.exports = router;