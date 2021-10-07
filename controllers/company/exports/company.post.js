/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    setData : function(req){

        var Schema = require(this.rootPath + '/schema/companySchema');

        var body = req.body;

        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    insertData : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.cName == null || schema.cName.length < 1){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.insertData(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    },

    uploadImage : function (req, res, next) {
        var cID = req.body.cID;
        var files = req.files;

        if(cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.insertWaitingViewImage(cID, files, function (err, rows) {
            if(err == null){ console.log("waitingViewImage uploaded");  }
            else { console.log("waitingViewImage upload error!"); }
        })
    },

    uploadVideo : function (req, res, next) {
        var cID = req.body.cID;
        var file = req.files[0];

        if(cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        const filename = file.filename;

        this.model.insertWaitingViewVideo(cID, file, function (err, rows) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, {"rows" : rows, "filename" : filename}));	}
            else {	res.render('error', {		data : err		});		}
        })
    }
};

module.exports = exports_post;