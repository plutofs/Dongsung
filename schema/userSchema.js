/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'user';
    schemaModel.prototype.PK = 'uID';

    this.uID = null;
    this.cID = null;
    this.uPwd = null;
    this.uName = null;
    this.uLevel = null;
    this.uMemo = null;
    this.uEnable = null;
    this.uRegidate = null;
}

schemaModel.prototype = {
    column : {
        uID 			    : "uID",
        cID 			    : "cID",
        uPwd                : "uPwd",
        uName 		        : "uName",
        uLevel 		        : "uLevel",
        uMemo 		    	: "uMemo",
        uEnable             : "uEnable",
        uRegidate 			: "uRegidate"
    },

    setParam : function (params) {
        this.uID = (params.uID == undefined)? null : params.uID;
        this.cID = (params.cID == undefined)? null : params.cID;
        this.uPwd = (params.uPwd == undefined)? null : params.uPwd;
        this.uName = (params.uName == undefined)? null : params.uName;
        this.uLevel = (params.uLevel == undefined)? null : params.uLevel;
        this.uMemo = (params.uMemo == undefined)? null : params.uMemo;
        this.uEnable = (params.uEnable == undefined) ? null : params.uEnable;
        this.uRegidate = (params.uRegidate == undefined)? null : params.uRegidate;

        //최소한의 보안때문에...ㅎㅎ;
        this.uID = (params.loginID == undefined || params.loginID == null) ? this.uID : params.loginID;
        this.uPwd = (params.password == undefined || params.password == null) ? this.uPwd : params.password;
    }
}

module.exports = schemaModel;
