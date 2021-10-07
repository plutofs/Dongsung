/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');
    this.model = model;
};

exports_get.prototype = {
    getSchema : function(){
        var Schema = require(this.rootPath + '/schema/viewRoomSchema');
        var schema = new Schema();

        return schema;
    },

    getIpgwanSchedulerSchema : function (param) {
        var Schema = require(this.rootPath + '/schema/ipgwanSchedulerSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    getMachineSchema : function (param) {
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    getSchedulerList : function(req, res, next) {
        var schema = this.getSchema();
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

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getIpgwanList : function (req, res, next) {
        var schema = this.getSchema();
        var cID = req.query.cID;

        if(cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.getIpgwanList(schema, cID, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;
                var schedulerList = {};
                var tmpID = [], mID;
                var roomList = [], ipgwanList = [];

                //리스트에 전체 mID를 가져와서
                rows[0].forEach(function (element, index) {    tmpID.push(element.mID);  });
                //중복 제거
                mID = tmpID.filter(function (value, index, self) {     return self.indexOf(value) === index;   });
                //중복 제거된후 해당 키로 배열 선언
                mID.forEach(function (element, index) {   schedulerList[element] = [];   });

                rows[0].forEach(function (element, index) {
                    schedulerList[element.mID].push(element);
                });

                roomList = rows[1];
                ipgwanList = rows[2];

                //schedulerList : ipgwan type 라즈베리에 따른(키) 스케줄 배열
                //roomList : 회사내 mType이 0인거 전부 가져오기
                //ipgwanList :  회사내 mType이 2인거 전부 가져오기
                res.json(HttpCode.getResponseBody(HTTP_CODE, {key:mID, schedulerList: schedulerList, roomList : roomList, ipgwanList : ipgwanList}));
                console.log(JSON.stringify(schedulerList));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getExcel : function (req, res, next) {
        var cID = req.query.cID;
        var startDate = req.query.startDate;

        this.model.getExcelData(cID, startDate, function(err, rows){
            if (err == null) {
                var ExportExcel = require(require('path').resolve('') + "/utils/exportExcel");
                var exportExcel = new ExportExcel();

                if(rows.length<=0){
                    res.send();
                    return ;
                }

                var fileName = "월별 기록보고_" + startDate.replace(/[\-\:\.]/g, "");
                exportExcel.exportExcel(req, res, next, fileName, rows);
            }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));	}
        });
    }
};

module.exports = exports_get;