var crypto = require('crypto');
var exports = function(){

};

exports.prototype = {
    encrypt : function (plaintext, key, iv) {    // aes-256-cbc
        var iv = iv || key.substring(0, 16);

        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        cipher.setAutoPadding(true);

        var encryptedPassword = cipher.update(plaintext, 'utf8', 'base64');
        encryptedPassword += cipher.final('base64');

        return encryptedPassword;
    },

    decrypt : function (plaintext, key, iv) {    // aes-256-cbc
        var iv = iv || key.substring(0, 16);

        var decipher = crypto.createDecipheriv('aes-256-cbc', key,iv);
        decipher.setAutoPadding(true);

        var encryptedPassword = decipher.update(plaintext, 'base64', 'utf8');
        encryptedPassword += decipher.final('base64');

        return encryptedPassword;
    },

    setRowsApi : function(rows4){
        var totalsangju = [];
        var totalbank = [];
        var totalfuneral = [];
        var count=0;
        for(var cus of rows4){
            var sangju = {};
            sangju["relation"]=cus.relation.toString();
            sangju["sname"]=cus.sname.toString();;
            sangju["stel"]=cus.stel.toString();
            cus.sangju = sangju;
            totalsangju.push(sangju);

            var bankinfo = {};
            bankinfo["bank"] = cus.bank.toString();
            bankinfo["banknum"] = cus.banknum.toString();
            bankinfo["bankowner"] = cus.bankowner.toString();
            cus.bankinfo = bankinfo;
            totalbank.push(bankinfo);

            
            var funeral = {};
            funeral["sangho"] = cus.sangho.toString();
            funeral["addr"] = cus.addr.toString();
            funeral["tel"] = cus.tel.toString();
            cus.funeral = funeral;
            totalfuneral.push(funeral);

            count++;
        }
        rows4[0]["sangju"]=totalsangju;
        rows4[0]["bankinfo"]=totalbank;
        rows4[0]["funeral"]=totalfuneral;

        delete rows4[0].relation;
        delete rows4[0].sname;
        delete rows4[0].stel;

        delete rows4[0].bank;
        delete rows4[0].banknum;
        delete rows4[0].bankowner;

        delete rows4[0].sangho;             
        delete rows4[0].aaddr;             
        delete rows4[0].tel;          

        return rows4;
    }
};

module.exports = exports;