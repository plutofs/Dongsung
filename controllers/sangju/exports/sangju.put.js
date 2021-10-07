/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_put = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_put.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/companySchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    editData : function(req, res, next) {
        var schema = this.setData(req.body);

        if(schema.cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        this.model.editData(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows)); }
            else {	res.render('error', {		data : err		});		}
        })
    },

    updateProfile : function(req, res, next) {
        var schema = this.setData(req.body);
        var userID = req.session.userID || "", currentPwd = req.body.currentPwd || "", newPwd = req.body.newPwd || "";

        if(schema.cID == null || schema.master == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        schema.cImage = req.file == undefined ? null : (req.file.filename == undefined ? null : req.file.filename);

        this.model.updateProfile(schema, userID, currentPwd, newPwd, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {
                if (Array.isArray(rows) && rows.length > 1 && rows[1].affectedRows === 0){
                    HTTP_CODE = 204;
                }
                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));
            }
            else {	res.render('error', {		data : err		});		}
        });
    },

    disableWaitingView : function (req, res, next) {
        var schema = this.setData(req.body);

        if(schema.cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.disableWaitingView(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    },

    changeWaitingViewType : function (req, res, next) {
        var schema = this.setData(req.body);

        if(schema.cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.changeWaitingViewType(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_put;