/**
 * Created by KaSha on 2017. 6. 7..
 */
var exports = function(){

};
//https://www.npmjs.com/package/excel-export
exports.prototype = {

    exportExcel : function (req, res, next, fileName, rows) {
        var excelExport = require('excel-export');
        var column = Object.keys(rows[0]), cols=[];
        var rowsData = [];


        column.forEach(function(element, index){
            cols.push({caption:element, type:'string', captionStyleIndex:1});
        });

        rows.forEach(function (element, index) {
            var tmp = [];
            column.forEach(function (element2, index2) {
                tmp.push(element[element2] !== null ? element[element2].toString() : "");
            })
            rowsData.push(tmp);
        });

        var conf ={};
        //conf.stylesXmlFile = "public/excelStyles.xml";
        //conf.name = fileName;
        conf.cols = cols;
        conf.rows = rowsData;
        var result = excelExport.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + (this.getDownloadFilename(req, fileName) + ".xlsx"));
        res.end(result, 'binary');
    },

    getDownloadFilename : function(req, filename) {
        var iconvLite = require('iconv-lite');
        var header = req.headers['user-agent'];

        if (header.includes("MSIE") || header.includes("Trident")) {
            return encodeURIComponent(filename).replace(/\\+/gi, "%20");
        } else if (header.includes("Chrome")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        } else if (header.includes("Opera")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        } else if (header.includes("Firefox")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        }

        return filename;
    }
};

module.exports = exports;