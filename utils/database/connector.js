/**
 * Created by KaSha on 2017. 4. 10..
 */
var db = function(){

};

db.prototype = {
    pool : require('mysql').createPool({
        connectionLimit: 100,
        connectTimeout: 5000,
        acquireTimeout: 5000,   //연결을 획득하는 동안 시간 초과가 발생하기 전의 밀리 초
        // queueLimit: 30, //오류를 반환하기 전에 풀에서 큐에 대기 할 최대 연결 요청 수. 0은 제한 없음
        //host: 'localhost',
        host: '211.115.107.245',
        port : 3306,
        user : 'root',
        password : 'Dostory8520!!',
        database : 'DONGSUNG',
        // database : 'DONGSUNGTS',
        multipleStatements: true
    }),

    execute : function(SQL, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err);
            } else {
                console.log(SQL);
                connection.query(SQL, function(err, rows, constant) {
                    connection.release();

                    console.log(JSON.stringify(rows));
                    callback (err, rows);
                });
            }
        });
    },

    only_execute : function(SQL){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err);
            } else {
                //console.log(SQL);
                connection.query(SQL, function(err, rows) {
                    connection.release();
                    //console.log(JSON.stringify(rows));
                });
            }
        });
    }
};

module.exports = db;
