/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/userSchema');

        var body = req.body;

        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    doLogin : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.uID == null || schema.uPwd == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.doLogin(schema, function(err, rows){
            if (err == null ) {
                if(rows.length>0){
                    var session = req.session;
                    session.userID= rows[0].uID;
                    session.userName = rows[0].uName;
                    session.uLevel = rows[0].uLevel;
                    session.uRegidate = rows[0].uRegidate;
                    session.cID = rows[0].cID;
                    session.cName = rows[0].cName;
                    session.businessNum = rows[0].businessNum;
                    session.master = rows[0].master;
                    session.cAddress = rows[0].cAddress;
                    session.cTel = rows[0].cTel;
                    session.cFax = rows[0].cFax;
                    session.cRegidate = rows[0].cRegidate;

                    console.log(req.body.remember);
                    if(req.body.remember == "on") {
                        console.log("11");
                        res.cookie('userID', session.userID);
                        res.cookie('userName', session.userName);
                        res.cookie('uLevel', session.uLevel);
                        res.cookie('companyID', session.cID);
                        res.cookie('companyName', session.cName);
                    }

                    res.render('index', { session : req.session, req : req });
                }else{
                    res.render('login', {data : "Fail"});
                }
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    logout : function(req, res, next) {
        var session = req.session;
        if(session.userID){
            session.destroy();

            if(req.cookies.userID) {
                res.clearCookie('userID');
                res.clearCookie('userName');
                res.clearCookie('uLevel');
                res.clearCookie('companyID');
                res.clearCookie('companyName');
            }
        }
        res.redirect('/');
    },

    insertData : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.cID == null || schema.uID == null || schema.uPwd == null || schema.uName == null
            || schema.uID.length<3 || schema.uPwd.length <3){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        this.model.insertData(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else if(err.code=="ER_DUP_ENTRY"){ HTTP_CODE = 406; res.json(HttpCode.getResponseBody(HTTP_CODE, err.code));}
            else {	res.render('index', {		data : err		});		}
        });
    }
};

module.exports = exports_post;