/**
 * Created by KaSha on 2017. 5. 21..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'ipgwanScheduler';
    schemaModel.prototype.PK = 'iID';

    this.iID = null;
    this.mID = null;
    this.targetID = null;
}

schemaModel.prototype = {
    column : {
        iID  			    : "iID",
        mID                : "mID",
        targetID 		    	: "targetID"
    },

    setParam : function (params) {
        this.iID = (params.iID == undefined)? null : params.iID;
        this.mID = (params.mID == undefined)? null : params.mID;
        this.targetID = (params.targetID == undefined)? null : params.targetID;
    }
}

module.exports = schemaModel;
