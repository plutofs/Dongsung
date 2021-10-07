/**
 * Created by KaSha on 2017. 5. 24..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'template';
    schemaModel.prototype.PK = 'fileName';

    this.tName = null;
    this.fileName = null;
    this.mType = null;
    this.maxCnt = null;
}

schemaModel.prototype = {
    column : {
        tName               : "tName",
        fileName 		    : "fileName",
        tType               : "tType",
        maxCnt              : "maxCnt"
    },

    setParam : function (params) {
        this.tName = (params.tName == undefined)? null : params.tName;
        this.fileName = (params.fileName == undefined)? null : params.fileName;
        this.tType = (params.tType == undefined)? null : params.tType;
        this.maxCnt = (params.maxCnt == undefined) ? null : params.maxCnt;
    }
}

module.exports = schemaModel;
