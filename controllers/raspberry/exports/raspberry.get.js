/**
 * Created by KaSha on 2017. 5. 11..
 */
var exports_get = function(model){
    this.rootPath = require('path').resolve('');
    this.httpCode = require(this.rootPath + '/const/httpCode');

    this.model = model;
};

exports_get.prototype = {
    getViewData : function(socket, mac){
        mac = mac || null;

        if(mac == null || socket == undefined){
            return this.httpCode.getResponseBody(405, null);
        }
        this.model.getViewData(mac, function (err, rows) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');

            if (err == null) {
                switch(rows.mType){
                    case 0:
                        if(rows.data[0].gName.length>0){
                            socket.emit("viewRoomData", HttpCode.getResponseBody(200, rows));
                            console.log("emit viewRoomData");
                        }else{
                            socket.emit("noData", HttpCode.getResponseBody(200, rows));
                            console.log("No Data at Type 0");
                        }
                        break;
                    case 1:
                        socket.emit("viewTotalData", HttpCode.getResponseBody(200, rows));
                        console.log("emit viewTotalData");
                        break;
                    case 2:
                        socket.emit("ipgwanSchedulerData", HttpCode.getResponseBody(200, rows));
                        console.log("emit ipgwanSchedulerData");
                        break;
                    default:
                        socket.emit("noData", HttpCode.getResponseBody(200, rows));
                        console.log("emit noData");
                        break;
                }
                console.log(JSON.stringify(rows));
            }
            else {	socket.emit('error', HttpCode.getResponseBody(500, err));   console.log("emit error");		}
        });
    },

    getUserAccount : function(socket, mac){
        mac = mac || null;

        if(mac == null || socket == undefined){
            return this.httpCode.getResponseBody(405, null);
        }

        this.model.getUserAccount(mac, function (err, rows) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');

            if (err == null) {
                if(rows.length > 0){
                    socket.emit('accountData', HttpCode.getResponseBody(200, rows));
                }else{
                    console.log('No User Account');
                }
                console.log(JSON.stringify(rows));
            }
            else {	socket.emit('error', HttpCode.getResponseBody(500, err));		}
        });
    },

    checkLogo : function (socket, logoPath, mac, logo) {
        mac = mac || null;

        if(mac == null || socket == undefined){
            return this.httpCode.getResponseBody(405, null);
        }

        this.model.checkLogo(mac, logo, function (err, rows) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');

            if (err == null) {
                if(rows.length > 0){
                    if(rows[0].cImage == logo){
                        console.log("same logo");
                        socket.emit("logoCheck", "same Logo");
                    }else if(rows[0].cImage!=undefined && rows[0].cImage!=null && rows[0].cImage.length > 0){
                        socket.emit("logoDownload", rows[0].cImage);
                    }else{
                        console.log("no regist logo");
                        socket.emit("logoCheck");
                    }
                }else{
                    console.log('Not exist mac address (checkLogo)');
                    socket.emit("logoCheck", "no logo");
                }
                console.log(JSON.stringify(rows));
            }
            else {	socket.emit('error', HttpCode.getResponseBody(500, err));		}
        });
    },

    checkWaitingView : function (socket, waitingViewPath, mac, waitingViewEnable, waitingViewList) {
        mac = mac || null;

        if(mac == null || socket == undefined){
            return this.httpCode.getResponseBody(405, null);
        }

        this.model.checkWaitingView(mac, function (err, rows, type) {
            var HttpCode = require(require('path').resolve('') + '/const/httpCode');
            var fs = require('fs');
            var logFile = fs.createWriteStream('consoleLog.txt', { flags: 'a' });

            if (err == null) {
                switch (type){
                    case 0:
                        if(waitingViewEnable == 1 || waitingViewEnable == 2){
                            socket.emit("waitingViewDownload", type);
                        }else{
                            socket.emit("waitingViewCheck", "exist");
                        }
                        break;

                    case 1:
                        var notSame = false; //같은 1타입일때 서로 데이터가 같은지

                        if(waitingViewEnable==1){   //1타입이면
                            rows.forEach(function (element, index) {    //데이터 아이디가 다른게 있으면 false
                                if(!waitingViewList.includes(element.fileName)){
                                    notSame = true;
                                }
                            });
                        }

                        if(waitingViewEnable==0 || waitingViewEnable==2 || notSame){
                            var fileList = [];
                            rows.forEach(function(element, index){
                                fileList.push(element.fileName);
                            });
                            socket.emit("waitingViewDownload", type, fileList);
                        }else{
                            socket.emit("waitingViewCheck", "exist");
                        }
                        break;

                    case 2:
                        var notSame = true; //같은 2타입일때 서로 데이터가 같은지

                        if(waitingViewEnable==2 && waitingViewList.length>0){   //2타입이면
                            if(waitingViewList[0] == rows[0].fileName){
                                notSame = false;
                            }
                        }

                        if(waitingViewEnable==0 || waitingViewEnable==1 || notSame){
                            socket.emit("waitingViewDownload", type, rows[0].fileName);
                        }else{
                            socket.emit("waitingViewCheck", "exist");
                        }
                        break;
                }
            }
            else {	socket.emit('error', HttpCode.getResponseBody(500, err));		}
        });
    },

    socketList : function (req, res, next) {
        var macs = Object.keys(req.app.locals.clients);
        res.json(macs);
    },

    socketListInspect : function (req, res, next) {
        var util = require('util');
        res.json(util.inspect(req.app.locals.clients));
    }
};

module.exports = exports_get;