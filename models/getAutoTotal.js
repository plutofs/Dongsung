/**
 * Created by KaSha on 2017. 7. 18..
 */
var exports = function(){
    this.rootPath = require('path').resolve(''); // 루트 디렉토리 경로
    var connector = require(this.rootPath + '/utils/database/connector');
    this.db = new connector();

    this.util = require('util');
    this.mysql = require('mysql');

    var ViewRoomSchema = require(this.rootPath + '/schema/viewRoomSchema');
    this.viewRoomSchema = new ViewRoomSchema();
    var TemplateSchema = require(this.rootPath + '/schema/templateSchema');
    this.templateSchema = new TemplateSchema();
};


exports.prototype = {
    getAutoList : function (cID, callback) {
        var inserts = [cID, 1, 1, cID, 0];
        var SQL = "SELECT * FROM (`%s` RT JOIN `%s` M ON RT.`%s`=M.`%s`) LEFT JOIN `%s` T ON RT.`%s`=T.`%s` " +
            " WHERE M.`%s`=? AND M.`%s`=? AND RT.`%s`=? ORDER BY RT.`%s`, M.`%s`;" +
            "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=? AND !LENGTH(`%s`) > 0 AND !LENGTH(`%s`) > 0 AND LENGTH(`%s`) > 0 ORDER BY `%s`, `%s`, `%s`;";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            this.viewRoomSchema.roomTotalSchema.TABLE_NAME,  //auto 1인것
            this.viewRoomSchema.machineSchema.TABLE_NAME,
            this.viewRoomSchema.roomTotalSchema.column.rtID,
            this.viewRoomSchema.machineSchema.column.mID,
            this.templateSchema.TABLE_NAME,
            this.viewRoomSchema.roomTotalSchema.column.rtTemplate,
            this.templateSchema.column.fileName,
            this.viewRoomSchema.machineSchema.column.cID,
            this.viewRoomSchema.machineSchema.column.mEnable,
            this.viewRoomSchema.roomTotalSchema.column.rtAuto,
            this.viewRoomSchema.roomTotalSchema.column.rtName,
            this.viewRoomSchema.machineSchema.column.mID,

            this.viewRoomSchema.VIEW_NAME,   //room데이터
            this.viewRoomSchema.machineSchema.column.cID,
            this.viewRoomSchema.machineSchema.column.mType,
            this.viewRoomSchema.roomSchema.column.rRelation,
            this.viewRoomSchema.roomSchema.column.rImageRelation,
            this.viewRoomSchema.guestSchema.column.gName,
            this.viewRoomSchema.roomSchema.column.rName,
            this.viewRoomSchema.guestSchema.column.gName,
            this.viewRoomSchema.machineSchema.column.mID
        );

        this.db.execute(SQL, function(err, rows){
            if (err == null) {
                var key = [], listData = {};
                rows[0].forEach(function (element, index) {
                    key.push(element.mID);
                    listData[element.mID] = {"roomTotal" : element, "list" : []};
                });
                if(key.length>0) {
                    var idx = 0, loopCnt = 0;
                    rows[1].forEach(function (element, index) {
                        loopCnt = 0;    //무한 루핑 도는거 방지
                        while(true){
                            if(listData[key[idx]].list.length < (listData[key[idx]].roomTotal.maxCnt == null ? 24 : listData[key[idx]].roomTotal.maxCnt)){
                                listData[key[idx]].list.push(element);  //insert
                                idx ++; idx %= key.length;
                                break;
                            }else if(loopCnt > key.length){
                                break;
                            }
                            idx++; idx %= key.length;  loopCnt++;
                        }
                    });
                }

                callback(err, key, listData);
            }else{
                callback(err, null, null);
            }
        });
    },

    //Deprecated
    //raspberryModel getViewData쪽 구현
    getAuto : function (mID, callback) {
        var inserts = [mID, 1, 1, mID];
        var SQL = "SELECT * FROM (`%s` RT JOIN `%s` M ON RT.`%s`=M.`%s`) JOIN `%s` T ON RT.`%s`=T.`%s` " +
            "WHERE M.`%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?) AND M.`%s`=? AND RT.`%s`=? ORDER BY RT.`%s`;" +
            "SELECT * FROM `%s` WHERE `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?) ORDER BY `%s`;";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            this.viewRoomSchema.roomTotalSchema.TABLE_NAME,  //auto 1인것
            this.viewRoomSchema.machineSchema.TABLE_NAME,
            this.viewRoomSchema.roomTotalSchema.column.rtID,
            this.viewRoomSchema.machineSchema.column.mID,
            this.templateSchema.TABLE_NAME,
            this.viewRoomSchema.roomTotalSchema.column.rtTemplate,
            this.templateSchema.column.fileName,
            this.viewRoomSchema.machineSchema.column.cID,

            this.viewRoomSchema.machineSchema.column.cID,
            this.viewRoomSchema.machineSchema.TABLE_NAME,
            this.viewRoomSchema.machineSchema.column.mID,

            this.viewRoomSchema.machineSchema.column.mEnable,
            this.viewRoomSchema.roomTotalSchema.column.rtAuto,
            this.viewRoomSchema.roomTotalSchema.column.rtName,

            this.viewRoomSchema.VIEW_NAME,   //room데이터
            this.viewRoomSchema.machineSchema.column.cID,
            this.viewRoomSchema.machineSchema.column.cID,
            this.viewRoomSchema.machineSchema.TABLE_NAME,
            this.viewRoomSchema.machineSchema.column.mID,
            this.viewRoomSchema.roomSchema.column.rName
        );

        this.db.execute(SQL, function(err, rows){
            if (err == null) {
                var key = [], listData = {};
                rows[0].forEach(function (element, index) {
                    key.push(element.mID);
                    listData[element.mID] = {"roomTotal" : element, "list" : []};
                });
                if(key.length>0) {
                    var idx = 0;
                    rows[1].forEach(function (element, index) {
                        while(true){
                            var cnt = 0;    //무한 루핑 도는거 방지
                            if(listData[key[idx]].roomTotal.maxCnt > listData[key[idx]].list.length){
                                listData[key[idx]].list.push(element);
                                idx ++; idx %= key.length;
                                break;
                            }else if(cnt>key.length){
                                break;
                            }
                            idx ++; idx %= key.length;  cnt ++;
                        }
                    });
                }

                callback(err, listData[mID]);
            }else{
                callback(err, null);
            }
        });
    }
};

module.exports = exports;