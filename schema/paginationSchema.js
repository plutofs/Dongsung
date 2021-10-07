/**
 * Created by KaSha on 2017. 4. 10..
 */
var schemaModel = function() {
    this.mysql = require('mysql');

    this.page = null;   // get the requested page
    this.rows = null;   // get how many rows we want to have into the grid
    this.sidx = null;   // get index row - i.e. user click to sort
    this.sord = null;   // get the direction
    this.searchField = null;    // 검색 필드
    this.searchOper = null;     // 검색 방법
    this.searchString = null;   // 검색어
    this.searchQuery = " ";    //종합 서치 쿼리
}

schemaModel.prototype = {
    setParam : function (parameter) {   //body나 param으로 보낼것.
        this.page = (parameter.page == undefined) ? null : parameter.page;
        this.rows = (parameter.rows == undefined) ? null : parameter.rows;
        this.sidx = (parameter.sidx == undefined) ? null : parameter.sidx;
        this.sord = (parameter.sord == undefined) ? null : parameter.sord;
        this.searchField = (parameter.searchField == undefined) ? null : parameter.searchField;
        this.searchOper = (parameter.searchOper == undefined) ? null : parameter.searchOper;
        this.searchString = (parameter.searchString == undefined) ? null : parameter.searchString;

        if(this.searchOper != undefined && this.searchOper != null && this.searchOper != ""){
            var search = this.searchString;
            if(this.searchField === "company"){
                this.searchField = "CONCAT(C.`cName`, '/', C.`master`)";
            }else if(this.searchField === "mType"){
                this.searchField = "CASE `mType` WHEN 0 THEN '빈소' WHEN 1 THEN '종합' WHEN 2 THEN '입관' ELSE '에러' END";
            }else if(this.searchField === "mEnable"){
                this.searchField = "CASE `mEnable` WHEN 0 THEN '비활성화' WHEN 1 THEN '활성화' END";
            }

            switch (this.searchOper){
                case "eq":  //equal
                    this.searchQuery = " AND " + this.searchField + " = ? ";
                    break;
                case "ne":  //not equal (<>)
                    this.searchQuery = " AND " + this.searchField + " <> ? ";
                    break;
                case "lt":  //little (<)
                    this.searchQuery = " AND " + this.searchField + " < ? ";
                    break;
                case "le":  //little or equal (<=)
                    this.searchQuery = " AND " + this.searchField + " <= ? ";
                    break;
                case "gt":  //greater (>)
                    this.searchQuery = " AND " + this.searchField + " > ? ";
                    break;
                case "ge":  //greater or equal (>=)
                    this.searchQuery = " AND " + this.searchField + " >= ? ";
                    break;
                case "ew":  //ends with (LIKE %val)
                    this.searchQuery = " AND " + this.searchField + " LIKE ? ";
                    search = "%" + search;
                    break;
                case "bw":  //begins with (LIKE val%)
                    this.searchQuery = " AND " + this.searchField + " LIKE ? ";
                    search += "%";
                    break;
                case "cn":  //contain (LIKE %val%)
                    this.searchQuery = " AND " + this.searchField + " LIKE ? ";
                    search = "%" + search + "%";
                    break;
                default:
                    this.searchQuery = " ";
                    break;
            }

            if(this.searchQuery != " "){
                this.searchQuery = this.mysql.format(this.searchQuery, [search]);
            }
        }
    }
}

module.exports = schemaModel;
