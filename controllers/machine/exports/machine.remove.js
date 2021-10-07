/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_delete = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_delete.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    deleteData : function(req, res, next) {
        var schema = this.setData(req.body);
        var id = req.body.id;

        if(id == undefined || id == null){
            var HTTP_CODE = 405;

            var HttpCode = require(this.rootPath + '/const/httpCode');

            res.json(HttpCode.getResponseBody(HTTP_CODE, null));
            console.log(JSON.stringify(HttpCode.getResponseBody(HTTP_CODE, null)));

            return ;
        }

        var mIDArray = id.split(",");

        this.model.deleteData(schema, mIDArray, function(err, rows){
            if (err == null) {	res.json(rows); console.log(rows) }
            else {	res.render('error', {		data : err		});		}
        })
    }

};

module.exports = exports_delete;