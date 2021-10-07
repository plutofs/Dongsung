/**
 * Created by KaSha on 2017. 5. 11..
 */
var crudModel = function(db){
    this.rootPath = require('path').resolve(''); // 루트 디렉토리 경로

    // Import util library
    this.util = require('util');
    this.mysql = require('mysql');

    this.db = db;
};

crudModel.prototype = {

    updateNetworkInfo : function(mac, RIP, IP, callback){
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();
        var inserts = [RIP, IP, "%" + mac + "%"];

        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=? WHERE `%s` LIKE ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.RIP,
            schema.column.IP,
            schema.column.mac
        );

        this.db.execute(SQL, function (err, rows) {
            if(err == null && rows.affectedRows != null && rows.affectedRows > 0){
                var connector = require(require('path').resolve('') + '/utils/database/connector');
                var db = new connector();
                var Schema = require(require('path').resolve('') + '/schema/machineSchema');
                var schema = new Schema();
                var inserts = ["%" + mac + "%"];

                var SQL = "SELECT * FROM `%s` WHERE `%s` LIKE ?";

                SQL = require('mysql').format(SQL, inserts);

                SQL = require('util').format( SQL,
                    schema.TABLE_NAME,
                    schema.column.mac
                );
                db.execute(SQL, function (err2, rows2) {
                    callback(err2,rows2);
                });
            }else{
                callback(err,null);
            }

        });
    },

    getViewData : function(mac, callback){
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();
        var RoomTotalSchema = require(this.rootPath + '/schema/roomTotalSchema');
        var roomTotalSchema = new RoomTotalSchema();
        var inserts = ["%" + mac + "%"];

        var SQL = "SELECT M.`%s`, M.`%s`, RT.`%s` FROM `%s` M LEFT JOIN `%s` RT ON M.`%s`=RT.`%s` WHERE M.`%s` LIKE ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.column.mType,
            schema.column.mID,
            roomTotalSchema.column.rtAuto,
            schema.TABLE_NAME,
            roomTotalSchema.TABLE_NAME,
            schema.column.mID,
            roomTotalSchema.column.rtID,
            schema.column.mac
        );

        this.db.execute(SQL, function(err, rows){
            var rootPath = require('path').resolve('');
            var connector = require(rootPath + '/utils/database/connector');
            var util = require('util');
            var mysql = require('mysql');
            var db = new connector();

            if(err == null){
                var ViewRoomSchema = require(rootPath + '/schema/viewRoomSchema');
                var viewRoomSchema = new ViewRoomSchema();
                var SQL2 = "";
                var type = rows[0] ? rows[0].mType : -1;
                var rtAuto = rows[0] ? rows[0].rtAuto : 0;

                switch(type){
                    case 0:
                        SQL2 = "SELECT * FROM `%s` WHERE `%s` LIKE ?";
                        SQL2 = mysql.format(SQL2, ["%" + mac + "%"]);

                        SQL2 = util.format( SQL2,
                            viewRoomSchema.VIEW_NAME,
                            viewRoomSchema.machineSchema.column.mac
                        );

                        db.execute(SQL2, function (err2, rows2) {
                            callback(err2,{mType:0, data: rows2});
                        });
                        break;

                    case 1:
                        switch (rtAuto){
                            case 1:  //자동 타입 알고리즘 연산
                                var TemplateSchema = require(rootPath + '/schema/templateSchema');
                                var templateSchema = new TemplateSchema();

                                SQL2 = "SELECT * FROM `%s` WHERE `%s` IN (SELECT `%s` FROM `%s` WHERE `%s` LIKE ?) " +
                                    " AND `%s`=? AND !LENGTH(`%s`) > 0 AND !LENGTH(`%s`) > 0 AND LENGTH(`%s`) > 0 ORDER BY `%s`, `%s`, `%s`; " +
                                    "SELECT RT.*, M.*, T.`%s` FROM (`%s` RT JOIN `%s` M ON RT.`%s`=M.`%s`) LEFT JOIN `%s` T ON RT.`%s`=T.`%s` " +
                                    " WHERE RT.`%s`=? AND M.`%s`=? AND M.`%s` IN (SELECT `%s` FROM `%s` WHERE `%s` LIKE ?) ORDER BY RT.`%s`, M.`%s`;";

                                SQL2 = mysql.format(SQL2, ["%" + mac + "%", 0, 1, 1, "%" + mac + "%"]);

                                SQL2 = util.format( SQL2,
                                    viewRoomSchema.VIEW_NAME,                   //해당 지점의 전체 viewRoom 데이터
                                    viewRoomSchema.machineSchema.column.cID,
                                    viewRoomSchema.machineSchema.column.cID,
                                    viewRoomSchema.machineSchema.TABLE_NAME,
                                    viewRoomSchema.machineSchema.column.mac,
                                    viewRoomSchema.machineSchema.column.mType,
                                    viewRoomSchema.roomSchema.column.rRelation,
                                    viewRoomSchema.roomSchema.column.rImageRelation,
                                    viewRoomSchema.guestSchema.column.gName,
                                    viewRoomSchema.roomSchema.column.rName,
                                    viewRoomSchema.guestSchema.column.gName,
                                    viewRoomSchema.machineSchema.column.mID,

                                    templateSchema.column.maxCnt,               //해당 지점의 Auto타입의 전체 roomTotal -> machine하고 roomTotal
                                    viewRoomSchema.roomTotalSchema.TABLE_NAME,
                                    viewRoomSchema.machineSchema.TABLE_NAME,
                                    viewRoomSchema.roomTotalSchema.column.rtID,
                                    viewRoomSchema.machineSchema.column.mID,
                                    templateSchema.TABLE_NAME,
                                    viewRoomSchema.roomTotalSchema.column.rtTemplate,
                                    templateSchema.column.fileName,
                                    viewRoomSchema.roomTotalSchema.column.rtAuto,
                                    viewRoomSchema.machineSchema.column.mEnable,
                                    viewRoomSchema.machineSchema.column.cID,
                                    viewRoomSchema.machineSchema.column.cID,
                                    viewRoomSchema.machineSchema.TABLE_NAME,
                                    viewRoomSchema.machineSchema.column.mac,
                                    viewRoomSchema.roomTotalSchema.column.rtName,
                                    viewRoomSchema.machineSchema.column.mID
                                );

                                db.execute(SQL2, function (err2, rows2) {
                                    var roomTotal = [];
                                    var idx = 0, loopCnt = 0;

                                    //해당 구조 [ [{roomTotal Object}, [viewRoom Array]], ......]
                                    rows2[1].forEach(function (element, index) {    roomTotal.push( [element, []] );    });

                                    rows2[0].forEach(function (element, index) {
                                        loopCnt = 0;
                                        while(true) {
                                            if (roomTotal[idx][1].length < (roomTotal[idx][0].maxCnt == null ? 24 : roomTotal[idx][0].maxCnt)) {  //배열에 들어있는 데이터가 템플릿 maxCnt보다 작으면
                                                roomTotal[idx][1].push(element);
                                                idx ++;
                                                idx %= roomTotal.length;
                                                break;
                                            } else if(loopCnt > roomTotal.length){  //한바퀴 돌았는데 더이상 데이터 넣을곳이 없음.
                                                break;
                                            }
                                            idx++;  idx %= roomTotal.length;
                                            loopCnt++;
                                        }
                                    });

                                    roomTotal.forEach(function (element, index) {   //원하는 roomTotal 찾아서 콜백
                                        if(element[0].rtID == rows[0].mID){
                                            delete element[0].maxCnt;   //자바 Gson 형식에 맞추기 위해서 제거
                                            callback(err2,{mType:1, data: [element[0]], listData: element[1]});
                                            return;
                                        }
                                    });
                                });
                                break;

                            default:
                                SQL2 = "SELECT * FROM `%s` rt JOIN `%s` m ON rt.`%s`=m.`%s` WHERE rt.`%s`=?; " +
                                    "SELECT vr.* FROM `%s` rtl JOIN `%s` vr ON rtl.`%s`=vr.`%s` WHERE rtl.`%s`=? AND LENGTH(vr.`%s`) > 0 ORDER BY vr.`%s`, vr.`%s`; ";

                                SQL2 = mysql.format(SQL2, [rows[0].mID, rows[0].mID]);

                                SQL2 = util.format( SQL2,
                                    viewRoomSchema.roomTotalSchema.TABLE_NAME,  //machine이랑 roomTotal 조인 데이터
                                    viewRoomSchema.machineSchema.TABLE_NAME,
                                    viewRoomSchema.roomTotalSchema.column.rtID,
                                    viewRoomSchema.machineSchema.column.mID,
                                    viewRoomSchema.roomTotalSchema.column.rtID,

                                    viewRoomSchema.roomTotalListSchema.TABLE_NAME,  //viewRoom 데이터
                                    viewRoomSchema.VIEW_NAME,
                                    viewRoomSchema.roomTotalListSchema.column.rID,
                                    viewRoomSchema.machineSchema.column.mID,
                                    viewRoomSchema.roomTotalListSchema.column.rtID,
                                    viewRoomSchema.guestSchema.column.gName,
                                    viewRoomSchema.roomSchema.column.rName,
                                    viewRoomSchema.guestSchema.column.gName
                                );

                                db.execute(SQL2, function (err2, rows2) {
                                    callback(err2,{mType:1, data: rows2[0], listData: rows2[1]});
                                });
                                break;
                        }
                        break;

                    case 2:
                        var IpgwanSchedulerSchema = require(rootPath + '/schema/ipgwanSchedulerSchema');
                        var ipgwanSchedulerSchema = new IpgwanSchedulerSchema();

                        SQL2 = "SELECT VR.* FROM `%s` I JOIN `%s` VR ON I.`%s`=VR.`%s` " +
                            "WHERE I.`%s`=? AND (NOW() BETWEEN VR.`%s` AND (VR.`%s` + INTERVAL 55 MINUTE) OR NOW()<=VR.`%s`) ORDER BY `%s`; " +
                            "SELECT * FROM `%s` WHERE `%s`=?; ";

                        SQL2 = mysql.format(SQL2, [rows[0].mID, rows[0].mID]);

                        SQL2 = util.format( SQL2,
                            ipgwanSchedulerSchema.TABLE_NAME,
                            viewRoomSchema.VIEW_NAME,
                            ipgwanSchedulerSchema.column.targetID,
                            viewRoomSchema.machineSchema.column.mID,
                            ipgwanSchedulerSchema.column.mID,
                            viewRoomSchema.guestSchema.column.ipgwan,
                            viewRoomSchema.guestSchema.column.ipgwan,
                            viewRoomSchema.guestSchema.column.ipgwan,
                            viewRoomSchema.guestSchema.column.ipgwan,

                            viewRoomSchema.machineSchema.TABLE_NAME,
                            viewRoomSchema.machineSchema.column.mID
                        );

                        db.execute(SQL2, function (err2, rows2) {
                            callback(err2,{mType:2, listData: rows2[0], machine: rows2[1] });
                        });
                        break;

                    default:
                        callback(err, rows);
                        break;
                }
            }else{
                callback(err, rows);
            }
        });
    },

    getUserAccount : function (mac, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var UserSchema = require(this.rootPath + '/schema/userSchema');
        var userSchema = new UserSchema();

        var inserts = [1, 1, "%" + mac + "%"];

        var SQL = "SELECT U.`%s` AS `%s`, U.`%s` AS `%s`, HEX(AES_ENCRYPT(U.`%s`, 'KaSha')) AS `%s`, U.`%s` AS `%s` " +
            "FROM `%s` M JOIN `%s` U ON M.`%s`=U.`%s` WHERE U.`%s`=? AND M.`%s`=? AND M.`%s` LIKE ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            userSchema.column.uID,
            userSchema.column.uID,
            userSchema.column.cID,
            userSchema.column.cID,
            userSchema.column.uPwd,
            userSchema.column.uPwd,
            userSchema.column.uName,
            userSchema.column.uName,
            machineSchema.TABLE_NAME,
            userSchema.TABLE_NAME,
            machineSchema.column.cID,
            userSchema.column.cID,
            userSchema.column.uEnable,
            machineSchema.column.mEnable,
            machineSchema.column.mac
        );

        this.db.execute(SQL, function (err, rows) {
            callback(err,rows);
        });
    },

    registMac : function (ID, pwd, mac, wirelessMac, mName, cID, callback) {
        var UserSchema = require(this.rootPath + '/schema/userSchema');
        var userSchema = new UserSchema();
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();


        var SQL = "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=PASSWORD(?) AND `%s`=?;" +
            "SELECT * FROM `%s` WHERE `%s` LIKE ? OR `%s` LIKE ?";
        var inserts = [ID, pwd, 0, mac, wirelessMac];

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            userSchema.TABLE_NAME,
            userSchema.column.uID,
            userSchema.column.uPwd,
            userSchema.column.uLevel,

            machineSchema.TABLE_NAME,
            machineSchema.column.mac,
            machineSchema.column.mac
        );

        const cdb = this.db;
        this.db.execute(SQL, function (err, rows) {
            console.log(rows);
            if(rows[0].length > 0){
                if(rows[1].length === 0){
                    var MachineSchema = require(require('path').resolve('') + '/schema/machineSchema');
                    var machineSchema = new MachineSchema();

                    var uuid = require('node-uuid');
                    var macAddr = mac!="NONE" && wirelessMac!="NONE" ?
                        mac + "/" + wirelessMac : (mac!="NONE" ? mac : (wirelessMac!="NONE" ? wirelessMac : ""));
                    var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`) VALUES ( ?, ?, ?, ?)";
                    var inserts = [uuid.v1(), cID, macAddr, mName];

                    var mysql = require('mysql');
                    SQL = mysql.format(SQL, inserts);

                    var util = require('util');
                    SQL = util.format( SQL,
                        machineSchema.TABLE_NAME,
                        machineSchema.column.mID,
                        machineSchema.column.cID,
                        machineSchema.column.mac,
                        machineSchema.column.mName
                    );

                    cdb.execute(SQL, function (err, rows) {
                        callback(err,rows, 0);
                    });
                }else{
                    callback(err,rows, 2);
                }
            }else{
                callback(err,rows, 1);
            }
        });
    },

    checkLogo : function (mac, logo, callback) {
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();

        var inserts = ["%" + mac + "%"];

        var SQL = "SELECT * FROM `%s` C JOIN `%s` M ON C.`%s`=M.`%s` WHERE M.`%s` LIKE ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            companySchema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            companySchema.column.cID,
            machineSchema.column.cID,
            machineSchema.column.mac
        );

        this.db.execute(SQL, function (err, rows) {
            callback(err,rows);
        });
    },

    checkWaitingView : function (mac, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var SQL = "SELECT * FROM `%s` C JOIN `%s` M ON C.`%s`=M.`%s` WHERE M.`%s` LIKE ?";

        var inserts = ["%" + mac + "%"];

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            companySchema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            companySchema.column.cID,
            machineSchema.column.cID,
            machineSchema.column.mac
        );

        this.db.execute(SQL, function(err, rows){
            var rootPath = require('path').resolve('');
            var connector = require(rootPath + '/utils/database/connector');
            var util = require('util');
            var mysql = require('mysql');
            var db = new connector();

            if(err == null) {
                var WaitingViewSchema = require(require('path').resolve('') + '/schema/waitingViewSchema');
                var waitingViewSchema = new WaitingViewSchema();

                if(rows.length<1){  return ;    }
                rows = rows[0];   //열이 여러개 나오면 안되지만, 혹시 맥 like 했을때 여러개 나올까봐.

                var cID = rows.cID, waitingViewEnable = rows.waitingViewEnable;
                var SQL = "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=?";

                switch (waitingViewEnable){
                    case 0:
                        callback(null, null, waitingViewEnable);
                        break;
                    case 1:
                    case 2:
                        SQL = mysql.format(SQL, [cID, waitingViewEnable]);

                        SQL = util.format(SQL,
                            waitingViewSchema.TABLE_NAME,
                            waitingViewSchema.column.cID,
                            waitingViewSchema.column.fileType
                        );

                        db.execute(SQL, function (err2, rows2) {
                            callback(err2, rows2, waitingViewEnable);
                        });
                        break;
                }
            }else{
                console.log(err);
            }
        });
    }
};


module.exports = crudModel;