/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_put = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_put.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/roomSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setCategoryData : function(req){
        var Schema = require(this.rootPath + '/schema/roomCategorySchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setGuestData : function(req){
        var Schema = require(this.rootPath + '/schema/guestSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    change_rName : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.rID == null || schema.rName == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.change_rName(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_put;