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

    getList : function(schema, paginationSchema, callback){
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var SQL = "SELECT `%s`, U.`%s`, `%s`, `%s`, date_format(`%s`, '%Y/%%c/%e %H:%%i') AS `%s`, CONCAT(`%s`, '/', `%s`) AS company, '****' AS uPwd " +
            " FROM `%s` AS U JOIN `%s` AS C WHERE U.`%s`=C.`%s` " + paginationSchema.searchQuery + " ORDER BY `%s` " +  paginationSchema.sord + " LIMIT ?,?;";

        var beginRow = paginationSchema.rows * paginationSchema.page - paginationSchema.rows;

        var inserts = [beginRow, paginationSchema.rows * 1];

        SQL += "SELECT ? AS records, ? AS page, CEIL(count(*)/?) AS total FROM `%s`";

        inserts.push(paginationSchema.rows);
        inserts.push(paginationSchema.page);
        inserts.push(paginationSchema.rows);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.PK,
            schema.column.cID,
            schema.column.uName,
            schema.column.uMemo,
            schema.column.uRegidate,
            schema.column.uRegidate,
            companySchema.column.cName,
            companySchema.column.master,
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

    doLogin : function(schema, callback){
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var inserts = [schema.uID, schema.uPwd];
        var SQL = "SELECT U.`%s`, U.`%s`, if(U.`%s`=0, '관리자', '사용자') AS `%s`, U.`%s`, U.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s`, C.`%s` " +
            " FROM `%s` U join `%s` C WHERE U.`%s`=C.`%s` AND U.`%s`=? AND U.`%s`=PASSWORD(?) AND C.`%s`=1 AND U.`%s`=1";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.column.uID,
            schema.column.uName,
            schema.column.uLevel,
            schema.column.uLevel,
            schema.column.uEnable,
            schema.column.uRegidate,
            companySchema.column.cID,
            companySchema.column.cName,
            companySchema.column.businessNum,
            companySchema.column.master,
            companySchema.column.cAddress,
            companySchema.column.cTel,
            companySchema.column.cFax,
            companySchema.column.cEnable,
            companySchema.column.cRegidate,
            schema.TABLE_NAME,
            companySchema.TABLE_NAME,
            schema.column.cID,
            companySchema.column.cID,
            schema.PK,
            schema.column.uPwd,
            companySchema.column.cEnable,
            schema.column.uEnable
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertData : function(schema, callback){
        var inserts = [schema.cID, schema.uID, schema.uPwd, schema.uName, schema.uMemo];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`) VALUES (?, ?, PASSWORD(?), ?, ?)";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.cID,
            schema.column.uID,
            schema.column.uPwd,
            schema.column.uName,
            schema.column.uMemo
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    editData : function(schema, callback){
        var inserts = [schema.uName, schema.uMemo];
        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=? ";

        if(schema.uPwd != null && schema.uPwd != "****"){
            var addSQL = this.util.format(", `%s`=PASSWORD(?) ", schema.column.uPwd);
            SQL += addSQL;
            inserts.push(schema.uPwd);
        }

        SQL += " WHERE `%s` = ?";
        inserts.push(schema.uID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.uName,
            schema.column.uMemo,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    deleteData : function(schema, callback){
        var inserts = [schema.uID];
        var SQL = "DELETE FROM `%s` WHERE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    }
};


module.exports = crudModel;