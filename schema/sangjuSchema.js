/**
 * Created by KaSha on 2017. 4. 10..
 */
 var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'T_SANGJU';
    schemaModel.prototype.PK = 'sIDX';

    this.sIDX= null;
    this.gID= null;
    this.relation= null;
    this.sname= null;
    this.stel= null;
    this.bank= null;
    this.banknum= null;
    this.bankowner= null;
    this.status= null;
    this.regDate= null;

}

schemaModel.prototype = {
    column : {
        sIDX                : "sIDX",
        gID                 : "gID",
        relation            : "relation",
        sname               : "sname",
        stel                : "stel",
        bank                : "bank",
        banknum             : "banknum",
        bankowner           : "bankowner",
        status              : "status",
        regDate             : "regDate",

    },

    setParam : function (params) {
        this.sIDX = (params.sIDX == undefined)? null : params.sIDX;
        this.gID = (params.gID == undefined)? null : params.gID;
        this.relation = (params.relation == undefined)? null : params.relation;
        this.sname = (params.sname == undefined)? null : params.sname;
        this.stel = (params.stel == undefined)? null : params.stel;
        this.bank = (params.bank == undefined)? null : params.bank;
        this.banknum = (params.banknum == undefined)? null : params.banknum;
        this.bankowner = (params.bankowner == undefined)? null : params.bankowner;
        this.status = (params.status == undefined)? null : params.status;
        this.regDate = (params.regDate == undefined)? null : params.regDate;
        
    }
}

module.exports = schemaModel;