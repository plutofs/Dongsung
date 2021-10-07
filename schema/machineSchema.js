/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'machine';
    schemaModel.prototype.PK = 'mID';

    this.mID = null;
    this.cID = null;
    this.rrtID = null;
    this.mac = null;
    this.mName = null;
    this.IP = null;
    this.RIP = null;
    this.mType = null;
    this.mEnable = null;
    this.mRegidate = null;
}

schemaModel.prototype = {
    column : {
        mID 			    : "mID",
        cID 			    : "cID",
        rrtID               : "rrtID",
        mac 		        : "mac",
        mName 		    	: "mName",
        IP 			    	: "IP",
        RIP 				: "RIP",
        mType 			    : "mType",
        mEnable 			: "mEnable",
        mRegidate 			: "mRegidate"
    },

    setParam : function (params) {
        this.mID = (params.mID == undefined)? null : params.mID;
        this.cID = (params.cID == undefined)? null : params.cID;
        this.rrtID = (params.rrtID == undefined)? null : params.rrtID;
        this.mac = (params.mac == undefined)? null : params.mac;
        this.mName = (params.mName == undefined)? null : params.mName;
        this.IP = (params.IP == undefined)? null : params.IP;
        this.RIP = (params.RIP == undefined)? null : params.RIP;
        this.mType = (params.mType == undefined)? null : params.mType;
        this.mEnable = (params.mEnable == undefined)? null : params.mEnable;
        this.mRegidate = (params.mRegidate == undefined)? null : params.mRegidate;
    }
}

module.exports = schemaModel;
