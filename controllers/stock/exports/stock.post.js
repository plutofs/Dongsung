/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/stockSchema');

        var body = req.body;

        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    insertData : function(req, res, next) {
        var schema = this.setData(req);

        if(schema.cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.insertData(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_post;