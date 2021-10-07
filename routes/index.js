var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  res.render('index', { session : req.session, req : req });  });

router.post('/totalPwd', function(req, res, next) {
    var pwd = req.body.pwd;
    var HttpCode = require(require('path').resolve('') + '/const/httpCode');
    var HTTP_CODE = 405;
    if (req.app.locals.totalPwd === pwd) {
        HTTP_CODE = 200;
    }
    res.json(HttpCode.getResponseBody(HTTP_CODE));
});

module.exports = router;
