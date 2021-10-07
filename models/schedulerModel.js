/**
 * Created by KaSha on 2017. 5. 4..
 */
var crudModel = function(db){
    this.rootPath = require('path').resolve(''); // 루트 디렉토리 경로

    // Import util library
    this.util = require('util');
    this.mysql = require('mysql');

    this.db = db;
};

crudModel.prototype = {
    getList : function(schema, cID, callback){
        var inserts = [0, cID];

        var SQL = "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=? AND LENGTH(`%s`)>0;";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.VIEW_NAME,
            schema.machineSchema.column.mType,
            schema.machineSchema.column.cID,
            schema.guestSchema.column.gName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getIpgwanList : function (schema, cID, callback) {
        var IpgwanSchedulerSchema = require(this.rootPath + '/schema/ipgwanSchedulerSchema');
        var ipgwanSchedulerSchema = new IpgwanSchedulerSchema();

        var inserts = [cID, 2, cID, 0, cID, 2];
        var SQL = "SELECT M.`%s`, I.* FROM `%s` M JOIN `%s` I ON M.`%s`=I.`%s` WHERE I.`%s` IN " +
        "(SELECT `%s` FROM `%s` WHERE `%s`=? AND `%s`=?); ";

        SQL += "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=?; ";

        SQL += "SELECT * FROM `%s` WHERE `%s`=? AND `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.machineSchema.column.mName,
            schema.machineSchema.TABLE_NAME,
            ipgwanSchedulerSchema.TABLE_NAME,
            schema.machineSchema.column.mID,
            ipgwanSchedulerSchema.column.mID,
            ipgwanSchedulerSchema.column.mID,
            schema.machineSchema.column.mID,
            schema.machineSchema.TABLE_NAME,
            schema.machineSchema.column.cID,
            schema.machineSchema.column.mType,

            schema.VIEW_NAME,
            schema.machineSchema.column.cID,
            schema.machineSchema.column.mType,

            schema.machineSchema.TABLE_NAME,
            schema.machineSchema.column.cID,
            schema.machineSchema.column.mType
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    //해당 mID 전부 삭제한뒤에 추가하는 방식.
    insertIpgwanScheduler : function (schema, targetArray, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();

        var inserts = [schema.mID, schema.mID];
        var SQL = "SELECT * FROM `%s` WHERE `%s`=?; DELETE FROM `%s` WHERE `%s`=?; ";

        SQL = this.util.format(SQL,
            machineSchema.TABLE_NAME,
            machineSchema.column.mID,
            schema.TABLE_NAME,
            schema.column.mID
        );

        if(targetArray!= undefined && targetArray.length >0) {
            SQL += "INSERT INTO `%s` (`%s`, `%s`) VALUES "
            targetArray.forEach(function (element, index) {
               SQL += "(?, ?)";
               if(index < targetArray.length-1){   SQL += ",";  }

               inserts.push(schema.mID);
               inserts.push(element);
            });

            SQL = this.util.format(SQL,
                schema.TABLE_NAME,
                schema.column.mID,
                schema.column.targetID
            );
        }

        SQL = this.mysql.format(SQL, inserts);

        this.db.execute(SQL, function (err, rows) {
            callback(err, rows);
        });
    },

    getExcelData : function (cID, startDate, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var GuestSchema = require(this.rootPath + '/schema/guestSchema');
        var guestSchema = new GuestSchema();

        var SQL = "SELECT `%s` as '이름', `%s` as '나이', `%s` as '종교직위', `%s` as '상주', DATE_FORMAT(`%s`, '%Y %c %e %r') as '입관', DATE_FORMAT(`%s`, '%Y %c %e %r') as '발인', " +
            " `%s` as '장지', CASE `%s` WHEN 0 THEN 'X' ELSE 'O' END as '진단', CASE `%s` WHEN 0 THEN 'X' ELSE 'O' END as '초도', CASE `%s` WHEN 0 THEN 'X' ELSE 'O' END as '정산', `%s` as '상조회', `%s` as '배차', DATE_FORMAT(`%s`, '%Y %c %e %r') as '입력일' " +
            " FROM `%s` WHERE `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?) " +
            " AND `%s` BETWEEN ? AND DATE_SUB(DATE_ADD(?, INTERVAL 1 MONTH), INTERVAL 1 SECOND) ORDER BY `%s`;";

        SQL = this.mysql.format(SQL, [cID, startDate, startDate]);
        SQL = this.util.format(SQL,
            guestSchema.column.gName,
            guestSchema.column.gAge,
            guestSchema.column.gReligionPosition,
            guestSchema.column.gSangJu,
            guestSchema.column.ipgwan,
            guestSchema.column.barin,
            guestSchema.column.jangji,
            guestSchema.column.diagnosis,
            guestSchema.column.first,
            guestSchema.column.calculate,
            guestSchema.column.funeralService,
            guestSchema.column.baecha,
            guestSchema.column.gRegidate,
            guestSchema.TABLE_NAME,
            guestSchema.column.rID,
            machineSchema.column.mID,
            machineSchema.TABLE_NAME,
            machineSchema.column.cID,
            guestSchema.column.barin,
            guestSchema.column.barin
        );

        this.db.execute(SQL, function (err, rows) {
            callback(err, rows);
        });
    }
};


module.exports = crudModel;