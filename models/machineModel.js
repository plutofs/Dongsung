/**
 * Created by KaSha on 2017. 4. 10..
 */
var crudModel = function(db){
    this.rootPath = require('path').resolve(''); // 루트 디렉토리 경로

    // Import util library
    this.util = require('util');
    this.mysql = require('mysql');

    this.db = db;
};

crudModel.prototype = {

    getList : function(schema, paginationSchema, cID, callback){
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var inserts = [];
        var companySQL = "";
        if(cID!=0){
            companySQL += (" AND M." + schema.column.cID + "=? ");
            inserts.push(cID);
        }

        var SQL = "SELECT `%s`, M.`%s`, `%s`, `%s`, `%s`, `%s`, CASE `%s` WHEN 0 THEN '빈소' WHEN 1 THEN '종합' WHEN 2 THEN '입관' ELSE '에러' END `%s`, " +
        " CASE `%s` WHEN 0 THEN '비활성화' WHEN 1 THEN '활성화' END `%s`, date_format(`%s`, '%Y/%%c/%e %H:%%i') as `%s`, CONCAT(C.`%s`, '/', C.`%s`) AS `%s` " +
        " FROM `%s` as M JOIN `%s` as C WHERE M.`%s`=C.`%s` " + companySQL + paginationSchema.searchQuery +
        " ORDER BY `%s` " + paginationSchema.sord + " LIMIT ?,?;";


        var beginRow = paginationSchema.rows * paginationSchema.page - paginationSchema.rows;

        inserts.push(beginRow);
        inserts.push(paginationSchema.rows * 1);

        SQL += ("SELECT ? AS records, ? AS page, CEIL(count(*)/?) AS total FROM `%s` M WHERE 1=1 " + companySQL);

        inserts.push(paginationSchema.rows);
        inserts.push(paginationSchema.page);
        inserts.push(paginationSchema.rows);
        if(cID!=0){
            inserts.push(cID);
        }

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.PK,
            schema.column.cID,
            schema.column.mac,
            schema.column.mName,
            schema.column.IP,
            schema.column.RIP,
            schema.column.mType,
            schema.column.mType,
            schema.column.mEnable,
            schema.column.mEnable,
            schema.column.mRegidate,
            schema.column.mRegidate,
            companySchema.column.cName,
            companySchema.column.master,
            "company",
            schema.TABLE_NAME,
            companySchema.TABLE_NAME,
            schema.column.cID,
            companySchema.column.cID,
            paginationSchema.sidx,

            schema.TABLE_NAME
        )

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertData : function(schema, callback){
        var uuid = require('node-uuid');
        var generateKey = uuid.v1();
        var inserts = [generateKey, schema.cID, schema.mName, schema.mac, schema.mType || 0, schema.mEnable || 1];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`) VALUES ( ?, ?, ?, ?, ?, ? )";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK,
            schema.column.cID,
            schema.column.mName,
            schema.column.mac,
            schema.column.mType,
            schema.column.mEnable
        );

        this.db.execute(SQL, function(err, rows){
            rows.generateKey = generateKey;
            callback(err, rows);
        });
    },

    editData : function(schema, callback){
        var RoomTotalListSchema = require(this.rootPath + '/schema/roomTotalListSchema');
        var roomTotalListSchema = new RoomTotalListSchema();
        var IpgwanSchedulerSchema = require(this.rootPath + '/schema/ipgwanSchedulerSchema');
        var ipgwanSchedulerSchema = new IpgwanSchedulerSchema();

        var inserts = [schema.mName, schema.mac, schema.mType, schema.mEnable, schema.mID];
        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=?, `%s`=?, `%s`=? WHERE `%s` = ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.mName,
            schema.column.mac,
            schema.column.mType,
            schema.column.mEnable,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });

        /** 라즈베리 타입 바꾸면 roomTotalList랑 ipgwanScheduler 데이터 연결된거 삭제하는 기능.
        var deleteSQL = "";
        var deleteInserts = [];
        switch (schema.mType){
            case 0: //roomToalList 삭제, scheduler 삭제
                deleteSQL += "DELETE FROM `%s` WHERE `%s`=?;";
                deleteSQL += "DELETE FROM `%s` WHERE `%s`=?;";
                deleteInserts.push(schema.mID);
                deleteInserts.push(schema.mID);
                deleteSQL = this.util.format( deleteSQL,
                    roomTotalListSchema.TABLE_NAME,
                    roomTotalListSchema.column.rtID,
                    ipgwanSchedulerSchema.TABLE_NAME,
                    ipgwanSchedulerSchema.column.mID
                );
                break;

            case 1: //scheduler 삭제
                deleteSQL += "DELETE FROM `%s` WHERE `%s`=?;";
                deleteInserts.push(schema.mID);
                deleteSQL = this.util.format( deleteSQL,
                    ipgwanSchedulerSchema.TABLE_NAME,
                    ipgwanSchedulerSchema.column.mID
                );
                break;

            case 2: //roomTotalList 삭제
                deleteSQL += "DELETE FROM `%s` WHERE `%s`=?;";
                deleteInserts.push(schema.mID);
                deleteSQL = this.util.format( deleteSQL,
                    roomTotalListSchema.TABLE_NAME,
                    roomTotalListSchema.column.rtID
                );
                break;
        }
        deleteSQL = this.mysql.format(SQL, inserts);

        this.db.only_execute(deleteSQL);
         */

        /**
         * 라즈베리 타입 바뀌어도 머신은 기존상태로 그대로 있음.
         * 그러나 값(분향실, 종합, 입관)을 입력하면 화면 바뀜.
         */
    },

    deleteData : function(schema, mIDArray, callback){
        var inserts = [];
        var SQL = "DELETE FROM `%s` WHERE `%s` IN (";

        mIDArray.forEach(function (element, index) {
            SQL += "?";
            if(index < mIDArray.length-1){
                SQL += ", ";
            }
            inserts.push(element);
        });
        SQL += ")";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },


};


module.exports = crudModel;