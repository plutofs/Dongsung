/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'room';
    schemaModel.prototype.PK = 'rID';

    this.rID = null;
    this.rcID = null;
    this.rName = null;
    this.rRelation = null;
    this.rImageRelation = null;
    this.rMemo = null;
    this.rRegidate = null;
}

schemaModel.prototype = {
    column : {
        rID 			    : "rID",
        rcID                : "rcID",
        rName 		        : "rName",
        rRelation           : "rRelation",
        rImageRelation      : "rImageRelation",
        rMemo 		    	: "rMemo",
        rRegidate 			: "rRegidate"
    },

    setParam : function (params) {
        this.rID = (params.rID == undefined)? null : params.rID;
        this.rcID = (params.rcID == undefined)? null : params.rcID;
        this.rName = (params.rName == undefined)? null : params.rName;
        this.rRelation = (params.rRelation == undefined)? null : params.rRelation;
        this.rImageRelation = (params.rImageRelation == undefined)? null : params.rImageRelation;
        this.rMemo = (params.rMemo == undefined)? null : params.rMemo;
        this.rRegidate = (params.rRegidate == undefined)? null : params.rRegidate;
    }
}

module.exports = schemaModel;
