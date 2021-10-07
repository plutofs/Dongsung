/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_delete = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_delete.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/companySchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    deleteData : function(req, res, next) {
        var schema = this.setData(req.body);

        schema.cID = req.body.id;

        if(schema.cID == null){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        this.model.deleteData(schema, function(err, rows){
            if (err == null) {	res.json(rows); console.log(rows) }
            else {	res.render('error', {		data : err		});		}
        });
    },

    deleteDropzoneList : function (req, res, next) {
        var deleteArray = req.body["deleteArray[]"];

        if(deleteArray.length <= 0){
            var HTTP_CODE = 405;
            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        if(!Array.isArray(deleteArray)){
            deleteArray = [deleteArray];
        }

        this.model.deleteDropzoneList(deleteArray, function(err, rows){
            if (err == null) { console.log(rows) }
            else {	res.render('error', {		data : err		});		}
        });
    }
};

module.exports = exports_delete;