const { getSystemErrorMap } = require('util');

/**
 * Created by KaSha on 2017. 4. 10..
 */
 var rootPath = require('path').resolve('');
 var CryptUtil = require(rootPath + "/utils/cryptUtil");
 const cryptUtil = new CryptUtil();

var crudModel = function(db){
    this.rootPath = require('path').resolve(''); // 루트 디렉토리 경로

    // Import util library
    this.util = require('util');
    this.mysql = require('mysql');

    this.db = db;
};

crudModel.prototype = {

    getList : function(schema, cID, callback){
        var ViewRoomSchema = require(this.rootPath + '/schema/viewRoomSchema');
        var viewRoomSchema = new ViewRoomSchema();
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var inserts = [0, cID, cID, cID, cID];

        //var SQL = "SELECT `%s`, date_format(`%s`, '%Y/%c/%e %H:%i') as `%s`, M.`%s`, M.`%s`, RC.`%s` " +
        //    " FROM `%s` as R RIGHT OUTER JOIN `%s` as M ON R.`%s`=M.`%s` LEFT OUTER JOIN `%s` as RC ON R.`%s`=RC.`%s` WHERE M.`%s`= 0 AND M.`%s`=?;";

        var SQL = "SELECT * FROM `%s` WHERE `%s` IN (SELECT MAX(`%s`) FROM `%s` WHERE `%s`=? AND `%s`=? GROUP BY `%s` ) AND `%s`=? ORDER BY `%s`, `%s`;";
        SQL += "SELECT `%s`, `%s` FROM `%s` WHERE `%s`=? ORDER BY `%s`;";
        SQL += "SELECT * FROM `%s` WHERE `%s`=?;";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            viewRoomSchema.VIEW_NAME,
            viewRoomSchema.guestSchema.column.gID,
            viewRoomSchema.guestSchema.column.gID,
            viewRoomSchema.VIEW_NAME,
            viewRoomSchema.machineSchema.column.mType,
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.machineSchema.column.mID,
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.roomSchema.column.rName,
            viewRoomSchema.machineSchema.column.mName,

            viewRoomSchema.roomCategorySchema.column.rcID,
            viewRoomSchema.roomCategorySchema.column.rcName,
            viewRoomSchema.roomCategorySchema.TABLE_NAME,
            viewRoomSchema.roomCategorySchema.column.cID,
            viewRoomSchema.roomCategorySchema.column.rcName,

            companySchema.TABLE_NAME,
            companySchema.column.cID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getTotalList: function(schema, cID, callback){
        var ViewRoomSchema = require(this.rootPath + '/schema/viewRoomSchema');
        var viewRoomSchema = new ViewRoomSchema();
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();

        var inserts = [cID, 0, cID];

        var SQL = "SELECT * FROM `%s` WHERE `%s`=? AND (`%s`=? OR `%s` IS NULL)  ORDER BY `%s`, `%s`, `%s`;" +
            "SELECT * FROM `%s` WHERE `%s`=?;";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            viewRoomSchema.VIEW_TOTAL_NAME, //auto 0인것
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.roomTotalSchema.column.rtAuto,
            viewRoomSchema.roomTotalSchema.column.rtAuto,
            viewRoomSchema.roomTotalSchema.column.rtName,
            viewRoomSchema.roomSchema.column.rName,
            viewRoomSchema.machineSchema.column.mID,

            companySchema.TABLE_NAME,
            companySchema.column.cID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertData : function(schema, callback){
        var uuid = require('node-uuid');
        var inserts = new Array();
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`) VALUES ( ?, ?, ? ";

        inserts.push(uuid.v1(), schema.cID, schema.mName);

        if(schema.mac != null){
            SQL += (", ?");
            inserts.push(schema.mac);
        }else{
            SQL += ", DEFAULT ";
        }

        SQL += " ) ";
        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.PK,
            schema.column.cID,
            schema.column.mName,
            schema.column.mac
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    addCategory : function(schema, callback){
        var inserts = [schema.cID, schema.rcName];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`) VALUES ( ?, ? )";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.cID,
            schema.column.rcName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    change_rName : function (schema, callback) {
        var inserts = [schema.rID, schema.rName, schema.rName];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rID,
            schema.column.rName,
            schema.column.rName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    change_rcName : function (schema, callback) {
        var inserts = [schema.rcID, schema.rcName, schema.rcName];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rcID,
            schema.column.rcName,
            schema.column.rcName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    change_rtName : function (schema, callback) {
        var inserts = [schema.rtID, schema.rtName, schema.rtName];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rtID,
            schema.column.rtName,
            schema.column.rtName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getGuestData : function (schema, callback) {
        var RoomSchema = require(this.rootPath + '/schema/roomSchema');
        var roomSchema = new RoomSchema();

        var inserts = [schema.rID];
        var SQL = "SELECT * FROM `%s` G LEFT JOIN `%s` R ON G.`%s`=R.`%s` WHERE G.`%s`=? ORDER BY G.`%s` DESC LIMIT 1";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            roomSchema.TABLE_NAME,
            schema.column.rID,
            roomSchema.column.rID,
            schema.column.rID,
            schema.column.gRegidate
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    getRoomTotalData : function (schema, callback) {
        var ViewRoomSchema = require(this.rootPath + '/schema/viewRoomSchema');
        var viewRoomSchema = new ViewRoomSchema();

        var inserts = [schema.rtID, schema.rtID, schema.rtID];
        var SQL = "SELECT * FROM `%s` WHERE `%s`=?;" +
            "SELECT * FROM `%s` WHERE `%s`=?;" +
            "SELECT * FROM `%s` WHERE `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?) AND char_length(`%s`) <= 0 AND char_length(`%s`) <= 0 AND char_length(`%s`) > 0 ORDER BY `%s`, `%s`, `%s`";
        //roomTotal 데이터 가져오기
        //roomTotal에 연결된 totalList 가져오기
        //해당 회사에 있는 현재 viewRoom데이터 가져오기.

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rtID,

            viewRoomSchema.roomTotalListSchema.TABLE_NAME,
            viewRoomSchema.roomTotalListSchema.column.rtID,

            viewRoomSchema.VIEW_NAME,
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.machineSchema.TABLE_NAME,
            viewRoomSchema.machineSchema.column.mID,
            viewRoomSchema.roomSchema.column.rRelation,
            viewRoomSchema.roomSchema.column.rImageRelation,
            viewRoomSchema.guestSchema.column.gName,
            viewRoomSchema.roomSchema.column.rName,
            viewRoomSchema.guestSchema.column.gName,
            viewRoomSchema.machineSchema.column.mID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertGuest : function (schema, schema2, callback) {
        var RoomSchema = require(this.rootPath + '/schema/roomSchema');
        var roomSchema = new RoomSchema();
        var BugoApiSchema =  require(this.rootPath + '/schema/BugoApiSchema');
        var bugoApiSchema =new BugoApiSchema();
        var SangjuSchema = require(this.rootPath + '/schema/sangjuSchema');
        var sangjuSchema = new SangjuSchema();

        var inserts = [schema.rID, schema.gName, schema.gSex];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`,`%s`,`%s`) " +
            " VALUES ( ?, ?, ? ";

        if(schema.gAge != null && schema.gAge != ""){    SQL += (", ?");     inserts.push(schema.gAge);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gReligion != null){    SQL += (", ?");     inserts.push(schema.gReligion);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gReligionPosition != null){    SQL += (", ?");     inserts.push(schema.gReligionPosition);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gSangJu != null){    SQL += (", ?");     inserts.push(schema.gSangJu);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gSangJuTotal != null){    SQL += (", ?");     inserts.push(schema.gSangJuTotal);  }else{  SQL += ", DEFAULT ";    }
        if(schema.ipgwan != null && schema.ipgwan != ""){    SQL += (", ?");     inserts.push(schema.ipgwan);  }else{  SQL += ", DEFAULT ";    }
        if(schema.barin != null && schema.barin != ""){    SQL += (", ?");     inserts.push(schema.barin);  }else{  SQL += ", DEFAULT ";    }
        if(schema.jangji != null){    SQL += (", ?");     inserts.push(schema.jangji);  }else{  SQL += ", DEFAULT ";    }
        if(schema.diagnosis != null){    SQL += (", ?");     inserts.push(schema.diagnosis);  }else{  SQL += ", DEFAULT ";    }
        if(schema.first != null){    SQL += (", ?");     inserts.push(schema.first);  }else{  SQL += ", DEFAULT ";    }
        if(schema.calculate != null){    SQL += (", ?");     inserts.push(schema.calculate);  }else{  SQL += ", DEFAULT ";    }
        if(schema.funeralService != null){    SQL += (", ?");     inserts.push(schema.funeralService);  }else{  SQL += ", DEFAULT ";    }
        if(schema.baecha != null){    SQL += (", ?");     inserts.push(schema.baecha);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gImage != null){    SQL += (", ?");     inserts.push(schema.gImage);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gTemplate != null){    SQL += (", ?");     inserts.push(schema.gTemplate);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gMemo != null){    SQL += (", ?");     inserts.push(schema.gMemo);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gAllFont != null){    SQL += (", ?");     inserts.push(schema.gAllFont);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gArrow != null){    SQL += (", ?");     inserts.push(schema.gArrow);  }else{  SQL += ", DEFAULT ";    }
        if(schema.gEnableLogo != null){    SQL += (", ?");     inserts.push(schema.gEnableLogo);  }else{  SQL += ", DEFAULT ";    }
        if(schema.jik != null){    SQL += (", ?");     inserts.push(schema.jik);  }else{  SQL += ", DEFAULT ";    }
        if(schema.dDate != null){    SQL += (", ?");     inserts.push(schema.dDate);  }else{  SQL += ", DEFAULT ";    }

 
        SQL += ");";

        SQL += "UPDATE `%s` SET `%s`=?, `%s`=? WHERE `%s`=?;";
        inserts.push("", "", schema.rID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rID,      schema.column.gName,
            schema.column.gSex,     schema.column.gAge,
            schema.column.gReligion, schema.column.gReligionPosition,
            schema.column.gSangJu,  schema.column.gSangJuTotal,
            schema.column.ipgwan,   schema.column.barin,
            schema.column.jangji,   schema.column.diagnosis,
            schema.column.first,    schema.column.calculate,
            schema.column.funeralService,   schema.column.baecha,
            schema.column.gImage,   schema.column.gTemplate,
            schema.column.gMemo,    schema.column.gAllFont,
            schema.column.gArrow,   schema.column.gEnableLogo,
            schema.column.jik,   schema.column.dDate,

            roomSchema.TABLE_NAME,
            roomSchema.column.rRelation,
            roomSchema.column.rImageRelation,
            roomSchema.column.rID
        );

        const cdb = this.db;
        const cmysql =this.mysql;
        const cutil = this.util;
        this.db.execute(SQL, function(err, rows){ //라즈베리 
            var MachineSchema = require(require('path').resolve('') + '/schema/machineSchema');
            var machineSchema = new MachineSchema();
            var RoomSchema = require(require('path').resolve('') + '/schema/roomSchema');
            var roomSchema = new RoomSchema();
            if(err!=null){return ;}
            var resultRow = rows[0] || resultRow;

            var SQL2 = "SELECT `%s` FROM `%s` G JOIN `%s` M ON G.`%s`=M.`%s` WHERE G.`%s`=?; ";

            //같은 지점의 1,2 mType의 장비이거나, 해당 장비의 복제타입인 장비 조회해서 소켓 전송
            SQL2 += "SELECT `%s` FROM `%s` WHERE (`%s` IN (?, ?) AND `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?)) " +
                " OR (`%s` IN (SELECT `%s` FROM `%s` M JOIN `%s` R ON M.`%s`=R.`%s` WHERE M.`%s`=? AND (R.`%s`=? OR R.`%s`=?)));";

            SQL2 += "SELECT `%s` FROM `%s` WHERE `%s`=?;";

            SQL2 = require('mysql').format(SQL2, [resultRow.insertId, 1, 2, schema.rID, 0, schema.rID, schema.rID, schema.rID]);

            SQL2 = require('util').format( SQL2,
                machineSchema.column.mac,   schema.TABLE_NAME,
                machineSchema.TABLE_NAME,   schema.column.rID,
                machineSchema.column.mID,   schema.column.gID,

                machineSchema.column.mac,   machineSchema.TABLE_NAME,
                machineSchema.column.mType, machineSchema.column.cID,
                machineSchema.column.cID,   machineSchema.TABLE_NAME,
                machineSchema.column.mID,   machineSchema.column.mID,
                machineSchema.column.mID,   machineSchema.TABLE_NAME,
                roomSchema.TABLE_NAME,      machineSchema.column.mID,
                roomSchema.column.rID,      machineSchema.column.mType,
                roomSchema.column.rRelation, roomSchema.column.rImageRelation,

                machineSchema.column.cID,
                machineSchema.TABLE_NAME,
                machineSchema.column.mID
            );

            cdb.execute(SQL2, function(err2, rows2){
                var rows= rows2;
                if(!err2){
                    var inserts3 = [];
                    var SangjuSql = "DELETE FROM `%s` WHERE `%s` = ?; ";
                    SangjuSql += "INSERT INTO `%s`";
                    SangjuSql += "(`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`)";
                    inserts3.push(resultRow.insertId);
                    
                    var times = schema2.sIDX.length;
                    if(times==0){
                        if(schema2.sname!='' && schema2.bank!='' && schema2.stel!='', schema2.banknum!=''){
                            SangjuSql += "SELECT * FROM ";
                            SangjuSql += "(SELECT IF(? !='', ? ,IFNULL(MAX(sIDX)+1,1)) as sIDX,";
                            inserts3.push(schema2.sIDX,schema2.sIDX);
                            SangjuSql +=  "? as gID, ? as relation, ? as sname, ? as stel, ? as bank, ? as banknum , ? as bankowner, ";
                            SangjuSql +=  "IF(? !='', ?, NOW()) FROM T_SANGJU) ";
                            inserts3.push(  resultRow.insertId,
                                            schema2.relation,
                                            schema2.sname,
                                            schema2.stel,
                                            schema2.bank,
                                            schema2.banknum,
                                            schema2.bankowner,
                                            schema2.regDate,
                                            schema2.regDate
                                        );//은행 소유자 명 입력시까지 임시
                                        
                            SangjuSql += "S"+(i+1)+" ";
    
                        }else{
                            var viewSql = "SELECT * FROM `%s` WHERE `%s` = ?;";
                            viewSql = require('mysql').format(viewSql, resultRow.insertId) ;
                            viewSql = require('util').format(viewSql, bugoApiSchema.TABLE_NAME, bugoApiSchema.column.idx);
                            cdb.execute(viewSql,function(err3,rows4){
                                rows.push(rows4); // cdb를 사용하면, 기존 rows에 접근할수 없으므로, 새로선언
                                rows4 = cryptUtil.setRowsApi(rows4)
                                rows["apiData"] = rows4;
                                callback(err3, rows, resultRow.insertId);
                            });
                        }
                    }else{    
                        for(var i=0; i<times; i++){
                            if(schema2.sname[i]!='' && schema2.bank[i]!='' && schema2.stel[i]!='', schema2.banknum[i]!=''){//값이 있는경우 넣기
                                if(i>0){//union all집어넣기
                                    SangjuSql+="UNION ALL ";
                                }
                                SangjuSql += "SELECT * FROM ";
                                SangjuSql += "(SELECT IF(? !='', ? ,IFNULL(MAX(sIDX)+1,1)) as sIDX,";
                                inserts3.push(schema2.sIDX[i],schema2.sIDX[i]);
                                SangjuSql +=  "? as gID, ? as relation, ? as sname, ? as stel, ? as bank, ? as banknum , ? as bankowner, ";
                                SangjuSql +=  "IF(? !='', ?, NOW()) FROM T_SANGJU) ";
                                inserts3.push(  schema2.gID,
                                                schema2.relation[i],
                                                schema2.sname[i],
                                                schema2.stel[i],
                                                schema2.bank[i],
                                                schema2.banknum[i],
                                                schema2.bankowner[i],
                                                schema2.regDate[i],
                                                schema2.regDate[i]
                                            );//은행 소유자 명 입력시까지 임시
                                            
                                SangjuSql += "S"+(i+1)+" ";
        
                            }
                        }
                        SangjuSql += "ON DUPLICATE KEY UPDATE";
                        SangjuSql += "`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),";
                        SangjuSql += "`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`)";
        
                        SangjuSql = cmysql.format(SangjuSql,inserts3);
                        SangjuSql = cutil.format(SangjuSql,
                            sangjuSchema.TABLE_NAME,
                            sangjuSchema.column.gID, //delete까지 
                            sangjuSchema.TABLE_NAME,
                            sangjuSchema.column.sIDX,
                            sangjuSchema.column.gID,
                            sangjuSchema.column.relation,
                            sangjuSchema.column.sname,
                            sangjuSchema.column.stel,
                            sangjuSchema.column.bank,
                            sangjuSchema.column.banknum,
                            sangjuSchema.column.bankowner,
                            sangjuSchema.column.regDate,//insert
                            sangjuSchema.column.gID,        sangjuSchema.column.gID,
                            sangjuSchema.column.relation,   sangjuSchema.column.relation,
                            sangjuSchema.column.sname,      sangjuSchema.column.sname,
                            sangjuSchema.column.stel,       sangjuSchema.column.stel,
                            sangjuSchema.column.bank,       sangjuSchema.column.bank,
                            sangjuSchema.column.banknum,    sangjuSchema.column.banknum,
                            sangjuSchema.column.bankowner,  sangjuSchema.column.bankowner,
                            sangjuSchema.column.regDate,    sangjuSchema.column.regDate //duplication
                        );
                            cdb.execute(SangjuSql, function(err2, rows3){
                                var viewSql = "SELECT * FROM `%s` WHERE `%s` = ?;";
                                viewSql = require('mysql').format(viewSql, resultRow.insertId) ;
                                viewSql = require('util').format(viewSql, bugoApiSchema.TABLE_NAME, bugoApiSchema.column.idx);
                                rows.push(rows3);
                                cdb.execute(viewSql,function(err3,rows4){
                                    rows4 = cryptUtil.setRowsApi(rows4)
                                    rows["apiData"] = rows4;
                                    callback(err3, rows, resultRow.insertId);
                                });
                            });
                        }
                    }else{
                        callback(err2, rows);
                    }
            });
        });
    },

    updateGuest : function (schema,schema2, gImageRemove, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var RoomSchema = require(this.rootPath + '/schema/roomSchema');
        var roomSchema = new RoomSchema();
        var BugoApiSchema =  require(this.rootPath + '/schema/BugoApiSchema');
        var bugoApiSchema =new BugoApiSchema();
        var SangjuSchema = require(this.rootPath + '/schema/sangjuSchema');
        var sangjuSchema = new SangjuSchema();

        var inserts = [schema.gName, schema.gSex];
        var SQL = "UPDATE `%s` SET `%s`=?, `%s`=? ";
        var addSQL = "";

        const cdb = this.db;
        const cmysql =this.mysql;
        const cutil = this.util;

        if(schema.gAge == ""){
            addSQL += (", `%s`=DEFAULT "); addSQL = this.util.format( addSQL, schema.column.gAge);
        } else if (schema.gAge != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gAge);
            inserts.push(schema.gAge);
        }

        if(schema.gImage != null && schema.gImage.length > 0){
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gImage);
            inserts.push(schema.gImage);
        }else if(gImageRemove === "1" || gImageRemove === 1){
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gImage);
            inserts.push(null);
        }

        if (schema.gReligion != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gReligion);
            inserts.push(schema.gReligion);
        }

        if (schema.gReligionPosition != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gReligionPosition);
            inserts.push(schema.gReligionPosition);
        }

        if (schema.gSangJu != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gSangJu);
            inserts.push(schema.gSangJu);
        }

        if (schema.gSangJuTotal != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gSangJuTotal);
            inserts.push(schema.gSangJuTotal);
        }

        if(schema.ipgwan == ""){
            addSQL += (", `%s`=DEFAULT "); addSQL = this.util.format( addSQL, schema.column.ipgwan);
        } else if (schema.ipgwan != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.ipgwan);
            inserts.push(schema.ipgwan);
        }

        if(schema.barin == ""){
            addSQL += (", `%s`=DEFAULT "); addSQL = this.util.format( addSQL, schema.column.barin);
        } else if (schema.barin != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.barin);
            inserts.push(schema.barin);
        }

        if (schema.jangji != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.jangji);
            inserts.push(schema.jangji);
        }

        if (schema.diagnosis != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.diagnosis);
            inserts.push(schema.diagnosis);
        }

        if (schema.first != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.first);
            inserts.push(schema.first);
        }

        if (schema.calculate != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.calculate);
            inserts.push(schema.calculate);
        }

        if (schema.funeralService != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.funeralService);
            inserts.push(schema.funeralService);
        }

        if (schema.baecha != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.baecha);
            inserts.push(schema.baecha);
        }

        if (schema.gTemplate != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gTemplate);
            inserts.push(schema.gTemplate);
        }

        if (schema.gMemo != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gMemo);
            inserts.push(schema.gMemo);
        }

        if (schema.gAllFont != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gAllFont);
            inserts.push(schema.gAllFont);
        }

        if (schema.gArrow != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gArrow);
            inserts.push(schema.gArrow);
        }

        if (schema.gEnableLogo != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.gEnableLogo);
            inserts.push(schema.gEnableLogo);
        }
        if (schema.dDate != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.dDate);
            inserts.push(schema.dDate);
        }
        if (schema.jik != null) {
            addSQL += (", `%s`=? ");   addSQL = this.util.format( addSQL, schema.column.jik);
            inserts.push(schema.jik);
        }

        SQL += addSQL;
        SQL += " WHERE `%s`=?;";
        inserts.push(schema.gID);

        SQL += "SELECT `%s` FROM `%s` G JOIN `%s` M ON G.`%s`=M.`%s` WHERE G.`%s`=?;";
        inserts.push(schema.gID);

        //같은 지점의 1,2 mType의 장비이거나, 해당 장비의 복제타입인 장비 조회해서 소켓 전송
        SQL += "SELECT `%s` FROM `%s` WHERE (`%s` IN (?, ?) AND `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?)) " +
            " OR (`%s` IN (SELECT `%s` FROM `%s` M JOIN `%s` R ON M.`%s`=R.`%s` WHERE M.`%s`=? AND (R.`%s`=? OR R.`%s`=?)));";
        inserts.push(1, 2, schema.rID, 0, schema.rID, schema.rID);

        SQL += "SELECT `%s` FROM `%s` WHERE `%s`=?;";
        inserts.push(schema.rID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.gName,
            schema.column.gSex,
            schema.column.gID,

            machineSchema.column.mac,
            schema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            schema.column.rID,
            machineSchema.column.mID,
            schema.column.gID,

            machineSchema.column.mac,   machineSchema.TABLE_NAME,
            machineSchema.column.mType, machineSchema.column.cID,
            machineSchema.column.cID,   machineSchema.TABLE_NAME,
            machineSchema.column.mID,   machineSchema.column.mID,
            machineSchema.column.mID,   machineSchema.TABLE_NAME,
            roomSchema.TABLE_NAME,      machineSchema.column.mID,
            roomSchema.column.rID,      machineSchema.column.mType,
            roomSchema.column.rRelation, roomSchema.column.rImageRelation,

            machineSchema.column.cID,
            machineSchema.TABLE_NAME,
            machineSchema.column.mID
        );

        this.db.execute(SQL, function(err, rows){
            if(!err){
                var rows3 = rows;
                var inserts3 = [];
                var SangjuSql = "DELETE FROM `%s` WHERE `%s` = ?; ";
                SangjuSql += "INSERT INTO `%s`";
                SangjuSql += "(`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`,`%s`)";
                inserts3.push(schema2.gID);
                
                var times = schema2.sIDX.length;
                if(times==0){
                    if(schema2.sname!='' && schema2.bank!='' && schema2.stel!='', schema2.banknum!=''){
                        SangjuSql += "SELECT * FROM ";
                        SangjuSql += "(SELECT IF(? !='', ? ,IFNULL(MAX(sIDX)+1,1)) as sIDX,";
                        inserts3.push(schema2.sIDX,schema2.sIDX);
                        SangjuSql +=  "? as gID, ? as relation, ? as sname, ? as stel, ? as bank, ? as banknum , ? as bankowner, ";
                        SangjuSql +=  "IF(? !='', ?, NOW()) FROM T_SANGJU) ";
                        inserts3.push(  schema2.gID,
                                        schema2.relation,
                                        schema2.sname,
                                        schema2.stel,
                                        schema2.bank,
                                        schema2.banknum,
                                        schema2.bankowner,
                                        schema2.regDate,
                                        schema2.regDate
                                    );//은행 소유자 명 입력시까지 임시
                                    
                        SangjuSql += "S"+(i+1)+" ";

                    }else{
                            var viewSql = "SELECT * FROM `%s` WHERE `%s` = ?;";
                            viewSql = require('mysql').format(viewSql, schema2.gID) ;
                            viewSql = require('util').format(viewSql, bugoApiSchema.TABLE_NAME, bugoApiSchema.column.idx);
                            cdb.execute(viewSql,function(err3,rows4){
                                rows4 = cryptUtil.setRowsApi(rows4)
                                rows["apiData"] = rows4;
                                callback(err3, rows);
                            });
                    }
                }

                for(var i=0; i<times; i++){
                    if(schema2.sname[i]!='' && schema2.bank[i]!='' && schema2.stel[i]!='', schema2.banknum[i]!=''){//값이 있는경우 넣기
                        if(i>0){//union all집어넣기
                            SangjuSql+="UNION ALL ";
                        }
                        SangjuSql += "SELECT * FROM ";
                        SangjuSql += "(SELECT IF(? !='', ? ,IFNULL(MAX(sIDX)+1,1)) as sIDX,";
                        inserts3.push(schema2.sIDX[i],schema2.sIDX[i]);
                        SangjuSql +=  "? as gID, ? as relation, ? as sname, ? as stel, ? as bank, ? as banknum , ? as bankowner, ";
                        SangjuSql +=  "IF(? !='', ?, NOW()) FROM T_SANGJU) ";
                        inserts3.push(  schema2.gID,
                                        schema2.relation[i],
                                        schema2.sname[i],
                                        schema2.stel[i],
                                        schema2.bank[i],
                                        schema2.banknum[i],
                                        schema2.bankowner[i],
                                        schema2.regDate[i],
                                        schema2.regDate[i]
                                    );//은행 소유자 명 입력시까지 임시
                                    
                        SangjuSql += "S"+(i+1)+" ";

                    }
                }
                SangjuSql += "ON DUPLICATE KEY UPDATE";
                SangjuSql += "`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),";
                SangjuSql += "`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`),`%s` = values(`%s`)";

                SangjuSql = cmysql.format(SangjuSql,inserts3);
                SangjuSql = cutil.format(SangjuSql,
                    sangjuSchema.TABLE_NAME,
                    sangjuSchema.column.gID, //delete까지 
                    sangjuSchema.TABLE_NAME,
                    sangjuSchema.column.sIDX,
                    sangjuSchema.column.gID,
                    sangjuSchema.column.relation,
                    sangjuSchema.column.sname,
                    sangjuSchema.column.stel,
                    sangjuSchema.column.bank,
                    sangjuSchema.column.banknum,
                    sangjuSchema.column.bankowner,
                    sangjuSchema.column.regDate,//insert
                    sangjuSchema.column.gID,        sangjuSchema.column.gID,
                    sangjuSchema.column.relation,   sangjuSchema.column.relation,
                    sangjuSchema.column.sname,      sangjuSchema.column.sname,
                    sangjuSchema.column.stel,       sangjuSchema.column.stel,
                    sangjuSchema.column.bank,       sangjuSchema.column.bank,
                    sangjuSchema.column.banknum,    sangjuSchema.column.banknum,
                    sangjuSchema.column.bankowner,  sangjuSchema.column.bankowner,
                    sangjuSchema.column.regDate,    sangjuSchema.column.regDate //duplication
                );
                cdb.execute(SangjuSql, function(err2, rows2){
                    rows3.push(rows2);
                    var viewSql = "SELECT * FROM `%s` WHERE `%s` = ?;";
                            viewSql = require('mysql').format(viewSql, schema2.gID) ;
                            viewSql = require('util').format(viewSql, bugoApiSchema.TABLE_NAME, bugoApiSchema.column.idx);
                            cdb.execute(viewSql,function(err3,rows4){
                                rows4 = cryptUtil.setRowsApi(rows4)
                                rows3["apiData"] = rows4;
                                callback(err3, rows3);
                            });
                });
            }else{
                var viewSql = "SELECT * FROM `%s` WHERE `%s` = ?;";
                viewSql = require('mysql').format(viewSql, schema2.gID) ;
                viewSql = require('util').format(viewSql, bugoApiSchema.TABLE_NAME, bugoApiSchema.column.idx);
                cdb.execute(viewSql,function(err3,rows4){
                    var rows3 = rows;
                    rows4 = cryptUtil.setRowsApi(rows4)
                    rows3["apiData"] = rows4;
                    callback(err3, rows3);
                });
            }
        });
        
    },

    changeRoomCategory : function (schema, callback) {
        var inserts = [schema.rID, schema.rcID, schema.rcID];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `%s`=?";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rID,
            schema.column.rcID,
            schema.column.rcID
        )

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertRoomTotalList : function (schema, roomCheckList, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var RoomTotalListSchema = require(this.rootPath + '/schema/roomTotalListSchema');
        var roomTotalListSchema = new RoomTotalListSchema();

        schema.rtInfo = (schema.rtInfo != null ? schema.rtInfo : "");

        var inserts = [schema.rtID, schema.rtAllFont, schema.rtTemplate, schema.rtInfo, 0, schema.rtEnableLogo, schema.rtAllFont, schema.rtTemplate, schema.rtInfo, 0, schema.rtEnableLogo, schema.rtID];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `%s`=?, `%s`=?, `%s`=?, `%s`=?, `%s`=?; " +
            "DELETE FROM `%s` WHERE `%s`=?;";

        SQL += "SELECT `%s` FROM `%s` WHERE `%s`=?;";
        inserts.push(schema.rtID);

        if(roomCheckList.length>0){
            var SQL2 = "INSERT INTO `%s` (`%s`, `%s`) VALUES ";
            if(Object.prototype.toString.call(roomCheckList) == '[object Array]'){  //배열이면
                roomCheckList.forEach(function (element, index) {
                    SQL2 += " (?, ?)";
                    if(index<roomCheckList.length-1){
                        SQL2 += ", ";
                    }
                    inserts.push(schema.rtID);
                    inserts.push(element);
                });
            }else{
                SQL2 += " (?, ?)";
                inserts.push(schema.rtID);
                inserts.push(roomCheckList);
            }


            SQL2 += ";";

            SQL2 = this.util.format( SQL2,
                roomTotalListSchema.TABLE_NAME,
                roomTotalListSchema.column.rtID,
                roomTotalListSchema.column.rID
            );

            SQL += SQL2;
        }

        SQL += "SELECT M.`%s` FROM `%s` RT JOIN `%s` M ON RT.`%s`=M.`%s` WHERE RT.`%s`=?";
        inserts.push(schema.rtID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rtID,
            schema.column.rtAllFont,
            schema.column.rtTemplate,
            schema.column.rtInfo,
            schema.column.rtAuto,
            schema.column.rtEnableLogo,
            schema.column.rtAllFont,
            schema.column.rtTemplate,
            schema.column.rtInfo,
            schema.column.rtAuto,
            schema.column.rtEnableLogo,

            roomTotalListSchema.TABLE_NAME,
            roomTotalListSchema.column.rtID,

            machineSchema.column.cID,
            machineSchema.TABLE_NAME,
            machineSchema.column.mID,

            machineSchema.column.mac,
            schema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            schema.column.rtID,
            machineSchema.column.mID,
            schema.column.rtID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    deleteCategory : function (schema, callback) {
        var inserts = [schema.rcID];
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

    getTemplates : function (schema, callback) {
        var inserts = [schema.tType];
        var SQL = "SELECT * FROM `%s` WHERE `%s`=? ORDER BY `%s` ASC";

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.tType,
            schema.column.fileName
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    insertEmptyGuest : function (schema, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var RoomSchema = require(this.rootPath + '/schema/roomSchema');
        var roomSchema = new RoomSchema();

        var inserts = [schema.rID, schema.rID, "", "", schema.rID];
        var SQL = "INSERT INTO `%s` (`%s`) VALUES (?); " +
            "SELECT * FROM `%s` WHERE `%s`=?; " +
            "UPDATE `%s` SET `%s`=?, `%s`=? WHERE `%s`=?;" +

            "SELECT `%s` FROM `%s` WHERE (`%s` IN (?, ?) AND `%s` IN (SELECT `%s` FROM `%s` WHERE `%s`=?)) " +
            " OR (`%s` IN (SELECT `%s` FROM `%s` M JOIN `%s` R ON M.`%s`=R.`%s` WHERE M.`%s`=? AND (R.`%s`=? OR R.`%s`=?)));";
            //같은 지점의 1,2 mType의 장비이거나, 해당 장비의 복제타입인 장비 조회해서 소켓 전송
            inserts.push(1, 2, schema.rID, 0, schema.rID, schema.rID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rID,

            machineSchema.TABLE_NAME,
            machineSchema.column.mID,

            roomSchema.TABLE_NAME,
            roomSchema.column.rRelation,
            roomSchema.column.rImageRelation,
            roomSchema.column.rID,

            machineSchema.column.mac,   machineSchema.TABLE_NAME,
            machineSchema.column.mType, machineSchema.column.cID,
            machineSchema.column.cID,   machineSchema.TABLE_NAME,
            machineSchema.column.mID,   machineSchema.column.mID,
            machineSchema.column.mID,   machineSchema.TABLE_NAME,
            roomSchema.TABLE_NAME,      machineSchema.column.mID,
            roomSchema.column.rID,      machineSchema.column.mType,
            roomSchema.column.rRelation, roomSchema.column.rImageRelation
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    updateReplicationRoom : function (schema, roomVal, copyVal, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var GuestSchema = require(this.rootPath + '/schema/guestSchema');
        var guestSchema = new GuestSchema();
        var SQL = "";

        if(copyVal === "2") {
            SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`) " +
                "(SELECT ?, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s`, `%s` FROM `%s`,`%s` WHERE `%s`=?); " +
                "UPDATE `%s` SET `%s`=?, `%s`=? WHERE `%s`=?; SELECT * FROM `%s` WHERE `%s`=?";
            SQL = this.mysql.format(SQL, [schema.rID, roomVal, "", "", schema.rID, schema.rID]);

            SQL = this.util.format( SQL,
                guestSchema.TABLE_NAME,
                guestSchema.column.rID,     guestSchema.column.gName,       guestSchema.column.gSex,
                guestSchema.column.gAge,    guestSchema.column.gReligion,   guestSchema.column.gReligionPosition,
                guestSchema.column.gSangJu, guestSchema.column.gSangJuTotal, guestSchema.column.ipgwan,
                guestSchema.column.barin,   guestSchema.column.jangji,      guestSchema.column.diagnosis,
                guestSchema.column.first,   guestSchema.column.calculate,   guestSchema.column.funeralService,
                guestSchema.column.baecha,  guestSchema.column.gImage,      guestSchema.column.gTemplate,
                guestSchema.column.gState,  guestSchema.column.gAutoState,  guestSchema.column.gDisplayStart,
                guestSchema.column.gDisplayEnd,     guestSchema.column.gAllFont,    guestSchema.column.gSangJuFontSize,
                guestSchema.column.gEnableLogo,     guestSchema.column.gArrow,      guestSchema.column.jik,
                guestSchema.column.gName,       guestSchema.column.gSex,
                guestSchema.column.gAge,    guestSchema.column.gReligion,   guestSchema.column.gReligionPosition,
                guestSchema.column.gSangJu, guestSchema.column.gSangJuTotal, guestSchema.column.ipgwan,
                guestSchema.column.barin,   guestSchema.column.jangji,      guestSchema.column.diagnosis,
                guestSchema.column.first,   guestSchema.column.calculate,   guestSchema.column.funeralService,
                guestSchema.column.baecha,  guestSchema.column.gImage,      guestSchema.column.gTemplate,
                guestSchema.column.gState,  guestSchema.column.gAutoState,  guestSchema.column.gDisplayStart,
                guestSchema.column.gDisplayEnd,     guestSchema.column.gAllFont,    guestSchema.column.gSangJuFontSize,
                guestSchema.column.gEnableLogo,     guestSchema.column.gArrow,      guestSchema.column.jik,
                "viewRecentGuest",      guestSchema.column.rID,

                schema.TABLE_NAME,
                schema.column.rRelation,
                schema.column.rImageRelation,
                schema.column.rID,

                machineSchema.TABLE_NAME,
                machineSchema.column.mID
            );
            console.log(SQL);
        } else {
            SQL = "UPDATE `%s` SET `%s`=?, `%s`=? WHERE `%s`=?; SELECT * FROM `%s` WHERE `%s`=?";
            var inserts = [];
            switch(copyVal){
                case "0":
                    inserts.push(roomVal, "", schema.rID, schema.rID);
                    break;
                case "1":
                    inserts.push("", roomVal, schema.rID, schema.rID);
                    break;
            }

            SQL = this.mysql.format(SQL, inserts);

            SQL = this.util.format( SQL,
                schema.TABLE_NAME,
                schema.column.rRelation,
                schema.column.rImageRelation,
                schema.column.rID,

                machineSchema.TABLE_NAME,
                machineSchema.column.mID
            );
        }

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    updateAutoTotal : function (schema, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var RoomTotalListSchema = require(this.rootPath + '/schema/roomTotalListSchema');
        var roomTotalListSchema = new RoomTotalListSchema();

        schema.rtInfo = (schema.rtInfo != null ? schema.rtInfo : "");

        var inserts = [schema.rtID, schema.rtAllFont, schema.rtTemplate, schema.rtInfo, schema.rtAuto, schema.rtAllFont, schema.rtTemplate, schema.rtInfo, schema.rtAuto, schema.rtID];
        var SQL = "INSERT INTO `%s` (`%s`, `%s`, `%s`, `%s`, `%s`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `%s`=?, `%s`=?, `%s`=?, `%s`=?; " +
            "DELETE FROM `%s` WHERE `%s`=?;";

        SQL += "SELECT `%s` FROM `%s` RT JOIN `%s` M ON RT.`%s`=M.`%s` WHERE M.`%s`=? AND RT.`%s`=?;";
        inserts.push(1, 1);

        SQL += "SELECT `%s` FROM `%s` WHERE `%s`=?;";
        inserts.push(schema.rtID);

        SQL = this.mysql.format(SQL, inserts);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            schema.column.rtID,
            schema.column.rtAllFont,
            schema.column.rtTemplate,
            schema.column.rtInfo,
            schema.column.rtAuto,
            schema.column.rtAllFont,
            schema.column.rtTemplate,
            schema.column.rtInfo,
            schema.column.rtAuto,

            roomTotalListSchema.TABLE_NAME,
            roomTotalListSchema.column.rtID,

            machineSchema.column.mac,
            schema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            schema.column.rtID,
            machineSchema.column.mID,
            machineSchema.column.mType,
            schema.column.rtAuto,

            machineSchema.column.cID,
            machineSchema.TABLE_NAME,
            machineSchema.column.mID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },
    
    invitation : function (schema, callback) {
        var MachineSchema = require(this.rootPath + '/schema/machineSchema');
        var machineSchema = new MachineSchema();
        var CompanySchema = require(this.rootPath + '/schema/companySchema');
        var companySchema = new CompanySchema();
        var RoomSchema = require(this.rootPath + '/schema/roomSchema');
        var roomSchema = new RoomSchema();
        // var GuestSchema = require(this.rootPath + '/schema/guestSchema');
        // var guestSchema = new GuestSchema();

        var SQL = "SELECT * FROM ((`%s` G JOIN `%s` M ON G.`%s`=M.`%s`) JOIN `%s` C ON M.`%s`=C.`%s`) " +
            " JOIN `%s` R ON M.`%s`=R.`%s` WHERE G.`%s`=?";
        console.log(SQL);
        SQL = this.mysql.format(SQL, [schema.gID]);

        SQL = this.util.format( SQL,
            schema.TABLE_NAME,
            machineSchema.TABLE_NAME,
            schema.column.rID,
            machineSchema.column.mID,
            companySchema.TABLE_NAME,
            machineSchema.column.cID,
            companySchema.column.cID,
            roomSchema.TABLE_NAME,
            machineSchema.column.mID,
            roomSchema.column.rID,
            schema.column.gID
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    },

    roomTable : function (cID, callback) {
        var ViewRoomSchema = require(this.rootPath + '/schema/viewRoomSchema');
        var viewRoomSchema = new ViewRoomSchema();

        var SQL = "SELECT * FROM `%s` WHERE `%s`=? AND LENGTH(`%s`) > 0 AND LENGTH(`%s`) = 0 AND LENGTH(`%s`) = 0";

        SQL = this.mysql.format(SQL, [cID]);

        SQL = this.util.format( SQL,
            viewRoomSchema.VIEW_NAME,
            viewRoomSchema.machineSchema.column.cID,
            viewRoomSchema.guestSchema.column.gName,
            viewRoomSchema.roomSchema.column.rRelation,
            viewRoomSchema.roomSchema.column.rImageRelation
        );

        this.db.execute(SQL, function(err, rows){
            callback(err, rows);
        });
    }
};

module.exports = crudModel;