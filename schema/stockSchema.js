/**
 * Created by KaSha on 2017. 5. 19..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'stock';
    schemaModel.prototype.PK = 'sID';

    this.sID = null;
    this.cID = null;
    this.date = null;
    this.delivery = null;
    this.pc = null;
    this.monitor23 = null;
    this.monitor27 = null;
    this.monitor32 = null;
    this.supportFixture = null;
    this.multitab = null;
    this.concent2 = null;
    this.concent3 = null;
    this.electricWire = null;
    this.utp = null;
    this.molding = null;
    this.router4 = null;
    this.router8 = null;
    this.hub5 = null;
    this.hub8 = null;
    this.hub16 = null;
    this.strawberry = null;
    this.sdCard = null;
    this.charger = null;
    this.hdmi = null;
    this.dvi = null;
    this.monitorAdapter = null;
    this.repeaterAdapter = null;
    this.repeater = null;
    this.distributor = null;
    this.etc = null;
    this.sRegidate = null;
}

schemaModel.prototype = {
    column : {
        sID 			    : "sID",
        cID 			    : "cID",
        date               : "date",
        delivery 		        : "delivery",
        pc 		    	: "pc",
        monitor23 			    	: "monitor23",
        monitor27 				: "monitor27",
        monitor32 			    : "monitor32",
        supportFixture 			: "supportFixture",
        multitab 			: "multitab",
        concent2 			: "concent2",
        concent3 			: "concent3",
        electricWire 			: "electricWire",
        utp 			: "utp",
        molding 			: "molding",
        router4 			: "router4",
        router8 			: "router8",
        hub5 			: "hub5",
        hub8 			: "hub8",
        hub16 			: "hub16",
        strawberry 			: "strawberry",
        sdCard 			: "sdCard",
        charger 			: "charger",
        hdmi 			: "hdmi",
        dvi 			: "dvi",
        monitorAdapter 			: "monitorAdapter",
        repeaterAdapter 			: "repeaterAdapter",
        repeater 			: "repeater",
        distributor 			: "distributor",
        etc 			: "etc",
        sRegidate 			: "sRegidate"
    },

    setParam : function (params) {
        this.sID = (params.sID == undefined)? null : params.sID;
        this.cID = (params.cID == undefined)? null : params.cID;
        this.date = (params.date == undefined)? null : params.date;
        this.delivery = (params.delivery == undefined)? null : params.delivery;
        this.pc = (params.pc == undefined)? null : params.pc;
        this.monitor23 = (params.monitor23 == undefined)? null : params.monitor23;
        this.monitor27 = (params.monitor27 == undefined)? null : params.monitor27;
        this.monitor32 = (params.monitor32 == undefined)? null : params.monitor32;
        this.supportFixture = (params.supportFixture == undefined)? null : params.supportFixture;
        this.multitab = (params.multitab == undefined)? null : params.multitab;
        this.concent2 = (params.concent2 == undefined)? null : params.concent2;
        this.concent3 = (params.concent3 == undefined)? null : params.concent3;
        this.electricWire = (params.electricWire == undefined)? null : params.electricWire;
        this.utp = (params.utp == undefined)? null : params.utp;
        this.molding = (params.molding == undefined)? null : params.molding;
        this.router4 = (params.router4 == undefined)? null : params.router4;
        this.router8 = (params.router8 == undefined)? null : params.router8;
        this.hub5 = (params.hub5 == undefined)? null : params.hub5;
        this.hub8 = (params.hub8 == undefined)? null : params.hub8;
        this.hub16 = (params.hub16 == undefined)? null : params.hub16;
        this.strawberry = (params.strawberry == undefined)? null : params.strawberry;
        this.sdCard = (params.sdCard == undefined)? null : params.sdCard;
        this.charger = (params.charger == undefined)? null : params.charger;
        this.hdmi = (params.hdmi == undefined)? null : params.hdmi;
        this.dvi = (params.dvi == undefined)? null : params.dvi;
        this.monitorAdapter = (params.monitorAdapter == undefined)? null : params.monitorAdapter;
        this.repeaterAdapter = (params.repeaterAdapter == undefined)? null : params.repeaterAdapter;
        this.repeater = (params.repeater == undefined)? null : params.repeater;
        this.distributor = (params.distributor == undefined)? null : params.distributor;
        this.etc = (params.etc == undefined)? null : params.etc;
        this.sRegidate = (params.sRegidate == undefined)? null : params.sRegidate;
    }
}

module.exports = schemaModel;
