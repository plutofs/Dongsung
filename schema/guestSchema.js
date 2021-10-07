3/**
 * Created by KaSha on 2017. 4. 25..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'guest';
    schemaModel.prototype.PK = 'gID';

    this.gID = null;
    this.rID = null;
    this.gName = null;
    this.gSex = null;
    this.gAge = null;
    this.gReligion = null;
    this.gReligionPosition = null;
    this.gSangJu = null;
    this.gSangJuTotal = null;
    this.ipgwan = null;
    this.barin = null;
    this.jangji = null;
    this.diagnosis = null;
    this.first = null;
    this.calculate = null;
    this.funeralService = null;
    this.baecha = null;
    this.gImage = null;
    this.gTemplate = null;
    this.gState = null;
    this.gAutoState = null;
    this.gDisplayStart = null;
    this.gDisplayEnd = null;
    this.gMemo = null;
    this.gAllFont = null;
    this.gSangJuFontSize = null;
    this.gEnableLogo = null;
    this.gArrow = null;
    this.gRegidate = null;
    this.gMusic = null;
    this.bank = null;
    this.banknum = null;
    this.bankowne = null;
    this.ddate = null;
    this.jik = null;
    this.memo = null;
}

schemaModel.prototype = {
    column : {
        gID 			        : "gID",
        rID      			    : "rID",
        gName                   : "gName",
        gSex 		            : "gSex",
        gAge 		            : "gAge",
        gReligion 		    	: "gReligion",
        gReligionPosition       : "gReligionPosition",
        gSangJu 			    : "gSangJu",
        gSangJuTotal 			: "gSangJuTotal",
        ipgwan 			        : "ipgwan",
        barin 	        		: "barin",
        jangji 	        		: "jangji",
        diagnosis 	       		: "diagnosis",
        first 	        		: "first",
        calculate 	        	: "calculate",
        funeralService 	        : "funeralService",
        baecha 	        		: "baecha",
        gImage                  : "gImage",
        gTemplate                : "gTemplate",
        gState 		        	: "gState",
        gAutoState 			    : "gAutoState",
        gDisplayStart 			: "gDisplayStart",
        gDisplayEnd 			: "gDisplayEnd",
        gMemo 		        	: "gMemo",
        gAllFont 			    : "gAllFont",
        gSangJuFontSize 		: "gSangJuFontSize",
        gEnableLogo             : "gEnableLogo",
        gArrow                  : "gArrow",
        gRegidate 			    : "gRegidate",
        bank                    : "bank",
        banknum                 : "banknum",
        bankowne                : "bankowne",
        ddate                   : "ddate",
        jik                     : "jik",
        memo                    : "memo"
        
    },

    setParam : function (params) {
        this.gID = (params.gID == undefined)? null : params.gID;
        this.rID = (params.rID == undefined)? null : params.rID;
        this.gName = (params.gName == undefined)? null : params.gName;
        this.gSex = (params.gSex == undefined)? null : params.gSex;
        this.gAge = (params.gAge == undefined)? null : params.gAge;
        this.gReligion = (params.gReligion == undefined)? null : params.gReligion;
        this.gReligionPosition = (params.gReligionPosition == undefined) ? null : params.gReligionPosition;
        this.gSangJu = (params.gSangJu == undefined)? null : params.gSangJu;
        this.gSangJuTotal = (params.gSangJuTotal == undefined)? null : params.gSangJuTotal;
        this.ipgwan = (params.ipgwan == undefined)? null : params.ipgwan;
        this.barin = (params.barin == undefined)? null : params.barin;
        this.jangji = (params.jangji == undefined)? null : params.jangji;
        this.diagnosis = (params.diagnosis == undefined)? null : params.diagnosis;
        this.first = (params.first == undefined)? null : params.first;
        this.calculate = (params.calculate == undefined)? null : params.calculate;
        this.funeralService = (params.funeralService == undefined)? null : params.funeralService;
        this.baecha = (params.baecha == undefined)? null : params.baecha;
        this.gImage = (params.gImage == undefined)? null : params.gImage;
        this.gTemplate = (params.gTemplate == undefined)? null : params.gTemplate;
        this.gState = (params.gState == undefined)? null : params.gState;
        this.gAutoState = (params.gAutoState == undefined)? null : params.gAutoState;
        this.gDisplayStart = (params.gDisplayStart == undefined)? null : params.gDisplayStart;
        this.gDisplayEnd = (params.gDisplayEnd == undefined)? null : params.gDisplayEnd;
        this.gMemo = (params.gMemo == undefined)? null : params.gMemo;
        this.gAllFont = (params.gAllFont == undefined)? null : params.gAllFont;
        this.gSangJuFontSize = (params.gSangJuFontSize == undefined)? null : params.gSangJuFontSize;
        this.gEnableLogo = (params.gEnableLogo == undefined)? null : params.gEnableLogo;
        this.gArrow = (params.gArrow == undefined)? null : params.gArrow;
        this.gRegidate = (params.gRegidate == undefined)? null : params.gRegidate;
        this.bank = (params.bank == undefined)? null : params.bank;
        this.banknum = (params.banknum == undefined)? null : params.banknum;
        this.bankowne = (params.bankowne == undefined)? null : params.bankowne;
        this.ddate = (params.ddate == undefined)? null : params.ddate;
        this.jik = (params.jik == undefined)? null : params.jik;
        this.memo = (params.memo == undefined)? null : params.memo;
    }
}

module.exports = schemaModel;
