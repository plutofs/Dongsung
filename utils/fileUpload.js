/**
 * Created by KaSha on 2017. 4. 28..
 */
var exports = function(){

};

exports.prototype = {
    upload : function (req, res, next, uploadPath, inputName, gID) {    //path는 /붙여서 보내기.
        var Q = require('q');
        var multer = require('multer');

        var deferred = Q.defer();
        const fs = require('fs');
        var storage = multer.diskStorage({
            // 서버에 저장할 폴더
            destination: function (req, file, cb) {
                var path = require('path');
                if(!fs.existsSync(req.app.locals.uploadPath+uploadPath)){
                    fs.mkdirSync(req.app.locals.uploadPath+uploadPath);
                }
                cb(null, path.join(req.app.locals.uploadPath + uploadPath));
            },

            // 서버에 저장할 파일 명
            filename: function (req, file, cb) {
                if (gID !== undefined && gID !== null){
                    cb(null, gID + ".mp3");
                } else {
                    var uuid = require('node-uuid');
                    cb(null, new Date().getTime() + "-" + uuid.v1() + '.' + file.mimetype.split('/')[1]);
                }
            }
        });

        var upload ;
        // if(inputName === "dropzoneFile"){
            upload = multer({ storage: storage, limits:{fileSize:1024*1024*50} }).any();
        // }else {
        //     upload = multer({storage: storage, limits:{fileSize:1024*1024*50}}).single(inputName);
        // }
        upload(req, res, function (err) {
            if (err) {
                console.log("Error : " + err);
                deferred.reject();
            }
            else {
                if(inputName === "dropzoneFile"){
                    console.log("file : " + req.files);    //req.file에 데이터 파일 데이터 들어가있음.
                }else {
                    console.log("file : " + req.files);    //req.file에 데이터 파일 데이터 들어가있음.
                }
                deferred.resolve({req : req, res : res, next : next});
            }
        });

        return deferred.promise;
    }
};

module.exports = exports;