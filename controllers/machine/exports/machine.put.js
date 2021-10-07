/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_put = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_put.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    editData : function(req, res, next) {
        var schema = this.setData(req.body);

        if(schema.mID == null || schema.mac == null || schema.mac.length<1 ||
            schema.mName == null || schema.mName.length<1){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        this.model.editData(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {
                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));

                if(schema.mEnable != null && schema.mEnable == 0 &&
                    schema.mac != null && req.app.locals.clients[schema.mac] != undefined){
                    req.app.locals.clients[schema.mac].emit("ban");
                }
            }
            else {	res.render('error', {		data : err		});		}
        })
    }

};

module.exports = exports_put;