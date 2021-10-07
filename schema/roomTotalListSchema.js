/**
 * Created by KaSha on 2017. 5. 11..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'roomTotalList';
    schemaModel.prototype.PK = 'rtlID';

    this.rtlID = null;
    this.rtID = null;
    this.rID = null;
}

schemaModel.prototype = {
    column : {
        rtlID 			    : "rtlID",
        rtID                : "rtID",
        rID 		    	: "rID"
    },

    setParam : function (params) {
        this.rtlID = (params.rtlID == undefined)? null : params.rtlID;
        this.rtID = (params.rtID == undefined)? null : params.rtID;
        this.rID = (params.rID == undefined)? null : params.rID;
    }
}

module.exports = schemaModel;
