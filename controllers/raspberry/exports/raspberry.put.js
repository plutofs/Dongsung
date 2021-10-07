/**
 * Created by KaSha on 2017. 5. 11..
 */
var exports_put = function(model){
    this.rootPath = require('path').resolve('');
    this.httpCode = require(this.rootPath + '/const/httpCode');

    this.model = model;
};

exports_put.prototype = {
    updateNetworkInfo : function(socket, mac, RIP, IP, fuc){
        mac = mac || null;  RIP = RIP || null;  IP = IP || null;

        /**
         * 디비 접근해서 응답하기 전에 여기서 응답 한번해줘야함.
         * 디비 접근후 응답하면, 응답이 늦어서 커넥션 안된줄 알고 클라이언트에서 재커넥션 요청하고 그로인해 계속 루핑 돔....
         * */
        socket.emit("connection");

        if(mac == null || RIP == null || IP == null){
            return this.httpCode.getResponseBody(405, null);
        }
        this.model.updateNetworkInfo(mac, RIP, IP, function (err, rows) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');

            if (err == null) {
                if(rows != null){
                    fuc(rows[0].mac);
                    console.log(JSON.stringify(rows));
                    var Controller = require(require('path').resolve('') + '/controllers/raspberry/ctl_raspberry');
                    var controller = new Controller();

                    console.log('client registed : ' + rows[0].mac + ' ' + socket.request.connection.remoteAddress + ' ' + IP);
                    controller.get.getViewData(socket, rows[0].mac);
                    controller.get.getUserAccount(socket, rows[0].mac);
                }else{
                    socket.emit("notAllowMachine", HttpCode.getResponseBody(200, []));
                }
            }
            else {	socket.emit('connection', HttpCode.getResponseBody(500, err));		}
        });
    }
};

module.exports = exports_put;
