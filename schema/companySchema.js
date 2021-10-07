/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'company';
    schemaModel.prototype.PK = 'cID';

    this.cID = null;
    this.cName = null;
    this.businessNum = null;
    this.master = null;
    this.cAddress = null;
    this.cTel = null;
    this.cFax = null;
    this.cMemo = null;
    this.cImage = null;
    this.cIdx = null;
    this.waitingViewEnable = null;
    this.cEnable = null;
    this.cRegidate = null;
}

schemaModel.prototype = {
    column : {
        cID 			    : "cID",
        cName 			    : "cName",
        businessNum         : "businessNum",
        master 		        : "master",
        cAddress 			: "cAddress",
        cTel 				: "cTel",
        cFax 				: "cFax",
        cMemo 			    : "cMemo",
        cImage              : "cImage",
        cIdx                : "cIdx",
        waitingViewEnable   : "waitingViewEnable",
        cEnable 			: "cEnable",
        cRegidate 			: "cRegidate",
    },

    setParam : function (params) {
        this.cID = (params.cID == undefined)? null : params.cID;
        this.cName = (params.cName == undefined)? null : params.cName;
        this.businessNum = (params.businessNum == undefined)? null : params.businessNum;
        this.master = (params.master == undefined)? null : params.master;
        this.cAddress = (params.cAddress == undefined)? null : params.cAddress;
        this.cTel = (params.cTel == undefined)? null : params.cTel;
        this.cFax = (params.cFax == undefined)? null : params.cFax;
        this.cMemo = (params.cMemo == undefined)? null : params.cMemo;
        this.cImage = (params.cImage == undefined)? null : params.cImage;
        this.cIdx = (params.cIdx == undefined)? null : params.cIdx;
        this.waitingViewEnable = (params.waitingViewEnable == undefined)? null : params.waitingViewEnable;
        this.cEnable = (params.cEnable == undefined)? null : params.cEnable;
        this.cRegidate = (params.cRegidate == undefined)? null : params.cRegidate;
    }
}

module.exports = schemaModel;