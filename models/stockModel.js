/**
 * Created by KaSha on 2017. 5. 19..
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
        var SQL = "SELECT * FROM `%s` WHERE `%s`=? " + paginationSchema.searchQuery + " ORDER BY `%s` " + paginationSchema.sord + " LIMIT ?,?;";

        var beginRow = paginationSchema.rows * paginationSchema.page - paginationSchema.rows;

        var inserts = [schema.cID, beginRow, paginationSchema.rows * 1];

        SQL += "SELECT ? AS records, ? AS page, CEIL(count(*)/?) AS total FROM `%s` WHERE `%s`=?";

        inserts.push(paginationSchema.rows);
        inserts.push(paginationSchema.page);
        inserts.push(paginationSchema.rows);
        inserts.push(schema.cID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.cID,
            paginationSchema.sidx,

            schema.TABLE_NAME,
            schema.column.cID
        )

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertData : function(schema, callback){
        var inserts = [schema.cID, schema.date, schema.delivery, schema.pc, schema.monitor23, schema.monitor27, schema.monitor32, schema.supportFixture, schema.multitab, schema.concent2, schema.concent3, schema.electricWire, schema.utp,
            schema.molding, schema.router4, schema.router8, schema.hub5, schema.hub8, schema.hub16, schema.strawberry, schema.sdCard, schema.charger, schema.hdmi, schema.dvi, schema.monitorAdapter, schema.repeaterAdapter,
            schema.repeater, schema.distributor, schema.etc];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`) " +
            "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.cID,
            schema.column.date,
            schema.column.delivery,
            schema.column.pc,
            schema.column.monitor23,
            schema.column.monitor27,
            schema.column.monitor32,
            schema.column.supportFixture,
            schema.column.multitab,
            schema.column.concent2,
            schema.column.concent3,
            schema.column.electricWire,
            schema.column.utp,
            schema.column.molding,
            schema.column.router4,
            schema.column.router8,
            schema.column.hub5,
            schema.column.hub8,
            schema.column.hub16,
            schema.column.strawberry,
            schema.column.sdCard,
            schema.column.charger,
            schema.column.hdmi,
            schema.column.dvi,
            schema.column.monitorAdapter,
            schema.column.repeaterAdapter,
            schema.column.repeater,
            schema.column.distributor,
            schema.column.etc
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    editData : function(schema, callback){
        var inserts = [schema.date, schema.delivery, schema.pc, schema.monitor23, schema.monitor27, schema.monitor32, schema.supportFixture, schema.multitab, schema.concent2, schema.concent3, schema.electricWire, schema.utp,
            schema.molding, schema.router4, schema.router8, schema.hub5, schema.hub8, schema.hub16, schema.strawberry, schema.sdCard, schema.charger, schema.hdmi, schema.dvi, schema.monitorAdapter, schema.repeaterAdapter,
            schema.repeater, schema.distributor, schema.etc, schema.sID];
        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, " +
            "`%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=? WHERE `%s` = ?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.date,
            schema.column.delivery,
            schema.column.pc,
            schema.column.monitor23,
            schema.column.monitor27,
            schema.column.monitor32,
            schema.column.supportFixture,
            schema.column.multitab,
            schema.column.concent2,
            schema.column.concent3,
            schema.column.electricWire,
            schema.column.utp,
            schema.column.molding,
            schema.column.router4,
            schema.column.router8,
            schema.column.hub5,
            schema.column.hub8,
            schema.column.hub16,
            schema.column.strawberry,
            schema.column.sdCard,
            schema.column.charger,
            schema.column.hdmi,
            schema.column.dvi,
            schema.column.monitorAdapter,
            schema.column.repeaterAdapter,
            schema.column.repeater,
            schema.column.distributor,
            schema.column.etc,
            schema.PK
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    deleteData : function(schema, callback){
        var inserts = [schema.sID];
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