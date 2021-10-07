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
        var SQL = "SELECT `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, date_format(`%s`, '%Y/%%c/%e %H:%%i') as `%s` FROM `%s` " +
            " WHERE 1=1 " + paginationSchema.searchQuery + "ORDER BY `%s` " + paginationSchema.sord + " LIMIT ?,?;";

        var beginRow = paginationSchema.rows * paginationSchema.page - paginationSchema.rows;

        var inserts = [beginRow, paginationSchema.rows * 1];

        SQL += "SELECT ? AS records, ? AS page, CEIL(count(*)/?) AS total FROM `%s`";

        inserts.push(paginationSchema.rows);
        inserts.push(paginationSchema.page);
        inserts.push(paginationSchema.rows);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.PK,
            schema.column.cName,
            schema.column.businessNum,
            schema.column.master,
            schema.column.cAddress,
            schema.column.cTel,
            schema.column.cFax,
            schema.column.cMemo,
            schema.column.cEnable,
            schema.column.cRegidate,
            schema.column.cRegidate,
            schema.TABLE_NAME,
            paginationSchema.sidx,

            schema.TABLE_NAME
        )

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertData : function(schema, callback){
        var uuid = require('node-uuid');
        var inserts = new Array();
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`) SELECT ?, ? ";

        var generateKey = uuid.v1();
        inserts.push(generateKey, schema.cName);

        if(schema.businessNum != null){ SQL += (", ?"); inserts.push(schema.businessNum);   }else{  SQL += ", DEFAULT ";    }
        if(schema.master != null){  SQL += (", ?"); inserts.push(schema.master);    }else{  SQL += ", DEFAULT ";    }
        if(schema.cAddress != null){    SQL += (", ?"); inserts.push(schema.cAddress);  }else{  SQL += ", DEFAULT ";    }
        if(schema.cTel != null){    SQL += (", ?"); inserts.push(schema.cTel);  }else{  SQL += ", DEFAULT ";    }
        if(schema.cFax != null){    SQL += (", ?"); inserts.push(schema.cFax);  }else{  SQL += ", DEFAULT ";    }
        if(schema.cMemo != null){   SQL += (", ?"); inserts.push(schema.cMemo); }else{  SQL += ", DEFAULT ";    }
        SQL += ",IFNULL(MAX(cIdx)+1, 1)"
        SQL += " FROM company;";
        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK,
            schema.column.cName,
            schema.column.businessNum,
            schema.column.master,
            schema.column.cAddress,
            schema.column.cTel,
            schema.column.cFax,
            schema.column.cMemo,
            schema.column.cIdx
        );

        this.db.execute(SQL, function(err, rows){
            rows["generateKey"] = generateKey;
            callback(err, rows);
        });
    },

    getNameList : function (schema, callback) {
        var SQL = "SELECT `%s`, CONCAT(`%s`, '/', `%s`) AS companyName FROM `%s` ORDER BY `%s`";
        var HTTP_CODE = 200;

        SQL = this.util.format( SQL,
            schema.PK,
            schema.column.cName,
            schema.column.master,
            schema.TABLE_NAME,
            schema.column.cName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    editData : function(schema, callback){
        var inserts = [schema.cName, schema.master, schema.cTel, schema.businessNum, schema.cAddress, schema.cFax, schema.cMemo, schema.cID ];
        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=? WHERE `%s` = ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.cName,
            schema.column.master,
            schema.column.cTel,
            schema.column.businessNum,
            schema.column.cAddress,
            schema.column.cFax,
            schema.column.cMemo,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    deleteData : function(schema, callback){
        var inserts = [schema.cID];
        var SQL = "DELETE FROM `%s` WHERE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    updateProfile : function (schema, userID, currentPwd, newPwd, callback) {
        var UserSchema = require(this.rootPath + '/schema/userSchema');
        var userSchema = new UserSchema();

        var inserts = [schema.master];
        var SQL = "UPDATE `%s` SET `%s`=? ";
        var addSQL = "", pwdSQL = "";

        if (schema.businessNum != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.businessNum);
            inserts.push(schema.businessNum);
        }

        if (schema.cAddress != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.cAddress);
            inserts.push(schema.cAddress);
        }

        if (schema.cTel != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.cTel);
            inserts.push(schema.cTel);
        }

        if (schema.cFax != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.cFax);
            inserts.push(schema.cFax);
        }

        if (schema.cImage != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.cImage);
            inserts.push(schema.cImage);
        }

        SQL += addSQL;
        SQL += " WHERE `%s`=?;";
        inserts.push(schema.cID);

        if (userID.length > 0 && currentPwd.length > 0 && newPwd.length > 0) {
            pwdSQL = "UPDATE `%s` SET `%s`=PASSWORD(?) WHERE `%s`=? AND `%s`=PASSWORD(?);";
            pwdSQL = this.util.format( pwdSQL,
                userSchema.TABLE_NAME,
                userSchema.column.uPwd,
                userSchema.column.uID,
                userSchema.column.uPwd
            );
            inserts.push(newPwd, userID, currentPwd);
            SQL += pwdSQL;
        }

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.master,
            schema.column.cID
        )

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getCompany : function (schema, mID, callback) {
        var SQL = "";
        if(mID=="") {
            var inserts = [schema.cID];
            SQL = "SELECT * FROM `%s` WHERE `%s`=?";

            SQL = this.mysql.format(SQL, inserts);

            SQL = this.util.format(SQL,
                schema.TABLE_NAME,
                schema.PK
            );
        }else{
            var MachineSchema = require(this.rootPath + '/schema/machineSchema');
            var machineSchema = new MachineSchema();

            var inserts = [mID];
            SQL = "SELECT * FROM `%s` C JOIN `%s` M ON C.`%s`=M.`%s` WHERE M.`%s`=?";

            SQL = this.mysql.format(SQL, inserts);

            SQL = this.util.format(SQL,
                schema.TABLE_NAME,
                machineSchema.TABLE_NAME,
                schema.column.cID,
                machineSchema.column.cID,
                machineSchema.column.mID
            );
        }

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getWaitingViewData : function (schema, callback) {
        var SQL = "SELECT C.`%s`, W.* FROM `%s` C JOIN `%s` W ON C.`%s`=W.`%s` WHERE C.`%s`=?";
        var inserts = [schema.cID];
        var WaitingViewSchema = require(this.rootPath + '/schema/waitingViewSchema');
        var waitingViewSchema = new WaitingViewSchema();

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            schema.column.waitingViewEnable,
            schema.TABLE_NAME,
            waitingViewSchema.TABLE_NAME,
            schema.column.cID,
            waitingViewSchema.column.cID,
            schema.column.cID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    disableWaitingView : function (schema, callback) {
        var SQL = "UPDATE `%s` SET `%s`=? WHERE `%s` = ?";
        var inserts = [0, schema.cID];

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            schema.TABLE_NAME,
            schema.column.waitingViewEnable,
            schema.column.cID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    changeWaitingViewType : function (schema, callback) {
        var SQL = "UPDATE `%s` SET `%s`=? WHERE `%s` = ?";
        var inserts = [schema.waitingViewEnable, schema.cID];

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            schema.TABLE_NAME,
            schema.column.waitingViewEnable,
            schema.column.cID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertWaitingViewImage : function (cID, files, callback) {
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();
        var WaitingViewSchema = require(this.rootPath + '/schema/waitingViewSchema');
        var waitingViewSchema = new WaitingViewSchema();

        var SQL = "UPDATE `%s` SET `%s`=? WHERE `%s`=?; " +
            "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`) VALUES ";
        var inserts = [1, cID];

        files.forEach(function (element, index) {
            SQL += " (?, ?, ?, ?) ";
            if(index<files.length-1){   SQL += ", ";    }
            inserts.push(cID, element.filename, element.size, 1);
        });

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            companySchema.TABLE_NAME,
            companySchema.column.waitingViewEnable,
            companySchema.column.cID,

            waitingViewSchema.TABLE_NAME,
            waitingViewSchema.column.cID,
            waitingViewSchema.column.fileName,
            waitingViewSchema.column.fileSize,
            waitingViewSchema.column.fileType
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    deleteDropzoneList : function (deleteArray, callback) {
        var WaitingViewSchema = require(this.rootPath + '/schema/waitingViewSchema');
        var waitingViewSchema = new WaitingViewSchema();

        var SQL = "DELETE FROM `%s` WHERE `%s` IN ( ";
        var inserts = [];

        deleteArray.forEach(function (element, index) {
            SQL += " ?";
            if(index < deleteArray.length-1){   SQL += ", ";    }
            inserts.push(element);
        });
        SQL += " )";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            waitingViewSchema.TABLE_NAME,
            waitingViewSchema.column.fileName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertWaitingViewVideo : function (cID, file, callback) {
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();
        var WaitingViewSchema = require(this.rootPath + '/schema/waitingViewSchema');
        var waitingViewSchema = new WaitingViewSchema();

        console.log(file);

        var SQL = "UPDATE `%s` SET `%s`=? WHERE `%s`=?; " +
            "DELETE FROM `%s` where `%s`=? AND `%s`=?; " +
            "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`) VALUES (?, ?, ?, ?);";
        var inserts = [2, cID, cID, 2, cID, file.filename, file.size, 2];

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            companySchema.TABLE_NAME,
            companySchema.column.waitingViewEnable,
            companySchema.column.cID,

            waitingViewSchema.TABLE_NAME,
            waitingViewSchema.column.cID,
            waitingViewSchema.column.fileType,

            waitingViewSchema.TABLE_NAME,
            waitingViewSchema.column.cID,
            waitingViewSchema.column.fileName,
            waitingViewSchema.column.fileSize,
            waitingViewSchema.column.fileType
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    }
};


module.exports = crudModel;