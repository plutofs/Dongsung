/**
 * Created by KaSha on 2017. 5. 11..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'roomTotal';
    schemaModel.prototype.PK = 'rtID';

    this.rtID = null;
    this.rtName = null;
    this.rtEnable = null;
    this.rtAllFont = null;
    this.rtSangJuFontSize = null;
    this.rtTemplate = null;
    this.rtAuto = null;
    this.rtEnableLogo = null;
    this.rtInfo = null;
    this.rtRegidate = null;
};

schemaModel.prototype = {
    column : {
        rtID                    : "rtID",
        rtName 	    	    	: "rtName",
        rtEnable 		    	: "rtEnable",
        rtAllFont 		    	: "rtAllFont",
        rtSangJuFontSize 		: "rtSangJuFontSize",
        rtTemplate              : "rtTemplate",
        rtAuto                  : "rtAuto",
        rtEnableLogo            : "rtEnableLogo",
        rtInfo                  : "rtInfo",
        rtRegidate 		    	: "rtRegidate"
    },

    setParam : function (params) {
        this.rtID = (params.rtID == undefined)? null : params.rtID;
        this.rtName = (params.rtName == undefined)? null : params.rtName;
        this.rtEnable = (params.rtEnable == undefined)? null : params.rtEnable;
        this.rtAllFont = (params.rtAllFont == undefined)? null : params.rtAllFont;
        this.rtSangJuFontSize = (params.rtSangJuFontSize == undefined)? null : params.rtSangJuFontSize;
        this.rtTemplate = (params.rtTemplate == undefined)? null : params.rtTemplate;
        this.rtAuto = (params.rtAuto == undefined)? null : params.rtAuto;
        this.rtEnableLogo = (params.rtEnableLogo == undefined)? null : params.rtEnableLogo;
        this.rtInfo = (params.rtInfo == undefined)? null : params.rtInfo;
        this.rtRegidate = (params.rtRegidate == undefined)? null : params.rtRegidate;
    }
};

module.exports = schemaModel;
