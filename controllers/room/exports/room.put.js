/**
 * Created by KaSha on 2017. 4. 10..
 */
var rootPath = require('path').resolve('');
var CryptUtil = require(rootPath + "/utils/cryptUtil");
const cryptUtil = new CryptUtil();
var axios = require('axios')
var exports_put = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_put.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/roomSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setRoomTotalData : function(req){
        var Schema = require(this.rootPath + '/schema/roomTotalSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setCategoryData : function(req){
        var Schema = require(this.rootPath + '/schema/roomCategorySchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setGuestData : function(req){
        var Schema = require(this.rootPath + '/schema/guestSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setSangjuData : function(req){
        var Schema = require(this.rootPath + '/schema/sangjuSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    change_rName : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.rID == null || schema.rName == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.change_rName(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else if(err.code=="ER_DUP_ENTRY"){ HTTP_CODE = 406; res.json(HttpCode.getResponseBody(HTTP_CODE, err.code));}
            else {	res.render('error', {		data : err		});		}
        });
    },

    change_rcName : function(req, res, next) {
        var schema = this.setCategoryData(req);

        if(schema.rcID == null || schema.rcName == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.change_rcName(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else if(err.code=="ER_DUP_ENTRY"){ HTTP_CODE = 406; res.json(HttpCode.getResponseBody(HTTP_CODE, err.code));}
            else {	res.render('error', {		data : err		});		}
        });
    },

    change_rtName : function(req, res, next) {
        var schema = this.setRoomTotalData(req);

        if(schema.rtID == null || schema.rtName == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.change_rtName(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else if(err.code=="ER_DUP_ENTRY"){ HTTP_CODE = 406; res.json(HttpCode.getResponseBody(HTTP_CODE, err.code));}
            else {	res.render('error', {		data : err		});		}
        });
    },

    changeRoomCategory : function (req, res, next) {
        var schema = this.setData(req);

        if(schema.rID == null || schema.rcID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.changeRoomCategory(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    },

    updateGuest : function(req, res, next) {
        var schema = this.setGuestData(req);
        var schema2 = this.setSangjuData(req);

        if(schema.gID == null || schema.gName == null ){
            console.log(schema.rID + " " + req.body.ipgwanDate);
            res.render('error', {		data : "최소한의 필요한 정보가 전달되지 않았습니다."  });
            return ;
        }

        /**
         * datetime or timestamp 데이터 입력 포맷 방식 (1번을 사용하기로 하자)
         * 1. yyyy-mm-dd hh:mm:ss     2. yyyymmddhhmmss
         */

        var ipgwan = "", barin = "";
        if(req.body.ipgwanDate != undefined && req.body.ipgwanTime != undefined && req.body.ipgwanDate != null && req.body.ipgwanTime != null) {
            ipgwan = req.body.ipgwanDate + " " + req.body.ipgwanTime + ":00";
        }
        if(req.body.barinDate != undefined && req.body.barinTime != undefined && req.body.barinDate != null && req.body.barinTime != null) {
            barin = req.body.barinDate + " " + req.body.barinTime + ":00";
        }
        schema.diagnosis = req.body.diagnosis != undefined ? 1 : 0;
        schema.first = req.body.first != undefined ? 1 : 0;
        schema.calculate = req.body.calculate != undefined ? 1 : 0;

        schema.ipgwan = ipgwan;
        schema.barin = barin;

        if (req.file !== undefined) {
            if (req.file.fieldname === "gMusic") {
                schema.gMusic = req.file.filename;
            } else if (req.file.fieldname === "gImage") {
                schema.gImage = req.file.filename;
            }
        }
        if (req.files !== undefined) {
            req.files.forEach(function (element, index){
                if (element.fieldname === "gMusic") {
                    schema.gMusic = element.filename;
                } else if (element.fieldname === "gImage") {
                    schema.gImage = element.filename;
                }
            });
        }

        this.model.updateGuest(schema, schema2, req.body.gImageRemove, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {
                res.json(HttpCode.getResponseBody(HTTP_CODE, rows[3]));
                console.log(JSON.stringify(rows[0]));

                var fs = require('fs');
                var path = require('path');
                if (schema.gMusic !== null) {
                    fs.rename(path.join(req.app.locals.uploadPath + "/guest/" + schema.gMusic),
                        path.join(req.app.locals.uploadPath + "/music/" + schema.gID + ".mp3"), function (err) {
                            if(err) console.log(err);
                        });
                } else if (req.body.gMusicRemove === "1"){
                    fs.unlink(path.join(req.app.locals.uploadPath + "/music/" + schema.gID + ".mp3"), function(error) {
                        if (err) console.log(err);
                    });
                }

                var Controller = require(require('path').resolve('') + '/controllers/raspberry/ctl_raspberry');
                var controller = new Controller();

                var mac = rows[1][0] != undefined ? rows[1][0].mac : "";
                if(req.app.locals.clients[mac] != undefined) {      // 해당 장비가 소켓에 연결되어 있으면.
                    controller.get.getViewData(req.app.locals.clients[mac], mac);
                }

                rows[2].forEach(function (element, index) {     //같은 지점의 1,2 mType의 장비이거나, 해당 장비의 복제타입인 장비 조회해서 소켓 전송
                    if(req.app.locals.clients[element.mac] != undefined) {      // 해당 장비가 소켓에 연결되어 있으면.
                        controller.get.getViewData(req.app.locals.clients[element.mac], element.mac);
                    }
                });

                //api부분

                var apiData = rows.apiData[0];
                var jsonText = JSON.stringify(apiData);
                var key='!@FLOWER_CITYLIFE_AES128_IFKEY#$';
                var result = cryptUtil.encrypt(jsonText,key);

                var urlEncodingData=encodeURIComponent(result);
                /*
                var resultApi=axios({
                    url: 'http://bugo.or.kr/bugo/API/encrypt.php?data='+urlEncodingData,
                    method: 'post'
                  });
                  */
                 var url = req.app.locals.apiPath+urlEncodingData;
                  axios.post(url,{}).then(function(response){
                      console.log(response);
                  })
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    updateReplicationRoom : function (req, res, next) {
        var schema = this.setData(req);

        var roomVal = req.body.roomVal;
        var copyVal = req.body.copyVal;

        if(schema.rID == null || roomVal == null || copyVal == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.updateReplicationRoom(schema, roomVal, copyVal, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {
                res.json(HttpCode.getResponseBody(HTTP_CODE, rows[3]));
                console.log(JSON.stringify(rows[0]));

                var mac = copyVal === "2" ? rows[2][0].mac : rows[1][0].mac;
                if(req.app.locals.clients[mac] != undefined) {      // 해당 장비가 소켓에 연결되어 있으면.
                    //socket 통해서 raspberry 전달
                    var Controller = require(require('path').resolve('') + '/controllers/raspberry/ctl_raspberry');
                    var controller = new Controller();

                    controller.get.getViewData(req.app.locals.clients[mac], mac);
                }
            }
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_put;