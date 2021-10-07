/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');
    this.model = model;
};

exports_get.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/sangjuSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    getList : function(req, res, next) {
        var schema = this.setData(req.body);
        var paginationSchema = this.setPaginationData(req.body);

        this.model.getList(schema, paginationSchema, function(err, rows){
            if (err == null) {
                var result = {"rows":rows[0], "page": rows[1][0].page, "total": rows[1][0].total, "records": rows[1][0].records};

                res.json(result);
                console.log(JSON.stringify(result));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getSangju : function (req, res, next) {
        var schema = this.setData(req.query);
        var rID = req.query.rID;

        this.model.getSangju(schema, rID, function (err, rows) {
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  204;

                if(rows.length>0){ HTTP_CODE = 200; }

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows)); console.log(JSON.stringify(rows)); }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));   }
        });
    },

};

module.exports = exports_get;