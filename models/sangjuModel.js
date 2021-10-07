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

    getSangju : function (schema, rID, callback) {
        var SQL = "";
        var inserts = [rID];
        var GuestSchema = require(this.rootPath + '/schema/guestSchema');
        var guestSchema = new GuestSchema();
        /*
            SELECT T.*
            FROM T_SANGJU T
            LEFT JOIN guest g ON g.gID =T.gID 
            WHERE g.rID='a9fe3650-1f5a-11ec-b9a9-3f374b4dece0'
        */
        SQL =   "SELECT T.* ";
        SQL +=  "FROM `%s` T ";
        SQL +=  "LEFT JOIN `%s` G ON G.`%s`=T.`%s`";
        SQL +=  "WHERE G.`%s` = ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format(SQL,
            schema.TABLE_NAME,
            guestSchema.TABLE_NAME,
            guestSchema.column.gID,
            schema.column.gID,
            guestSchema.column.rID,
        );
        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },
};


module.exports = crudModel;