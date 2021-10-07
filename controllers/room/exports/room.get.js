/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');
    this.model = model;
};

exports_get.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/roomSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    setGuestData : function(param){
        var Schema = require(this.rootPath + '/schema/guestSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    setRoomTotalData : function(param){
        var Schema = require(this.rootPath + '/schema/roomTotalSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    setTemplateData : function (param) {
        var Schema = require(this.rootPath + '/schema/templateSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    getRoomList : function(req, res, next) {
        var schema = this.setData(req.query);
        var cID;

        if(req.session.uLevel=="관리자" && !(req.query.requestCID == undefined || req.query.requestCID == null)){
            cID = req.query.requestCID;
        }else{
            cID = req.session.cID;
        }

        this.model.getList(schema, cID, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;
                var roomList = rows[0], category = rows[1];
                var company = rows[2];
                var key = [];
                var keyID = [];
                var categoryList = {};

                var defaultData = roomList.filter(function (room) { return room.rcName == null });

                if(defaultData.length > 0) {
                    categoryList["기본 카테고리"] = defaultData;
                    key.push("기본 카테고리");
                    keyID.push("0");
                }

                category.forEach(function (element, index) {
                    categoryList[element.rcName] = roomList.filter(function (room) { return room.rcName == element.rcName });
                    key.push(element.rcName);
                    keyID.push(element.rcID);
                });

                var result = {"company": company, "key" : key, "keyID" : keyID, "categoryList" : categoryList};
                res.json(HttpCode.getResponseBody(HTTP_CODE, result));	console.log(JSON.stringify(result));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getRoomTotalList : function(req, res, next) {
        var schema = this.setData(req.query);
        var cID;

        if(req.session.uLevel=="관리자" && !(req.query.requestCID == undefined || req.query.requestCID == null)){
            cID = req.query.requestCID;
        }else{
            cID = req.session.cID;
        }

        this.model.getTotalList(schema, cID, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;
                var roomTotalList = {};
                var tmpID = [], rtID;
                //var rtID = rows.filter(function (value, inde , self) { return self.indexOf(value) === index });

                rows[0].forEach(function (element, index) {    tmpID.push(element.mID);  });   //리스트에 전체 mID를 가져와서
                rtID = tmpID.filter(function (value, index, self) {     return self.indexOf(value) === index;   }); //중복 제거
                rtID.forEach(function (element, index) {   roomTotalList[element] = [];   });   //중복 제거된후 해당 키로 배열 선언
                rows[0].forEach(function (element, index) {
                    //배열에 데이터가 한개라도 있으면서, gName이 없는게 새로 들어오려고 하면 막기.
                    //종합안내에 있다가 빈소 종료 하면 비어있는 빈소가 들어오는 현상 막기 위해서임.
                    if(!(roomTotalList[element.mID].length > 0 && element.gName.length <= 0)){
                        if (roomTotalList[element.mID].length === 1 && roomTotalList[element.mID][0].gName.length === 0 ){ //여기 새로 추가 했음
                            roomTotalList[element.mID].pop();
                        }
                        roomTotalList[element.mID].push(element);
                    }
                });

                Object.keys(roomTotalList).forEach(function (element, index) {  //정렬
                    roomTotalList[element].sort(function (a,b) {    return (a.rName > b.rName) ? 1 : ((b.rName > a.rName) ? -1 : 0);    });
                });

                var AutoTotalModel = require(require('path').resolve('') + '/models/getAutoTotal');
                var autoTotalModel = new AutoTotalModel();
                autoTotalModel.getAutoList(cID, function (err2, autoKey, autoList) {
                    var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                    var HTTP_CODE =  200;
                    res.json(HttpCode.getResponseBody(HTTP_CODE, {company: rows[1], key:rtID, list:roomTotalList, autoKey:autoKey, autoList:autoList}));	console.log(JSON.stringify(rows));
                });
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    getRoomTotalData : function(req, res, next) {
        var schema = this.setRoomTotalData(req.params);

        if(schema.rtID == null){
            res.render('error', {   data : "PK가 넘어오지 않았습니다."   });
            return ;
        }

        this.model.getRoomTotalData(schema, function(err, rows){
            if (err == null) {	res.render("roomTotalEdit", { session : req.session, rtID :req.params.rtID, data : rows});  }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getReligionList : function (req, res, next) {
        const HttpCode = require(this.rootPath + '/const/httpCode');
        const path = require("path"), fs = require('fs');
        const storagePath = path.join(req.app.locals.storagePath + "religion/") ;
        const religionArray = ["christian", "catholic", "guddhism", "etc"];
        var religionList = {"christian" : [], "catholic" : [], "guddhism" : [], "etc" : []};

        var promise = function () {
            return new Promise(function (resolve, reject) {
                var count = 0;
                religionArray.forEach(function (element, index) {
                    fs.readdir(storagePath + element , function (err, files) {
                        if(err) {   reject(err);        return ;    }

                        files.forEach(function (file) {
                            if(file.substring(0,1)!=".") {  //.으로 시작하지 않는것
                                switch (index) {
                                    case 0:
                                        religionList.christian.push("christian/" + file);
                                        break;
                                    case 1:
                                        religionList.catholic.push("catholic/" + file);
                                        break;
                                    case 2:
                                        religionList.guddhism.push("guddhism/" + file);
                                        break;
                                    case 3:
                                        religionList.etc.push("etc/" + file);
                                        break;
                                }
                            }
                        });

                        count ++;
                        if(count==religionArray.length){
                            resolve();
                        }
                    });
                });
            });
        };

        promise().then(function () {
            console.log(HttpCode.getResponseBody(200, religionList));
            res.json(HttpCode.getResponseBody(200, religionList));
        }).catch(function (err) {
            res.json(HttpCode.getResponseBody(500, err));
        });
    },

    getGuestData : function (req, res, next) {
        var schema = this.setGuestData(req.params);

        if(schema.rID == null){
            res.render('error', {   data : "PK가 넘어오지 않았습니다."   });
            return ;
        }

        this.model.getGuestData(schema, function(err, rows){
            if (err == null) {	res.render("roomEdit", { title: 'DongSung Admin', session : req.session, rID :req.params.rID, type : "edit", data : rows});  }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getTemplatesFromDicrecoty : function (req, res, next) {
        const HttpCode = require(this.rootPath + '/const/httpCode');
        const path = require("path"), fs = require('fs');
        const roomPath = path.join(req.app.locals.storagePath + "room/") ;
        var roomList = [];

        var promise = function () {
            return new Promise(function (resolve, reject) {
                fs.readdir(roomPath, function (err, files) {
                    if(err) {   reject(err);        return ;    }

                    files.forEach(function (file) {
                        if(file.slice(-5)==".html" || file.slice(-5)==".htm"){  roomList.push(file);    }
                    });

                    resolve();
                });
            });
        };

        promise().then(function () {
            console.log(roomList);
            res.json(HttpCode.getResponseBody(200, roomList));
        }).catch(function (err) {
            res.json(HttpCode.getResponseBody(500, err));
        });
    },

    getTemplatesFromDB : function (req, res, next) {
        var schema = this.setTemplateData(req.query);

        schema.tType = 0;

        this.model.getTemplates(schema, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    getTotalTemplatesFromDB : function (req, res, next) {
        var schema = this.setTemplateData(req.query);

        schema.tType = 1;

        this.model.getTemplates(schema, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    invitation :function (req, res, next) {
        var schema = this.setGuestData(req.query);

        if(schema.gID == null){
            res.render('error', {   data : "필요한 파라미터가 넘어오지 않았습니다."   });
            return ;
        }

        this.model.invitation(schema, function(err, rows){
            if (err == null) {
                res.render('invitation', { session : req.session, data : rows });  console.log(JSON.stringify(rows));
            } else {	res.render('error', {		data : err		});		}
        });
    },

    roomTable :function (req, res, next) {
        var cID = req.query.cID;

        if(cID == null){
            res.render('error', {   data : "필요한 파라미터가 넘어오지 않았습니다."   });
            return ;
        }

        this.model.roomTable(cID, function(err, rows){
            if (err == null) {
                res.render('roomTable', { session : req.session, data : rows });  console.log(JSON.stringify(rows));
            } else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_get;