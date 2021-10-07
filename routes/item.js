/**
 * Created by KaSha on 2017. 4. 6..
 */
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
    res.render('item', { title: 'DongSung item' });
});

module.exports = router;
