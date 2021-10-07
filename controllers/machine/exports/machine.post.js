/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    setData : function(param){

        var Schema = require(this.rootPath + '/schema/machineSchema');

        var schema = new Schema();
        schema.setParam(param);

        return schema;
    },

    insertData : function(req, res, next) {
        var schema = this.setData(req.body);

        if(schema.cID == null || schema.mac == null || schema.mac.length<1 ||
            schema.mName == null || schema.mName.length<1){
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
    },
    
    rebootMachine : function (req, res, next) {
        var mac = req.body['mac[]'] || req.body['mac'] || null;

        var HTTP_CODE = 405;
        var HttpCode = require(this.rootPath + '/const/httpCode');

        if(mac==null){
            res.json(HttpCode.getResponseBody(HTTP_CODE, null));

            return ;
        }

        if(Array.isArray(mac)) {
            mac.forEach(function (element, index) {
                var socket = req.app.locals.clients[element];
                if (socket != undefined) {
                    socket.emit("reboot");
                    console.log("reboot machine : " + element);
                }
            });
        }else{
            var socket = req.app.locals.clients[mac];
            if (socket != undefined) {
                socket.emit("reboot");
                console.log("reboot machine : " + mac);
            }
        }

        HTTP_CODE = 200;
        res.json(HttpCode.getResponseBody(HTTP_CODE, null));
    }
};

module.exports = exports_post;