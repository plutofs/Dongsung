/**
 * Created by LJH on 2021. 9. 30..
 */
var schemaModel = function() {
    schemaModel.prototype.TABLE_NAME = 'BugoApiView';
    schemaModel.prototype.PK = 'Idx';
    
    this.idx=null;
    this.fidx=null;
    this.gname=null;
    this.jik=null;
    this.religion=null;
    this.age=null;
    this.sex=null;
    this.ddate=null;
    this.dtime=null;
    this.bdate=null;
    this.btime=null;
    this.idate=null;
    this.itime=null;
    this.fplace=null;
    this.fplace_detail=null;
    this.jangji=null;
    this.memo=null;
    this.sangju=null;
    this.relation=null;
    this.sname=null;
    this.stel=null;
    this.bankinfo=null;
    this.bank=null;
    this.banknum=null;
    this.bankowner=null;

}

schemaModel.prototype = {
    column : {
        idx	            :"idx",
        fidx	        :"fidx",
        gname	        :"gname",
        jik	            :"jik",
        religion        :"religion",
        age	            :"age",
        sex	            :"sex",
        ddate	        :"ddate",
        dtime	        :"dtime",
        bdate	        :"bdate",
        btime	        :"btime",
        idate	        :"idate",
        itime	        :"itime",
        fplace	        :"fplace",
        fplace_detail	:"fplace_detail",
        jangji	        :"jangji",
        memo	        :"memo",
        sangju	        :"sangju",
        relation	    :"relation",
        sname	        :"sname",
        stel	        :"stel",
        bankinfo	    :"bankinfo",
        bank	        :"bank",
        banknum	        :"banknum",
        bankowner	    :"bankowner"
    },

    setParam : function (params) {
        this.idx = (params.idx == undefined) ? null : params.idx;
        this.fidx = (params.fidx == undefined) ? null : params.fidx;
        this.gname = (params.gname == undefined) ? null : params.gname;
        this.jik = (params.jik == undefined) ? null : params.jik;
        this.religion = (params.religion == undefined) ? null : params.religion;
        this.age = (params.age == undefined) ? null : params.age;
        this.sex = (params.sex == undefined) ? null : params.sex;
        this.ddate = (params.ddate == undefined) ? null : params.ddate;
        this.dtime = (params.dtime == undefined) ? null : params.dtime;
        this.bdate = (params.bdate == undefined) ? null : params.bdate;
        this.btime = (params.btime == undefined) ? null : params.btime;
        this.idate = (params.idate == undefined) ? null : params.idate;
        this.itime = (params.itime == undefined) ? null : params.itime;
        this.fplace = (params.fplace == undefined) ? null : params.fplace;
        this.fplace_detail = (params.fplace_detail == undefined) ? null : params.fplace_detail;
        this.jangji = (params.jangji == undefined) ? null : params.jangji;
        this.memo = (params.memo == undefined) ? null : params.memo;
        this.sangju = (params.sangju == undefined) ? null : params.sangju;
        this.relation = (params.relation == undefined) ? null : params.relation;
        this.sname = (params.sname == undefined) ? null : params.sname;
        this.stel = (params.stel == undefined) ? null : params.stel;
        this.bankinfo = (params.bankinfo == undefined) ? null : params.bankinfo;
        this.bank = (params.bank == undefined) ? null : params.bank;
        this.banknum = (params.banknum == undefined) ? null : params.banknum;
        this.bankowner = (params.bankowner == undefined) ? null : params.bankowner;
    }
}

module.exports = schemaModel;