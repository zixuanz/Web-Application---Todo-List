var express = require('express');
var router = express.Router();
var pool = require('../../dbConn.js');

router.get('/', function(req, res, next) {

  pool.getConnection((err, con) =>{
    if(err){
      res.json({
        "code": 100,
        "status": "ERROR: Failed to connect database."
      });
      return;
    }

    console.log('connected as id ' + con.threadId);

    con.query("select * from events",(err,rows) =>{
      con.release();
      var events = [];
      if(!err) {
        console.log("rows length"+ rows.length)
        for (var i=0; i<rows.length; i++) {
          events.push({
            "id": rows[i].id,
            "title": rows[i].title,
            "detail": rows[i].detail,
            "completed": rows[i].completed,
            "priority": rows[i].priority,
            "checked": false
          });
        };
        res.end(JSON.stringify(events));
      };
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
