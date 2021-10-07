/**
 * Created by KaSha on 2017. 4. 10..
 */
var express = require('express');
var router = express.Router();

//루트 디렉토리 경로
var rootPath = require('path').resolve('');

// Controller 연동
var Controller = require(rootPath + '/controllers/user/ctl_user');
var controller = new Controller();

var RoomController = require(rootPath + '/controllers/room/ctl_room');
var roomController = new RoomController();

/* GET */
router.get('/', function(req, res, next) {
    if(req.session.userID){
        res.render('index', { session : req.session, req : req });
    }else{
        res.render('login', { title: 'DongSung Admin' });
    }
});
router.get('/invitation', function (req, res, next) {   roomController.get.invitation(req, res, next);  });
router.get('/roomTable', function (req, res, next) {    roomController.get.roomTable(req, res, next);  });

/* POST */
router.post('/doLogin',  function(req, res, next) {controller.post.doLogin(req, res, next); });
router.post('/logout',  function(req, res, next) {controller.post.logout(req, res, next); });

/* PUT */

/* DELETE */


module.exports = router;
