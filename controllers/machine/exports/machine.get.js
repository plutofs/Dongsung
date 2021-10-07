/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_get.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/machineSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    setPaginationData : function(param){
        var Schema = require(this.rootPath + '/schema/paginationSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    getList : function(req, res, next) {
        var schema = this.setData(req.body);
        var paginationSchema = this.setPaginationData(req.body);
        var cID = req.params.cID;

        if(req.session.uLevel=="관리자"){
            cID = 0;
        }

        this.model.getList(schema, paginationSchema, cID, function(err, rows){
            if (err == null) {
                rows[0].forEach(function (element, index) {
                   if(req.app.locals.clients.hasOwnProperty(element.mac)){
                       element.connection = "연결";
                   }else{
                       element.connection = "미연결";
                   }
                });
                var result = {"rows":rows[0], "page": rows[1][0].page, "total": rows[1][0].total, "records": rows[1][0].records};

                res.json(result);
                console.log(JSON.stringify(result));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getExcel : function (req, res, next) {
        var schema = this.setData(req.query);
        var paginationSchema = this.setPaginationData(req.query);
        var cID = req.params.cID;

        if(req.session.uLevel=="관리자"){
            cID = 0;
        }

        this.model.getList(schema, paginationSchema, cID, function(err, rows){
            if (err == null) {
                var ExportExcel = require(require('path').resolve('') + "/utils/exportExcel");
                var exportExcel = new ExportExcel();

                if(rows.length<=0){
                    return ;
                }

                var fileName = "라즈베리 관리_" + new Date().toISOString().replace(/[\-\:\.]/g, "").slice(0,8);
                exportExcel.exportExcel(req, res, next, fileName, rows[0]);
            }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));	}
        });
    }
};

module.exports = exports_get;