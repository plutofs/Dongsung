var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.locals.version = 3.02 ;
app.locals.totalPwd = "8520";

/** 실서버 */
app.locals.storagePath = "/backup/storage/";
app.locals.uploadPath = "/backup/upload/";
app.locals.privatePath = "/backup/private/";
/** 개발환경 */
//app.locals.storagePath = "/Users/KaSha/gitKaSha/workspace_dongsung/storage/";
//app.locals.uploadPath = "/Users/KaSha/gitKaSha/workspace_dongsung/upload/";
app.locals.apiPath =    "http://bugo.or.kr/bugo/API/encrypt.php?data=";
app.locals.apiInsert =  "http://bugo.or.kr/bugo/API/dbio.php?data=";
app.locals.apiUpdate =  "http://bugo.or.kr/bugo/dbio_up.php?data=";

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-status-monitor')());
app.use('/storage', express.static(path.join(app.locals.storagePath)));
app.use('/upload', express.static(path.join(app.locals.uploadPath)));
// app.use('/private', express.static(path.join(app.locals.privatePath))); //실서버 개인작업용 ftp

/** 로그 */
var logFile = fs.createWriteStream('consoleLog.txt', { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
    //logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
/** 여기까지 */

var session = require('express-session'); //세션 모듈 이용
app.use(session({
    secret: '!@#doStoryKaShaDongSung#@!',  //쿠키를 임의로 변조하는것을 방지하기 위한 값. 이값을 통해 세션 암호화
    resave: false,  //세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값. express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정.
    saveUninitialized: true, //세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장.
    cookie: {expires: new Date(253402300000000)}
}));

app.route('*').all(function (req, res, next) {
    var path = req.params[0] ? req.params[0].replace(/\//ig,'') : '';

    if(req.cookies != undefined && req.cookies != null &&
        (req.cookies.userID != undefined) && (req.session.userID == undefined)){
        req.session.userID = req.cookies.userID;
        req.session.userName = req.cookies.userName;
        req.session.uLevel = req.cookies.uLevel;
        req.session.companyID = req.cookies.companyID;
        req.session.companyName = req.cookies.companyName;
    }
    console.log(path);

    if( !(path=="" || path=="doLogin" || path=="doLogout" || path.substring(0,9)=="raspberry" || path.substring(0,10)=="invitation" || path.substring(0,9)=="roomTable") &&
        !(path=="companynameList") &&
        (req.session.userID == undefined || req.session.userID == null) ){
        return res.redirect("/");
    }

    next();
});

var index = require('./routes/index');
app.use('/index', index);

var login = require('./routes/login');
app.use('/', login);

var user = require('./routes/user');
app.use('/user', user);

var company = require('./routes/company');
app.use('/company', company);

var sangju = require('./routes/sangju');
app.use('/sangju', sangju);

var scheduler = require('./routes/scheduler');
app.use('/scheduler', scheduler);

var item = require('./routes/item');
app.use('/item', item);

var machine = require('./routes/machine');
app.use('/machine', machine);

var room = require('./routes/room');
app.use('/room', room);

var stock = require('./routes/stock');
app.use('/stock', stock);

var raspberry = require('./routes/raspberry');
app.use('/raspberry', raspberry);

http.listen(3030, function(){
    console.log("Express server listening on port 3030");
}); // 추가

var clients = {};
app.locals.clients =  clients;
var Controller = require(require('path').resolve('') + '/controllers/raspberry/ctl_raspberry');
var controller = new Controller();
/*** Socket.IO 추가 ***/
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('regist', function(data){
        var json = JSON.parse(data);
        var RIP = json.RIP, IP = json.IP, mac = json.mac;
        var logo = json.logo, waitingViewEnable = json.waitingViewEnable, waitingView = json.waitingView;
        var version = json.version;
        //var RIP = socket.request.headers['x-forwared-for'] || socket.request.connection.remoteAddress;

        if(app.locals.version<=version) {   //라즈베리 버전이 서버 버전보다 같거나 커야지 허용
            controller.put.updateNetworkInfo(socket, mac, RIP, IP, function (fullMac) {    //getViewData와  getUserAccount는 위 함수에서 허가받은 mac일경우 실행clients[fullMac] = socket;
                clients[fullMac] = socket;
                controller.get.checkLogo(socket, app.locals.uploadPath + "logo/", fullMac, logo);
                controller.get.checkWaitingView(socket, app.locals.uploadPath + "waitingView/", fullMac, waitingViewEnable, waitingView);
            });
        }else{
            socket.emit("notAllowVersion");
        }
    });

    socket.on('fileDownload', function(data) {  //이건 사용 안함
        var json = JSON.parse(data);
        var gImage = json.gImage;

        var promiseList = [];
        gImage.forEach(function (element, index) {    //전부 promise로 파일 읽어서
            var p = new Promise(function (resoleve, reject) {
                fs.readFile(app.locals.uploadPath + "guest/" + element, function(error, filedata){
                    try{
                        if(error) { console.log(error); socket.emit("gImageCheck", "gImage download error");  }
                        else {  resoleve({gImage:element, file: filedata.toString('base64')})    };
                    }catch(exception){
                        console.log(exception); socket.emit("gImageCheck", "gImage download error");
                    }
                });
            });
            promiseList.push(p);
        });

        Promise.all(promiseList).then(function (values) {   //promiseList에 있는 promise 모두 실행후 emit
            socket.emit("fileDownload", values);
        }).catch(function (error) {
            console.log(error); socket.emit("gImageCheck", "gImage download error");
        });
    });

    socket.on('disconnect', function(){
        for (var key in clients) {
            if (clients.hasOwnProperty(key) && clients[key] == socket) {
                console.log('user disconnected ' + key);
                delete clients[key];
                break;
            }
        }
    });

//socket.broadcastSystem.out.println("Socket Disconnected");t.emit('hi');    //모두에게 보내기

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {		data : err		});
});

module.exports = app;
