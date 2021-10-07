/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'waitingView';
    schemaModel.prototype.PK = 'wID';

    this.wID = null;
    this.cID = null;
    this.fileName = null;
    this.fileSize = null;
    this.fileType = null;
}

schemaModel.prototype = {
    column : {
        wID 			    : "wID",
        cID 			    : "cID",
        fileName            : "fileName",
        fileSize            : "fileSize",
        fileType            : "fileType"
    },

    setParam : function (params) {
        this.wID = (params.wID == undefined)? null : params.wID;
        this.cID = (params.cID == undefined)? null : params.cID;
        this.fileName = (params.fileName == undefined)? null : params.fileName;
        this.fileSize = (params.fileSize == undefined)? null : params.fileSize;
        this.fileType = (params.fileType == undefined)? null : params.fileType;
    }
}

module.exports = schemaModel;
