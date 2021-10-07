/**
 * Created by KaSha on 2017. 4. 10..
 */
var express = require('express');
var router = express.Router();

//루트 디렉토리 경로
var rootPath = require('path').resolve('');
var FileUpload = require(rootPath + "/utils/fileUpload");
var fileUpload = new FileUpload();

var Controller = require(rootPath + '/controllers/room/ctl_room');
var controller = new Controller();

/* GET */
router.get('/', function(req, res, next) {res.render("roomList", { session : req.session, req : req }); });
router.get('/total', function(req, res, next) {res.render("roomTotalList", { session : req.session, req : req }); });
router.get('/roomNew/:rID/:rName', function(req, res, next) {res.render("roomEdit", { session : req.session, req : req, rID :req.params.rID, rName :req.params.rName, type : "new"}); });
router.get('/roomTableView', function(req, res, next) {res.render("roomTableView", { session : req.session, req : req }); });
router.get('/roomEdit/:rID/:rName', function(req, res, next) {controller.get.getGuestData(req, res, next); });
router.get('/roomList', function(req, res, next) {controller.get.getRoomList(req, res, next); });      //해당 지점에 대한 카테고리와 분향실 리스트 반환
router.get('/roomTotalList', function(req, res, next) {controller.get.getRoomTotalList(req, res, next); });      //해당 지점에 대한 카테고리와 분향실 리스트 반환
router.get('/totalEdit/:rtID', function(req, res, next) {controller.get.getRoomTotalData(req, res, next); });
router.get('/religion', function(req, res, next) {controller.get.getReligionList(req, res, next); });
router.get('/templates', function(req, res, next) {controller.get.getTemplatesFromDB(req, res, next); });
router.get('/total/templates', function(req, res, next) {controller.get.getTotalTemplatesFromDB(req, res, next); });


/* POST */
router.post('/', function(req, res, next) {controller.post.insertData(req, res, next); });
router.post('/addCategory', function(req, res, next) {controller.post.addCategory(req, res, next); });
router.post('/roomEdit', function(req, res, next) {
    fileUpload.upload(req, res, next, "/guest", "gImage").then(
        function(data){
            controller.post.insertGuest(data.req, data.res, data.next);
        },
        function(err){
            console.log("fileUpload error");    res.status(500).send(err);
        }); 


});
router.post('/roomTotalEdit', function(req, res, next) {controller.post.insertRoomTotalList(req, res, next); });
router.post('/emptyGuest', function(req, res, next) {controller.post.insertEmptyGuest(req, res, next); });


/* PUT */
router.put('/change-rName', function(req, res, next) {controller.put.change_rName(req, res, next); });
router.put('/change-rcName', function(req, res, next) {controller.put.change_rcName(req, res, next); });
router.put('/change-rtName', function(req, res, next) {controller.put.change_rtName(req, res, next); });
router.put('/changeRoomCategory', function(req, res, next) {controller.put.changeRoomCategory(req, res, next); });
router.put('/roomEdit', function(req, res, next) { //put이지만 form 방식이라서 post
    fileUpload.upload(req, res, next, "/guest", "gImage").then(
        function (data) {
            controller.put.updateGuest(data.req, data.res, data.next);
        },
        function (err) {
            console.log("fileUpload error");    res.status(500).send(err);
        });
});
router.put('/replicationRoom', function(req, res, next) {controller.put.updateReplicationRoom(req, res, next); });

/* DELETE */
router.delete('/deleteCategory', function(req, res, next) {controller.remove.deleteCategory(req, res, next); });

module.exports = router;
