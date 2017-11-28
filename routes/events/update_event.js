var express = require('express');
var router = express.Router();
var pool = require('../../dbConn.js');

router.put('/', function(req, res, next) {
  console.log(req.body);
  var data = req.body;
  var sql = "";
  var start = "UPDATE events SET ";
  var middle = data.cols[0] + " = ?";
  for(var i=1; i<data.cols.length; i++){
    middle += ", " + data.cols[i] + " = ?";
  }
  sql = start + middle + " WHERE id = " + data.id + ";";
  console.log(sql);
  /*
  if(Array.isArray(data)){
    data.forEach(function(item){
      var start = "UPDATE events SET ";
      var middle = item.cols[0] + " = " + item.vals[0];
      for(var i=1; i<item.cols.length; i++){
        middle += ", " + item.cols[i] + " = " + item.vals[i];
      }
      sql += start + middle + " WHERE id = " + item.id + ";";
      console.log(sql);
    });
  }else{
    var start = "UPDATE events SET ";
    var middle = data.cols[0] + " = " + data.vals[0];
    for(var i=1; i<data.cols.length; i++){
      middle += ", " + data.cols[i] + " = " + data.vals[i];
    }
    sql = start + middle + " WHERE id = " + data.id + ";";
    console.log(sql);
  };
*/

  pool.getConnection((err, con) =>{
    if(err){
      res.json({
        "code": 100,
        "status": "ERROR: Failed to connect database."
      });
      return;
    }

    console.log('connected as id ' + con.threadId);

    con.query(sql, data.vals, (err,rows) =>{
      con.release();
      if(err) {
        res.status(400).end();
      }else{
        console.log(rows);
        res.end();
      }
    });

    con.on("error", (err) =>{
      res.json({
        "code" : 100,
        "status" : "ERROR: Something wrong in connection database."
      });
      return;
    });
  });

});

module.exports = router;
