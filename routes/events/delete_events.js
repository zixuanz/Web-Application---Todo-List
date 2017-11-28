var express = require('express');
var router = express.Router();
var pool = require('../../dbConn.js');

router.delete('/', function(req, res, next) {

  var eventId = req.body.eventId;
  console.log(eventId);

  var script = "DELETE FROM events WHERE id=";
  var sql = "";
  if(Array.isArray(eventId)){
    eventId.forEach(function(id){
      sql += script+id+";";
    });
  }else{
    sql += script+eventId;
  };

  pool.getConnection((err, con) =>{
    if(err){
      res.json({
        "code": 100,
        "status": "ERROR: Failed to connect database."
      });
      return;
    }

    console.log('connected as id ' + con.threadId);

    con.query(sql, (err,rows) =>{
      con.release();
      if(err) {

      }else{
        console.log("delete");
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
