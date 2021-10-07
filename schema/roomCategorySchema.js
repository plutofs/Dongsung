/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'roomCategory';
    schemaModel.prototype.PK = 'rcID';

    this.rcID = null;
    this.cID = null;
    this.acNmae = null;
}

schemaModel.prototype = {
    column : {
        rcID 			    : "rcID",
        cID 			    : "cID",
        rcName              : "rcName"
    },

    setParam : function (params) {
        this.rcID = (params.rcID == undefined)? null : params.rcID;
        this.cID = (params.cID == undefined)? null : params.cID;
        this.rcName = (params.rcName == undefined)? null : params.rcName;
    }
}

module.exports = schemaModel;
