/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_put = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_put.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/userSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    editData : function(req, res, next) {
        var schema = this.setData(req.body);

        if(schema.uID == null || schema.uID.length<3){
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
    }

};

module.exports = exports_put;