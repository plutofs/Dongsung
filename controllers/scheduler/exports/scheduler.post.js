/**
 * Created by KaSha on 2017. 4. 10..
 */
var exports_post = function(model){
    this.rootPath = require('path').resolve('');

    this.model = model;
};

exports_post.prototype = {
    setData : function(req){
        var Schema = require(this.rootPath + '/schema/roomSchema');
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

    getIpgwanSchedulerSchema : function (param) {
        var Schema = require(this.rootPath + '/schema/ipgwanSchedulerSchema');
        var schema = new Schema();

        schema.setParam(param);

        return schema;
    },

    insertIpgwanScheduler : function(req, res, next) {
        var schema = this.getIpgwanSchedulerSchema(req.body);

        var target = req.body["targetArray[]"];

        var targetArray = target==undefined ? [] : (target instanceof Array ? target : [target]);
        console.log(targetArray);

        this.model.insertIpgwanScheduler(schema, targetArray, function(err, rows){
            if (err == null) {
                var HttpCode = require(require('path').resolve('') + '/const/httpCode');
                var HTTP_CODE =  200;

                res.json(HttpCode.getResponseBody(HTTP_CODE, rows));

                //socket 통해서 raspberry 전달
                var Controller = require(require('path').resolve('') + '/controllers/raspberry/ctl_raspberry');
                var controller = new Controller();

                var mac = rows[0][0].mac;
                controller.get.getViewData(req.app.locals.clients[mac], mac);
            }
            else {	res.render('error', {		data : err		});		}
        })
    },
};

module.exports = exports_post;