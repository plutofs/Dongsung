/**
 * Created by KaSha on 2017. 4. 10..
 */
var Controller = function(){

    // 루트 디렉토리 경로
    var rootPath = require('path').resolve('');

    // Import
    var connector = require(rootPath + '/utils/database/connector');
    var Model = require(rootPath + '/models/stockModel');

    // initialization
    this.db = new connector();
    this.model = new Model(this.db);

    // Import export Class
    var get = require(rootPath + '/controllers/stock/exports/stock.get');
    var post = require(rootPath + '/controllers/stock/exports/stock.post');
    var put = require(rootPath + '/controllers/stock/exports/stock.put');
    var remove = require(rootPath + '/controllers/stock/exports/stock.remove');

    //instance
    this.get = new get(this.model);
    this.post = new post(this.model);
    this.put = new put(this.model);
    this.remove = new remove(this.model);
};

Controller.prototype = {
    get : this.get,
    post : this.post,
    put : this.put,
    remove : this.remove
};

module.exports = Controller;