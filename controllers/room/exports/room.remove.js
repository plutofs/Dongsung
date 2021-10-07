/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_remove = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_remove.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/roomSchema');
        var body = req.body;
        var schema = new Schema();
        schema.setParam(body);

        return schema;
    },

    setRoomTotalData : function(req){
        var Schema = require(this.rootPath + '/schema/roomTotalSchema');
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

    deleteCategory : function(req, res, next) {
        var schema = this.setCategoryData(req);

        if(schema.rcID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        this.model.deleteCategory(schema, function(err, rows){
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var HTTP_CODE =  200;

            if (err == null) {	res.json(HttpCode.getResponseBody(HTTP_CODE, rows));	console.log(JSON.stringify(rows));	}
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_remove;