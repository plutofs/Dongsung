/**
 * Created by KaSha on 2017. 5. 11..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    registMac : function (req, res, next) {
        var ID = req.body.ID || null;
        var pwd = req.body.pwd || null;
        var mac = req.body.mac || "NONE";
        var wirelessMac = req.body.wirelessMac || "NONE";
        var mName = req.body.mName || null;
        var cID = req.body.cID || null;

        if(ID == null || pwd == null || mName == null || cID == null ||
            (mac == null && wirelessMac == null)){
            res.send("Not allow request");
            return;
        }

        this.model.registMac(ID, pwd, mac, wirelessMac, mName, cID, function (err, rows, type) {
            if (err == null) {
                switch (type) {
                    case 0:
                        res.send("Success");
                        console.log("Success : " + JSON.stringify(rows));
                        return;
                    case 1:
                        res.send("Login Fail");
                        console.log("Login Fail : " + JSON.stringify(rows));
                        return;
                    case 2:
                        res.send("Already Exists Mac");
                        console.log("Already Exists Mac : " + JSON.stringify(rows));
                        return;
                    default:
                        res.send("Fail");
                        return;
                }
            } else {	res.send("Fail"); console.log("mac regist error");	}
        });
    }
};

module.exports = exports_post;