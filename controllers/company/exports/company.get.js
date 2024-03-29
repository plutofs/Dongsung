/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');
    this.model = model;
};

exports_get.prototype = {
    setData : function(param){
        var Schema = require(this.rootPath + '/schema/companySchema');
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

        this.model.getList(schema, paginationSchema, function(err, rows){
            if (err == null) {
                var result = {"rows":rows[0], "page": rows[1][0].page, "total": rows[1][0].total, "records": rows[1][0].records};

                res.json(result);
                console.log(JSON.stringify(result));
            }
            else {	res.render('error', {		data : err		});		}
        })
    },

    getNameList : function (req, res, next) {
        var schema = this.setData(req.body);

        this.model.getNameList(schema, function(err, rows){
            if (err == null) {	res.json(rows); console.log(JSON.stringify(rows)); }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));	}
        })
    },

    getExcel : function (req, res, next) {
        var schema = this.setData(req.query);
        var paginationSchema = this.setPaginationData(req.query);

        this.model.getList(schema, paginationSchema, function(err, rows){
            if (err == null) {
                var ExportExcel = require(require('path').resolve('') + "/utils/exportExcel");
                var exportExcel = new ExportExcel();

                if(rows.length<=0){
                    return ;
                }

                var fileName = "지점관리_" + new Date().toISOString().replace(/[\-\:\.]/g, "").slice(0,8);

                exportExcel.exportExcel(req, res, next, fileName, rows[0]);
            }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));	}
        });
    },
    
    getCompany : function (req, res, next) {
        var schema = this.setData(req.query);
        var mID = req.query.mID;

        this.model.getCompany(schema, mID, function (err, rows) {
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  204;

                if(rows.length>0){ HTTP_CODE = 200; }

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows)); console.log(JSON.stringify(rows)); }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));   }
        });
    },

    getWaitingViewData : function (req, res, next) {
        var schema = this.setData(req.query);

        if(req.session.uLevel=="관리자" && !(req.query.requestCID == undefined || req.query.requestCID == null)){
            schema.cID = req.query.requestCID;
        }else{
            schema.cID = req.session.cID;
        }

        this.model.getWaitingViewData(schema, function (err, rows) {
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows)); console.log(JSON.stringify(rows)); }
            else {	res.render('error', {		data : err		});	console.log(JSON.stringify(err));   }
        });
    }
};

module.exports = exports_get;